import { createCatalogCard, createServiceCard, createAndUpdateInfoCard } from "./main/createrObj.js";
import { getCatalogId, getCellNameById, getCatalogsId, getCurState, getLastSubCatalog } from "./util.js";
import { showInfoCard } from "./showInfo.js";
import { createCategory, updateCategoryMainIcon, updateCategoryGifPreview,
    createService, addServiceCategory, removeServiceCategory,  addServiceIcon, updateServiceMainIcon, updateServiceGif, updateServiceDescription, updateServiceGifPreview, clearServiceIcons,
    createAddition, updateAdditionTitle, addAdditionIcon, updateAdditionMainIcon, updateAdditionGifPreview, updateAdditionGif,  updateAdditionDescription,
    uploadToS3, clearAdditionIcons,
    setCategoryParent,
} from "./api/api.js";


const showHideInputs = ()=>{
    const addExtra = document.querySelector(".add-extra");
    const hideExtra = document.querySelector(".hide-extra");
    const parentIdLabel = document.getElementById('parent-id-label');
    const parentIdSelect = document.getElementById('parent-id');

    addExtra.addEventListener("click", ()=>{
        if (!document.querySelector(".parent-existence").classList.contains("hidden")){
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
        if (!document.querySelector(".parent-existence").classList.contains("hidden")){
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
            setIdAfterAdd(catalog, data.id);
        },
        ["sub-catalog"]: async () => {
            const data = await createCategory(sendData);
            await setCategoryParent(data.id, parentId)
            setIdAfterAdd(catalog, data.id);
        },
        [service]: async () => {
            const data = await createService(sendData);
            //await addServiceCategory(data.id, parentId);
            addServiceCategory(data.id, parentId);
            setIdAndAddIcons(service, data, iconLinks);
            /*setIdAfterAdd(service, data.id);
            for (const link of iconLinks) {
                await addServiceIcon(data.id, { link });
            }*/
        },
        [info]: async () => {
            const data = await createAddition(sendData);
            setIdAndAddIcons(info, data, iconLinks);
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
/*
const submitForm = async (event) => {
    event.preventDefault();
    event.stopPropagation();

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
    const search = new URLSearchParams(window.location.search);
    let parentId = search.get("catalog") || search.get("serviceId");
    const addExtra = document.querySelector(".add-extra");
    const type = addExtra.checked ? 'service' : 'catalog';
    const title = document.getElementById('title').value;
    const image = document.getElementById('image').value;
    const video = document.getElementById('video').value;
    const resVideo = document.getElementById('resVideo').value;
    const resText = assembleDescription();
    const description = resText.description;
    const iconLinks = resText.iconLinks;


        if (action === 'add') {
            const { newCard, sendToBd } = createSendData(state, listToAdd, type, title, image, video, resVideo, description, parentId);
            if (sendToBd) {
                await sendCardToBd(state, sendToBd, parentId);
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
            console.log("should added: ", newCard);
        } else {
            const attribute = state === 'info-cards' ? 'info-id' : state === 'catalogs-list' ? "catalog-id" : "service-id";

            const url = new URLSearchParams(window.location.search);


            let id = targetCard ? targetCard.getAttribute(attribute) : url.get("serviceId");
            if (document.querySelector(".additional-info-res")){
                id = document.querySelector(".additional-info-res").classList[1];
            }

            const selectElement = document.getElementById('parent-id');
            const selectedValue = selectElement.value;
            if (!selectElement.classList.contains("hidden") && selectedValue !== parentId){
                removeServiceCategory(id).then(()=>{
                    addServiceCategory(id, selectedValue);
                })
            } 
                if (title && state === 'info-cards') updateAdditionTitle(id, { title });

                if (image){
                    if (state === 'catalogs-list')  updateCategoryMainIcon(id, { image });
                    if (state === 'services-list')  updateServiceMainIcon(id, { image });
                    if (state === 'info-cards')  updateAdditionMainIcon(id, { image });
                }
                if (video){
                    if (state === 'catalogs-list')  updateCategoryGifPreview(id, { video });
                    if (state === 'services-list')   updateServiceGifPreview(id, { video });
                    if (state === 'info-cards')  updateAdditionGifPreview(id, { video });
                }
                if (resVideo){
                    if (state === 'services-list') updateServiceGif(id, { resVideo });
                    if (state === 'info-cards') updateAdditionGif(id, { resVideo });
                }
                if (description) { {
                    if (state === 'services-list') {
                        updateServiceDescription(id, { description });
                    }
                    if (state === 'info-cards') {
                        updateAdditionDescription(id, { description });
                    }
                }
                if (description && iconLinks.length !== 0) {
                    clearServiceIcons(id).then(()=>{
                        for (const link of iconLinks) {
                            if (state === 'services-list') {
                                addServiceIcon(id, { link });
                            }
                            if (state === 'info-cards') {
                                addAdditionIcon(id, { link });
                            }
                        }
                    });
                }
            }
        }
        
    form.removeEventListener('submit', submitForm);
    document.getElementById('card-form-container').classList.add('hidden');
    form.reset();
};*/
const submitForm = async (event) => {
    event.preventDefault();
    event.stopPropagation();

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
        if (isSubCatalog()){
            state = "catalogs-list";
            type = "catalog";
        }
        const { newCard, sendToBd } = createSendData(state, listToAdd, type, title, image, video, resVideo, description, parentId);
        if (sendToBd) {
            if (isSubCatalog()){
                if (parentId){
                    sendCardToBd("sub-catalog", sendToBd, parentId, iconLinks);
                }
                else{
                    sendCardToBd(type, sendToBd, getLastSubCatalog(), iconLinks);
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
        console.log("should added: ", newCard);
    } else {

        if (isSubCatalog()){
            state = "catalogs-list";
            type = "catalog";
        }
        
        const promises = [];

        const attribute = state === 'info-cards' ? 'info-id' : state === 'catalogs-list' ? "catalog-id" : "service-id";

        const url = new URLSearchParams(window.location.search);
        let id = targetCard ? targetCard.getAttribute(attribute) : url.get("serviceId");
        if (document.querySelector(".additional-info-res") && document.querySelector(".additional-info-res").classList[1]){
            id = document.querySelector(".additional-info-res").classList[1];
        }

        const selectElement = document.getElementById('parent-id');
        const selectedValue = selectElement.value;

        if (parentId){
            if (!selectElement.classList.contains("hidden") && selectedValue !== parentId && state !== "info-cards"){
                promises.push(removeServiceCategory(id).then(() => promises.push(addServiceCategory(id, selectedValue))));
            }     
        }
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
        form.removeEventListener('submit', submitForm);
        document.getElementById('card-form-container').classList.add('hidden');
        form.reset();

        // Перезагрузка страницы после завершения всех запросов
        window.location.reload();
    })
    }
    if (state === "info-cards"){
        document.querySelector(".close-info").click();
    }
   form.removeEventListener('submit', submitForm);
   document.getElementById('card-form-container').classList.add('hidden');
   form.reset();
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
    list.appendChild(clone);
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
    const manual = elemet.parentNode.classList.contains("manual") ;
    const trueManual = elemet.parentNode.classList.contains("true-manual");
    if (!resTitle && !manual && !trueManual){
        document.getElementById("card-form").classList.remove("inside-service");
    }
    else{
        document.getElementById("card-form").classList.add("inside-service");
    }
}



const hideForm = ()=>{
    document.getElementById('card-form-container').classList.add('hidden');
    const parentsOption = document.getElementById("parent-id");
    removeAllChildrenExceptFirst(parentsOption);
    removeNewResBlocks();
    removeReducedForm();

    toggleClassToForm(lastClickedButton);
}

let lastClickedButton = null;

const removeAllChildrenExceptFirst = (parentElement)=> {
    while (parentElement.children.length > 1) {
      parentElement.removeChild(parentElement.lastChild);
    }
}

const isSubCatalog = ()=>{
    if (!document.querySelector("div.subCategory-create").classList.contains("hidden")){
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


const showForm = ()=>{
    event.stopPropagation();
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
            }
            else{

                video.value = targetCard.querySelector("video").src;
                document.getElementById("image").value = targetCard.querySelector(".card-button").dataset.iconsrc;
            }
        }
        else{
            title.value = "";
            image.value = "";
            video.value = "";
            res.value  = "";    
        }

    }
    else if(lastClickedButton.classList.contains("edit-button") ||
    lastClickedButton.classList.contains("edit-element-button")){
        setFormForEditCard(document.querySelector(".submit-form"));
        document.getElementById("parent-id").removeAttribute("disabled")
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
    console.log("show form")
    document.getElementById('card-form-container').classList.remove('hidden');
    document.addEventListener('click', closeFormOnExitBorders);
    
    document.querySelector(".add-new-block").addEventListener("click", addNewResBlockButton)

    toggleClassToForm(lastClickedButton);



    const uploadFile =()=> {
        const nonFileInput = event.target.parentNode.querySelector('.can-upload input:not(#fileInput)');
        const fileLoader = event.target.parentNode.querySelector("#fileInput")
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
            })
            .catch(error => {
              console.error('Error uploading file:', error);
            });
        } else {
          console.error('No file selected');
        }
    }

    const uploadButton = document.querySelectorAll(".upload-file").forEach((button)=>{
        button.addEventListener("click", uploadFile);
    });

}

const closeFormOnExitBorders = (event)=> {
    //const form = document.getElementById('card-form');
    //event.stopPropagation();
    const overlay = document.getElementById('card-form-container');
    const form = document.getElementById('card-form');
    if (event.target !== overlay && event.target !== form && !form.contains(event.target)) {
        hideForm();
        //document.removeEventListener('click', closeFormWeb);
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
