import { createCatalogCard, createServiceCard, createAndUpdateInfoCard, extractSubstrings, iconInsertion } from "./main/createrObj.js";
import { getCatalogId, getCellNameById, getCatalogsId, getCurState, getLastSubCatalog, getLastParam, tryJsonParse } from "./util.js";
import { showInfoCard } from "./showInfo.js";
import { createCategory, updateCategoryMainIcon, updateCategoryGifPreview,
    createService, addServiceCategory, removeServiceCategory,  addServiceIcon, updateServiceMainIcon, updateServiceGif, updateServiceDescription, updateServiceGifPreview, clearServiceIcons,
    createAddition, updateAdditionTitle, addAdditionIcon, updateAdditionMainIcon, updateAdditionGifPreview, updateAdditionGif,  updateAdditionDescription,
    uploadToS3, clearAdditionIcons,
    setCategoryParent,
    getServiceById,
    getInfoById,
} from "./api/api.js";


const showHideInputs = ()=>{
    const addExtra = document.querySelector(".add-extra");
    const hideExtra = document.querySelector(".hide-extra");
    const parentIdLabel = document.getElementById('parent-id-label');
    const parentIdSelect = document.getElementById('parent-id');

    addExtra.addEventListener("click", ()=>{
        if (!document.querySelector(".parent-choose").classList.contains("hidden")){
            if (addExtra.checked) {
                //parentIdLabel.classList.remove('hidden');
                //parentIdSelect.classList.remove('hidden');
                document.getElementById("parent-id").setAttribute("disabled","")
    
                document.querySelector(".common-card").classList.remove("hidden");
                document.querySelector(".res-card").classList.remove("hidden");
    
                //document.querySelectorAll(".reduced").forEach((item)=> item.classList.remove("hidden"))
                //document.querySelectorAll(".conditional").forEach((item)=> item.classList.remove("hidden"))
                //document.querySelectorAll(".parent-existence").forEach((item)=> item.classList.add("hidden"))
            }
        }
    })
    hideExtra.addEventListener("click", ()=>{
        if (!document.querySelector(".parent-choose").classList.contains("hidden")){
            if(hideExtra.checked){
                document.getElementById("parent-id").removeAttribute("disabled")

                document.querySelector(".common-card").classList.add("hidden");
                document.querySelector(".res-card").classList.add("hidden");

                //document.querySelectorAll(".reduced").forEach((item)=> item.classList.add("hidden"))
                //document.querySelectorAll(".conditional").forEach((item)=> item.classList.add("hidden"))
                // parentIdLabel.classList.add('hidden');
                //parentIdSelect.classList.add('hidden');
            }
        }
    })
}

const setIdAfterAdd = (type, id)=>{
    const attribute = type === 'info-cards'  ? 'info-id' : type === 'catalogs-list' ? "catalog-id":"service-id";
    const element = document.querySelector(`li[${attribute}="undefined"]`);
    if (element){
        element.setAttribute(`${attribute}`, id);
    }
}

let iconLinks;

const handleUpdate =  (condition, updateFunc, updateEvent) => {
    if (condition) {
        try {
            if (updateFunc){
                updateFunc();
                console.log("выполнилось ?", condition);
                //await document.dispatchEvent(updateEvent);
            } 
        } catch (error) {
            console.error('Error during update:', error);
        }
    }
};

const setIdAndAddIcons = async(type, data, iconLinks)=>{
    setIdAfterAdd(type, data.id);
    for (const link of iconLinks) {
        if (type === "services-list") await addServiceIcon(data.id, { link });
        if (type === "info-cards") await addAdditionIcon(data.id, { link });
        window.location.reload();
    }
}

const sendCardToBd = async (type, sendData, parentId, iconLinks) => {
    const catalog = 'catalogs-list';
    const service = 'services-list';
    const info = 'info-cards';
    const actions = {
        [catalog]: async () => {
            const data = await createCategory(sendData);
            await setIdAfterAdd(catalog, data.id);
            endFormWithLoader();
        },
        ["sub-catalog"]: async () => {
            const data = await createCategory(sendData);
            await setCategoryParent(data.id, parentId)
            await setIdAfterAdd(catalog, data.id);
            endFormWithLoader();
        },
        [service]: async () => {
            const data = await createService(sendData);
            //await addServiceCategory(data.id, parentId);
            await addServiceCategory(data.id, parentId);
            await setIdAndAddIcons(service, data, iconLinks);
            endFormWithLoader();
            /*setIdAfterAdd(service, data.id);
            for (const link of iconLinks) {
                await addServiceIcon(data.id, { link });
            }*/
        },
        [info]: async () => {
            const data = await createAddition(sendData);
            await setIdAndAddIcons(info, data, iconLinks);
            endFormWithLoader();
            /*setIdAfterAdd(info, data.id);
            for (const link of iconLinks) {
                await addAdditionIcon(data.id, { link });
            }*/
        }
    };
    if (actions[type]) {
        await actions[type]();
    } else {
        console.log("Ошибка с созданием запроса добавления");
    }
};

const createSendData = (state, listToAdd, type, title, image, video, resVideo, description, parentId) => {
    let newCard, sendToBd;
    const language = window.localStorage.getItem("language");
    const isClear = language === "clear-language" ?true:false;

    //console.log(url)
   // const isClear = listToAdd.parentNode.classList.contains("clear-language");
    if (state === "info-cards") {
        const infoTmp = {
            mainIconLink: image,
            gifLink: video,
            gifPreview: video,
            description: description || ".",
            title: title,
        };
        sendToBd = { ...infoTmp, itemId: parentId };
        newCard = createAndUpdateInfoCard(infoTmp);
    } else if (type === 'catalog') {
        const category = {
            gifLink: video,
            gifPreview: video,
            mainIconLink: image,
            itemsInCategoryIds: [],
            title: title,
            parentCategoryId: ''
        };
        sendToBd = { ...category };
        newCard = createCatalogCard(category, isClear);
    } else if (type === 'service') {
        const service = {
            gifLink: resVideo || "",
            gifPreview: video,
            mainIconLink: image,
            description: description || ".",
            title: title,
            categoryId: parentId,
        };
        sendToBd = { ...service };
        newCard = createServiceCard(service, isClear);
    }

    return { newCard, sendToBd };
};

const submitForm = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    showLoader();


    const form = document.getElementById('card-form');

    let state = getCurState();
    if (lastClickedButton.classList.contains("edit-element-button")){
        state = form.classList.contains("inside-service") ? "services-list": 'info-cards';
    }
    const targetCard = lastClickedButton.closest("li");
    let action  = "edit";
    let listToAdd ;
    if (targetCard){
        action = targetCard.classList.contains("card-to-add") ? 'add' : 'edit';
        listToAdd = targetCard.parentNode;
    }

    
    const attribute = state === 'info-cards' ? 'info-id' : state === 'catalogs-list' ? "catalog-id" : "service-id";

    if (isSubCatalog()){
        state = "catalogs-list";
        type = "catalog";
    }


    const search = new URLSearchParams(window.location.search);
    let parentId = search.get("catalog") || search.get("serviceId");
    //const addExtra = document.querySelector(".add-extra");
    let type = state === "services-list" ? 'service' : 'catalog';
    const title = document.getElementById('title').value;
    const image = document.getElementById('image').value;
    const video = document.getElementById('video').value;
    const resVideo = document.getElementById('resVideo').value;
    const resText = assembleDescription();
    const description = resText.description;
    const iconLinks = resText.iconLinks;

    if (action === 'add') {
        /*if (isSubCatalog()){
            state = "catalogs-list";
            type = "catalog";
        }*/
        const { newCard, sendToBd } = createSendData(state, listToAdd, type, title, image, video, resVideo, description, parentId);
        if (sendToBd) {
            if (isSubCatalog()){
                if (parentId){
                    sendCardToBd("sub-catalog", sendToBd, parentId, iconLinks);
                }
                else{
                    sendCardToBd("sub-catalog", sendToBd, getLastSubCatalog(), iconLinks);
                }
                
            }
            else{
                sendCardToBd(state, sendToBd, parentId, iconLinks);
            }            
        } else {
            console.error("Error: Invalid form data.");
        }
        if (state === "info-cards") {
            showInfoCard(sendToBd);
        } else {
            listToAdd.appendChild(newCard);
        }
        const cardAddedEvent = new CustomEvent('newCardCreated', { detail: { card: newCard } });
        document.dispatchEvent(cardAddedEvent);
        //console.log("should added: ", newCard);
    } else {
/*
        if (isSubCatalog()){
            state = "catalogs-list";
            type = "catalog";
        }*/
        
        const promises = [];

        
        const url = new URLSearchParams(window.location.search);
        let id = targetCard ? targetCard.getAttribute(attribute) : url.get("serviceId");
        if (document.querySelector(".additional-info-res") && document.querySelector(".additional-info-res").classList[1]){
            id = document.querySelector(".additional-info-res").classList[1];
        }

        const selectElement = document.getElementById('parent-id');
        const selectedValue = selectElement.value;

        if (parentId){
            if (!selectElement.classList.contains("hidden") && selectedValue !== parentId && state !== "info-cards"){
                await removeServiceCategory(id).then(() =>{ 
                    (addServiceCategory(id, selectedValue));
                    endFormWithLoader();
                    window.location.reload();
                });
            }     
        }
        else{
            if (title && state === 'info-cards') promises.push(updateAdditionTitle(id, { title }));

            if (image){
                if (state === 'catalogs-list') promises.push(updateCategoryMainIcon(id, { image }));
                if (state === 'services-list') promises.push(updateServiceMainIcon(id, { image }));
                if (state === 'info-cards') promises.push(updateAdditionMainIcon(id, { image }));
            }
    
            if (video){
                if (state === 'catalogs-list') promises.push(updateCategoryGifPreview(id, { video }));
                if (state === 'services-list') promises.push(updateServiceGifPreview(id, { video }));
                if (state === 'info-cards') promises.push(updateAdditionGifPreview(id, { video }));
            }
    
            if (resVideo){
                if (state === 'services-list') promises.push(updateServiceGif(id, { resVideo }));
                if (state === 'info-cards') promises.push(updateAdditionGif(id, { resVideo }));
            }
    
            if (description) {
                if (state === 'services-list') {
                    promises.push(updateServiceDescription(id, { description }));
                }
                if (state === 'info-cards') {
                    promises.push(updateAdditionDescription(id, { description }));
                }
            }
    
            if (description && iconLinks.length !== 0) {
                if (state === 'services-list') {
                    promises.push(clearServiceIcons(id).then(() => {
                        for (const link of iconLinks) {
                            promises.push(addServiceIcon(id, { link }));
                        }
                    }));
                }
                if (state === 'info-cards') {
                    promises.push(clearAdditionIcons(id).then(() => {
                        for (const link of iconLinks) {
                            promises.push(addAdditionIcon(id, { link }));
                        }
                    }));
                }
    
            }
                // Ожидаем завершения всех промисов
                /* await*/ Promise.all(promises).then(()=>{
                /*form.removeEventListener('submit', submitForm);
                document.getElementById('card-form-container').classList.add('hidden');
                form.reset();
                
                hideLoader();*/
                endFormWithLoader();

                // Перезагрузка страницы после завершения всех запросов
                window.location.reload();
            })

        }

    }
    if (state === "info-cards"){
        document.querySelector(".close-info").click();
    }
   /*form.removeEventListener('submit', submitForm);
   document.getElementById('card-form-container').classList.add('hidden');
   form.reset();*/
};




const assembleDescription = ()=>{
    const listOfLi = document.querySelectorAll(".res-text-parts.part");
    let textRes = '';
    let iconRes = [];
    let count = 0;
    listOfLi.forEach((li)=>{
        const description = li.querySelector('#res-description').value;//"Тестовое наполнение";
        const icon = li.querySelector('#res-icon').value;
        if (icon){
            iconRes[count] = icon;
        }
        if (description !== ""){
            if (icon === ""){
                textRes += description + "\n";
            }
            else{
                textRes += "\n- " + description + `\n\\icon${count}`;//'\n-sdgfdsgsdg\n\\icon1'
                count++;
            }
        }
    })
    const res = {description:textRes, iconLinks:iconRes}
    return res;
}

let fileInputCounter = 2;

const updateFileInputAttributes = (listItem)=> {
    fileInputCounter++;
    const uniqueId = `fileInputIcon${fileInputCounter}`;
    
    const fileInput = listItem.querySelector('input[type="file"]');
    const fileLabel = listItem.querySelector('label[for="fileInputIcon1"]');

    if (fileInput && fileLabel) {
        fileInput.id = uniqueId;
        fileLabel.setAttribute('for', uniqueId);
    }

    // Добавляем обработчик события change для нового input
    fileInput.addEventListener('change', function(event) {
        if (event.target.files.length > 0) {
            console.log("Файл выбран:", event.target.files[0].name);
        } else {
            console.log("Файл не выбран");
        }
    });
}


const addNewResBlockButton = ()=>{
    const list = document.querySelector(".res-text-parts.list");
    const first = list.children[0];
    const clone = document.importNode(first, true);
    clone.querySelectorAll("textarea").forEach((input) => {
        input.value = "";
        input.textContent = "";
    })
    clone.querySelectorAll("input").forEach((input) => {
        input.value = "";
        input.textContent = "";
    })
    iconInsertAndChange(clone);
    list.appendChild(clone);

    updateFileInputAttributes(clone);
    const uploadButton = document.querySelectorAll(".upload-file").forEach((button)=>{
        button.addEventListener("click", uploadFile);
    });
}

const isValidUrl = (string)=> {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

const changeImgByInput =(container, input)=>{
    const img = container.querySelector(".icons");
    const url = input.value;
    if (isValidUrl(url)) {
        img.src = url;
        img.classList.remove("opacity")
    } else {
        img.src = '/img/empty.jpg';
        img.classList.add("opacity")
    }
}

const iconInsertAndChange = (element)=>{
    let input = element.querySelector('#res-icon');
    if (!input){
        input = element.querySelector('#image');
    }

    // Обработчик ввода
    //input.addEventListener("DOMContentLoaded", changeImgByInput)
    input.addEventListener('input', ()=>changeImgByInput(element, input));
}

const addNewResBlockWithText = (blockOfText, iconLinks = null)=>{
    const list = document.querySelector(".res-text-parts.list");
    const first = list.children[0];
    for (let i = 0; i < blockOfText.length; i++){
        const block = splitString(blockOfText[i]);
        const text = block.cleanedString;
        const icon = block.extractedString;
        const clone = document.importNode(first, true);
        clone.querySelectorAll("textarea").forEach((input) => {
            input.value = text;
            input.textContent = text;
        })
        let divWithImg = clone.querySelector(".icon-add-container .icon-of-url");
        //divWithImg.classList.add("icon-of-url")
        clone.querySelectorAll("#res-icon").forEach((input) => {
            if (iconLinks && iconLinks.length > 0){
                const img = iconInsertion(icon ,iconLinks);
                if (img){
                divWithImg.innerHTML = img;
                const regex = /<img[^>]+src="([^">]+)"/;
                const match = img.match(regex);
                if (match && match[1]) {
                    const srcValue = match[1];
                    input.value = srcValue;
                    input.textContent = srcValue;
                }
            }
            }
            else{
                input.value = icon;
                input.textContent = icon;
            }
        })
        //clone.querySelector(".icon-add-container .icon-of-url").appendChild(divWithImg);
        iconInsertAndChange(clone);
        updateFileInputAttributes(clone);
        list.appendChild(clone);
    }
    const uploadButton = document.querySelectorAll(".upload-file").forEach((button)=>{
        button.addEventListener("click", uploadFile);
    });

    first.remove();
}


const removeNewResBlocks = ()=>{
    const list = document.querySelector(".res-text-parts.list");
    removeAllChildrenExceptFirst(list);
}

const removeReducedForm = () => {
    // Remove hidden class from all conditional elements
    document.querySelectorAll('.conditional').forEach(el => el.classList.remove('hidden'));
    document.querySelectorAll('.reduced').forEach(el => el.classList.remove('hidden'));

    //document.querySelectorAll('#type').forEach(el => el.setAttribute("required", ""));
    document.querySelectorAll('[for="title"], #title').forEach(el => el.setAttribute("required", ""));
}

const toggleClassToForm = (elemet)=>{
    const resTitle = elemet.classList.contains("res-title");
    let manual;
    if (elemet.parentNode) manual = elemet.parentNode.classList.contains("manual") ;
    const trueManual = elemet.parentNode.classList.contains("true-manual");
    if (!resTitle && !manual && !trueManual){
        document.getElementById("card-form").classList.remove("inside-service");
    }
    else{
        document.getElementById("card-form").classList.add("inside-service");
    }
}

const clearDescriptionBlock = ()=>{
    const list = document.querySelector(".res-text-parts.list");
    if (list){
        const first = list.children[0];
        first.querySelectorAll("textarea").forEach((input) => {
            input.value = "";
            input.textContent = "";
        })
        first.querySelectorAll("input").forEach((input) => {
            input.value = "";
            input.textContent = "";
        })
    }
}


const hideForm = ()=>{
    document.getElementById('card-form-container').classList.add('hidden');
    const parentsOption = document.getElementById("parent-id");
    removeAllChildrenExceptFirst(parentsOption);
    removeNewResBlocks();
    removeReducedForm();

    toggleClassToForm(lastClickedButton);

    clearDescriptionBlock();

}

let lastClickedButton = null;

const removeAllChildrenExceptFirst = (parentElement)=> {
    while (parentElement.children.length > 1) {
      parentElement.removeChild(parentElement.lastChild);
    }
}

const isSubCatalog = ()=>{
const allSubCatalogs = document.querySelectorAll("div.subCategory-create");
let allVisible = Array.from(allSubCatalogs).every(sub => !sub.classList.contains("hidden"));
    if (!allVisible){
        if(document.querySelector(".createSub").checked){
            return true;
        }
    }
    return false;
}
const changeParentOptions = (targetCard)=>{
    const state = getCurState();

    const parentDivs = document.querySelectorAll(".parent-existence");
    const resDivs = document.querySelector("section.res-card");

    const parentChoose = document.querySelector(".parent-choose");

    document.querySelector(".createSub").checked = false;

    if (state === 'catalogs-list'){
        document.querySelector("div.subCategory-create").classList.add("hidden");
        //resDivs.forEach((div)=> div.classList.add("hidden"))
        resDivs.classList.add("hidden");

        parentChoose.classList.add("hidden");
        /*const typeOfParent = document.querySelectorAll("div.parent-existence");
        typeOfParent.forEach(parent=>{
            parent.classList.add("hidden");
        })
        document.querySelector(`label.parent-existence`).classList.add("hidden");*/
    }
    else if (state === 'info-cards'){
        document.querySelector("div.subCategory-create").classList.add("hidden");
        /*const typeOfParent = document.querySelectorAll("div.parent-existence");
        typeOfParent.forEach(parent=>{
            parent.classList.add("hidden");
        })
        document.querySelector(`label.parent-existence`).classList.add("hidden");*/
        parentChoose.classList.add("hidden");
        parentDivs.forEach((div)=> div.classList.add("hidden"))
    }
    else{

        /*const typeOfParent = document.querySelectorAll("div.parent-existence");
        typeOfParent.forEach(parent=>{
            parent.classList.add("hidden");
        })
        document.querySelector(`label.parent-existence`).classList.add("hidden");*/


        resDivs.classList.remove("hidden");
        /*resDivs.forEach((div)=>{ 
            if (div.classList.contains("hidden")){
                div.classList.remove("hidden")
            }
        });*/
        /*parentDivs.forEach((div)=>{ 
            if (div.classList.contains("hidden")){
                div.classList.remove("hidden")
            }
        });*/
    }

    if (state === "services-list"){
        const parentsOption = document.getElementById("parent-id");
        

        parentChoose.classList.remove("hidden");

        const addExtra = document.querySelector(".add-extra");
        //addExtra.checked = true;
        addExtra.click();
        const catalogName = getCellNameById(getCatalogId())

        removeAllChildrenExceptFirst(parentsOption);
        const firstChild =  parentsOption.querySelectorAll("option")[0];
        if (firstChild){
            parentsOption.querySelectorAll("option")[0].textContent = catalogName;
            parentsOption.querySelectorAll("option")[0].value = getCatalogId();
        }

        const allCatalogs = [];
        const allCatalogId = getCatalogsId();
        allCatalogId.forEach(item =>{
            if (item){
                const name = getCellNameById(item);
                if (name !== catalogName){
                    allCatalogs.push({name:name, id:item})
                }
                else{
                    parentsOption.querySelectorAll("option")[0].value = item;
                }
            }
        });
        //getCatalogsNames().filter(item => item !== catalogName);
        for (let i = 0; i < allCatalogs.length; i++){
            const clone = document.importNode(firstChild, true);
            clone.textContent = allCatalogs[i].name;
            clone.value = allCatalogs[i].id;
            parentsOption.appendChild(clone);
        }
    }
    else{
        //const hideExtra = document.querySelector(".hide-extra");
        //hideExtra.click();
    }

    if (state === "services-list"){
        const parentsOption = document.getElementById("parent-id");
        const createSubCatalog =  document.querySelector(".createSub");
        const noCreateSubCatalog = document.querySelector(".noCreateSub")



            createSubCatalog.addEventListener("click", ()=>{
                createSubCatalog.checked = true;
                const value = createSubCatalog.checked;
                if (value){
                    resDivs.classList.add("hidden");
                    document.querySelector("section.res-card").classList.add("hidden");
                }
            })
            noCreateSubCatalog.addEventListener("click", ()=>{
                noCreateSubCatalog.checked = true;
                const value = createSubCatalog.checked;
                if (!value){
                    resDivs.classList.remove("hidden");
                    document.querySelector("section.res-card").classList.remove("hidden");
                }
            });

        if (targetCard.classList.contains("card-to-add") && !targetCard.parentNode.querySelector(".service-card") ){
            document.querySelector("div.subCategory-create").classList.remove("hidden");

        }
        if (parentsOption.length > 0 && (parentsOption[0].value === "null" || parentsOption[0].value === "1")) {
            noCreateSubCatalog.disabled = true;
            createSubCatalog.checked = true;
            createSubCatalog.click();
            document.querySelector("section.res-card").classList.add("hidden");

        }
        if (createSubCatalog.checked){
            document.querySelector(".parent-choose").classList.add("hidden");
        }
    }


}

// Функция для настройки формы для редактирования карточки
const setFormForEditCard = (submitButton) => {
    submitButton.textContent = "Изменить карточку";
}

// Функция для настройки формы для добавления карточки
const setFormForAddCard = (submitButton, inputElement) => {
    submitButton.textContent = "Добавить карточку";
    //inputElement.setAttribute('required', '');
}

// Функция для скрытия поля ввода заголовка
const hideTitleInput = (inputElement, labelElement) => {
    inputElement.classList.add("hidden");
    labelElement.classList.add("hidden");
    //inputElement.removeAttribute('required');
}

// Функция для показа поля ввода заголовка
const showTitleInput = (inputElement, labelElement) => {
    inputElement.classList.remove("hidden");
    labelElement.classList.remove("hidden");
    //inputElement.setAttribute('required', '');
}

const updateFormBasedOnCardState = (targetCard) => {
    const inputElement = document.getElementById('title');
    const labelElement = document.querySelector(`label[for="${inputElement.id}"]`);
    const submitButton = document.querySelector(".submit-form");

    if (!targetCard.classList.contains("card-to-add") && !targetCard.classList.contains("info-card")) {
        setFormForEditCard(submitButton);
        hideTitleInput(inputElement, labelElement);
    } else if (targetCard.classList.contains("info-card")) {
        setFormForEditCard(submitButton);
        inputElement.removeAttribute('required');
    } else {
        setFormForAddCard(submitButton, inputElement);
        showTitleInput(inputElement, labelElement);
    }
}

const showLoader = ()=>{
    const submitButton = document.querySelector(".submit-form");
    submitButton.disabled = true; 
    document.getElementById('loader').classList.remove('hidden');
}
const hideLoader = ()=>{
    const submitButton = document.querySelector(".submit-form");
    submitButton.disabled = false; 
    document.getElementById('loader').classList.add('hidden');
}

const endFormWithLoader = ()=>{
    const form = document.getElementById('card-form');
    form.removeEventListener('submit', submitForm);
    document.getElementById('card-form-container').classList.add('hidden');
    form.reset();
    hideLoader();
}

const getDescription = (targetCard = null)=>{
    let action  = "edit";
    if (targetCard){
        action = targetCard.classList.contains("card-to-add") ? 'add' : 'edit';
    }

    if (action === "add"){
        const list = document.querySelector(".res-text-parts.list");
        const first = list.children[0];
        first.querySelectorAll("textarea").forEach((input) => {
            input.value = "";
            input.textContent = "";
        })
        first.querySelectorAll("input").forEach((input) => {
            input.value = "";
            input.textContent = "";
        })
    }

    let state = getCurState();
    const lastParam = getLastParam();
    if (lastParam && lastParam.indexOf("sub-catalog")>=0){
        state = "sub-catalogs-list";
    }
    if (action === "edit" && (state === "services-list" || state === "info-cards")){
        showLoader()
        const attribute = state === 'info-cards' ? 'info-id' : state === 'catalogs-list' ? "catalog-id" : "service-id";
        let id;
        if (targetCard) id = targetCard.getAttribute(attribute);
        else id = new URLSearchParams(window.location.search).get("serviceId");
        if(state === "services-list") getServiceById(id).then((data)=>fillDescriptionInForm(data));
        if (state === "info-cards") getInfoById(id).then((data)=>fillDescriptionInForm(data));
    }
}

const fillDescriptionInForm = (data)=>{
    const description = tryJsonParse(data.description, "description");
    //const text = document.querySelector(".res-description");
    const iconLinks = data.iconLinks;
    //.res-description сами блоки текста
    //res-text-parts list список блоков текста и иконок
    const blocksOfText = extractSubstrings(description);
    addNewResBlockWithText(blocksOfText, iconLinks)
    //console.log(blocksOfText)
    hideLoader();
}

const splitString = (input)=> {
    // Регулярное выражение для поиска подстроки \n\\iconЧисло
    const regex = /\n\\icon\d+/g;
    
    // Строка, содержащая только подстроки \n\\iconЧисло
    const extracted = input.match(regex)?.join('') || '';

    // Строка без подстрок \n\\iconЧисло
    const cleaned = input.replace(regex, '');
    const strings = {cleanedString:cleaned, extractedString:extracted}
    return strings;
}
/*
document.addEventListener("DOMContentLoaded", ()=> {
    const mainIcon = document.querySelector(".icon-add-container.main-icon");
    if (mainIcon){
        iconInsertAndChange(mainIcon);
        changeImgByInput(mainIcon, mainIcon.querySelector("input"));
    } 
})
*/
const showForm = ()=>{
    event.stopPropagation();

    const mainIcon = document.querySelector(".icon-add-container.main-icon");
    if (mainIcon) iconInsertAndChange(mainIcon);

    const list = document.querySelector("ul.res-text-parts");
    if (list) iconInsertAndChange(list.children[0]);

    document.getElementById('title').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            const cursorPos = this.selectionStart;
            const value = this.value;
            this.value = value.slice(0, cursorPos) + '\n' + value.slice(cursorPos);
            this.selectionStart = cursorPos + 1;
            this.selectionEnd = cursorPos + 1;
        }
    });

    lastClickedButton = event.currentTarget;
    const targetCard = lastClickedButton.closest("li");

    
    if (targetCard)
    {
        getDescription(targetCard);


        updateFormBasedOnCardState(targetCard);
        changeParentOptions(targetCard);


        if(targetCard.classList.contains("card-to-add")){
            document.getElementById("parent-id").setAttribute("disabled","")
            document.querySelectorAll(".parent-existence").forEach((item)=> item.classList.add("hidden"))


        }

        const res = document.getElementById("resVideo");
        const title = document.getElementById("title");
        const video = document.getElementById("video");
        const image = document.getElementById("image");
        
        const event = new Event('input');

        if(lastClickedButton.classList.contains("edit-button")){

            if ( targetCard.querySelector(".card-button")){
                const resVid = targetCard.querySelector(".card-button");
                if (image && resVid){
                    res.value = resVid.dataset.ressrc;;
                }
            }

            const language = window.localStorage.getItem("language");
            const isClear = language === "clear-language" ?true:false;
    
            if (targetCard.querySelector(".card-title")){
                title.value = targetCard.querySelector(".card-title").textContent;
            }
            else {
                title.value = "";
            }
    
            if (isClear){
 
                image.value = targetCard.querySelector(".card-button").dataset.iconsrc;
                document.getElementById("video").value = targetCard.querySelector(".card-button").dataset.gifsrc;
                image.dispatchEvent(event);
            }
            else{

                video.value = targetCard.querySelector("video").src;
                document.getElementById("image").value = targetCard.querySelector(".card-button").dataset.iconsrc;
                
                image.dispatchEvent(event);
            }
        }
        else{
            title.value = "";
            image.dispatchEvent(event);
            image.value = "";
            video.value = "";
            res.value  = "";    
        }

    }
    else if(lastClickedButton.classList.contains("edit-button") ||
    lastClickedButton.classList.contains("edit-element-button")){
        setFormForEditCard(document.querySelector(".submit-form"));
        document.getElementById("parent-id").removeAttribute("disabled");
        getDescription();
    }
    if (lastClickedButton.classList.contains("edit-element-button")){
        const title = document.getElementById("title");
        if (document.querySelector("h3.title")){
            title.value = document.querySelector("h3.popup-title").textContent;
        }
        const resVid = document.getElementById("resVideo");
        if (lastClickedButton.parentNode.querySelector("video")){
            resVid.value = lastClickedButton.parentNode.querySelector("video").src;
        }
    }

    /*            const title = document.getElementById("title");
            title.value = "";
    
            if (isClear){
                const image = document.getElementById("image");
                image.value = targetCard.querySelector(".card-button").dataset.iconsrc;
                document.getElementById("video").value = targetCard.querySelector(".card-button").dataset.gifsrc;
            }
            else{
                const video = document.getElementById("video");
                video.value = targetCard.querySelector("video").src;
                document.getElementById("image").value = targetCard.querySelector(".card-button").dataset.iconsrc;
            }
                 */


    //console.log("show form")
    document.getElementById('card-form-container').classList.remove('hidden');
    document.addEventListener('click', closeFormOnExitBorders);
    
    document.querySelector(".add-new-block").addEventListener("click", addNewResBlockButton)

    toggleClassToForm(lastClickedButton);



    const uploadButton = document.querySelectorAll(".upload-file").forEach((button)=>{
        button.addEventListener("click", uploadFile);
    });

}

const uploadFile =()=> {
    let nonFileInput = event.target.parentNode.parentNode.querySelector('.can-upload input:not(.fileInput)');
    if (!nonFileInput){
        nonFileInput = event.target.parentNode.parentNode.querySelector("#res-icon");
    }
    const fileLoader = event.target.parentNode.querySelector(".fileInput")
    const file = fileLoader.files[0];
    let type = "smth"
    if (file) {
      if (file.type.indexOf("video") >= 0) {
        type = "videos";
      } 
      if (file.type.indexOf("image") >= 0) {
        type = "icons";
      }
    }
    if (file) {

      const formData = new FormData();
      formData.append('folder', type);
      formData.append('file', file);
      
      uploadToS3(formData)
        .then(response => {
          //console.log('File uploaded successfully:', response);
          nonFileInput.value = response.link;
          const event = new Event('input');
          nonFileInput.dispatchEvent(event);
  
        })
        .catch(error => {
          console.error('Error uploading file:', error);
        });
    } else {
      console.error('No file selected');
    }
}


const closeFormOnExitBorders = (event)=> {
    //const form = document.getElementById('card-form');
    //event.stopPropagation();
    const overlay = document.getElementById('card-form-container');
    const form = document.getElementById('card-form');
    if (event.target !== overlay && event.target !== form && !form.contains(event.target)) {
        hideForm();
        document.removeEventListener('click', closeFormOnExitBorders);
    }
};


const createForm = ()=>{
    //document.getElementById('type').addEventListener('change', showHideInputs);
    showHideInputs();
    document.getElementById('card-form').addEventListener('submit', submitForm);

    document.querySelector('.close-form').addEventListener('click', hideForm);

    
    document.querySelectorAll(".edit-button").forEach((card)=>{
        card.removeEventListener('click', showForm);
        card.addEventListener('click', showForm);
    })
    document.querySelectorAll('.card-to-add').forEach((card)=>{
        card.removeEventListener('click', showForm);
        card.addEventListener('click', showForm);
    })
}
/*
const showEditForm = ()=>{
    event.stopPropagation();
    const editForm = document.getElementById("edit-form");
    const editField = document.getElementById("edit-field").value;
    const name = document.querySelector("label");
    console.log(editField + "  " + name.textContent);

    editForm.classList.remove("hidden");
    document.querySelector(".close-edit-form").addEventListener("click", hideEditForm);
    document.addEventListener('click', closeEditOnBorders);
}


const hideEditForm = ()=>{
    const editForm = document.getElementById("edit-form");
    editForm.classList.add("hidden");
}

const closeEditOnBorders = (event)=> {
    const form = document.getElementById('edit-form');
    const isntContain = !form.contains(event.target);
    const instEquals = event.target !== form;
    if (instEquals && isntContain) {
        hideEditForm();
        document.removeEventListener("click",closeEditOnBorders)
    }
};*/



export {createForm, showForm}
