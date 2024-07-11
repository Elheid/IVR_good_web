import { createCatalogCard, createServiceCard, createAndUpdateInfoCard } from "./main/createrObj.js";
import { getCatalogId, getCellNameById, getCatalogsId, getCurState } from "./util.js";
import { showInfoCard } from "./showInfo.js";
import { createCategory, updateCategoryMainIcon, updateCategoryGifPreview,
    createService, addServiceCategory, removeServiceCategory,  addServiceIcon, updateServiceMainIcon, updateServiceGif, updateServiceDescription,
    createAddition, updateAdditionTitle, addAdditionIcon, updateAdditionMainIcon, updateAdditionGifPreview, updateAdditionGif,  updateAdditionDescription,
} from "./api/api.js";


const showHideInputs = ()=>{
    const addExtra = document.querySelector(".add-extra");
    const hideExtra = document.querySelector(".hide-extra");
    const parentIdLabel = document.getElementById('parent-id-label');
    const parentIdSelect = document.getElementById('parent-id');

    addExtra.addEventListener("click", ()=>{
        if (addExtra.checked) {
            parentIdLabel.classList.remove('hidden');
            parentIdSelect.classList.remove('hidden');
        }
    })
    hideExtra.addEventListener("click", ()=>{
        if(hideExtra.checked){
            parentIdLabel.classList.add('hidden');
            parentIdSelect.classList.add('hidden');
        }
    })
}

const setIdAfterAdd = (type, id)=>{
    const attribute = type === 'info-cards'  ? 'info-id' : type === 'catalogs-list' ? "catalog-id":"service-id";
    const element = document.querySelector(`li[${attribute}="undefined"]`);
    element.setAttribute(`${attribute}`, id);
}


const handleUpdate = (condition, updateFunc/*, newCard, targetCard*/) => {
    if (condition) {
        if (updateFunc) updateFunc();
        //targetCard.parentNode.replaceChild(newCard, targetCard);
        //location.reload();
    }
};
/*
const editCardToBd = (type, editFunc)=>{
    const catalog = 'catalogs-list';
    const service = 'services-list';
    const info = 'info-cards';
    switch(type) {
        case catalog: 
            editFunc();
            break;
      
        case service:  
            //const iconLinks = assembleDescription().iconLinks;
            editFunc();
            break;

        case info:  
            //console.log("Ещё не сделано")
            editFunc();
            break;
      
        default:
            console.log("Ошибка с созданием запроса добавления")
            break;
    }
}*/

const sendCardToBd = (type,sendData, parentId)=>{
    const catalog = 'catalogs-list';
    const service = 'services-list';
    const info = 'info-cards';
    switch(type) {
        case catalog: 
            createCategory(sendData).then((data) => {
                const id = data.id;
                setIdAfterAdd(catalog, id);
            });
            break;
      
        case service:  
            //const iconLinks = assembleDescription().iconLinks;
            createService(sendData)
            .then((data) => {
                const id = data.id;
                addServiceCategory(id ,parentId);
                setIdAfterAdd(service, id);
                iconLinks.forEach((link)=>{
                    addServiceIcon(id, {link});
                })
            });
            break;

        case info:  
            //console.log("Ещё не сделано")
            createAddition(sendData)
            .then((data) => {
                const id = data.id;
                setIdAfterAdd(info, id);
                iconLinks.forEach((link)=>{
                    addAdditionIcon(id, {link});
                })
            });
            break;
      
        default:
            console.log("Ошибка с созданием запроса добавления")
            break;
    }
}

const createSendData = (state, listToAdd,
     type, title, image, video, resVideo, description, parentId)=>{


    let newCard;
    let infoTmp;
    let service;
    let category;
    let sendToBd;
    if (state === "info-cards"){

        infoTmp = {
            //gifLink: video ? URL.createObjectURL(video) : URL.createObjectURL(image),
            mainIconLink: image, 
            gifLink:video,
            gifPreview: video,
            description:description ? description : ".",
            //iconLinks:iconLinks ? iconLinks : [],
            title: title,
        };
        sendToBd = {
            title: infoTmp.title,
            description:infoTmp.description,
            //iconLinks: infoTmp.iconLinks,
            gifPreview: infoTmp.gifPreview,
            gifLink: infoTmp.gifLink,
            mainIconLink: infoTmp.mainIconLink,
            itemId: parentId
        }
        newCard = createAndUpdateInfoCard(infoTmp);
    }else{
        if (type === 'catalog') {
            // Создаем объект категории
            category = {
                gifLink: video, //? URL.createObjectURL(video) : "",
                gifPreview: video, //? URL.createObjectURL(video) : "",
                mainIconLink: image, //? URL.createObjectURL(image): "",
                itemsInCategoryIds: [],  
                title: title,
                //id: id,
                parentCategoryId: '' 
            };
            sendToBd = {
                title: category.title,
                gifPreview: category.gifPreview,
                gifLink: category.gifLink,
                mainIconLink: category.mainIconLink,
            }
            const isClear = listToAdd.parentNode.classList.contains("clear-language")
            newCard = createCatalogCard(category, isClear);
        } else if (type === 'service') {
            // Создаем объект сервиса
    
            service = {
                //categoryId: '1', // Замените на реальный идентификатор категории
                gifLink: resVideo ? resVideo : "",
                gifPreview: video,// ? URL.createObjectURL(video) : URL.createObjectURL(image),
                mainIconLink: image, 
                description:description ? description : ".",
                //iconLinks:iconLinks ? iconLinks : [],
                title: title,
                parentId:""
            };
            sendToBd = {
                title: service.title,
                description:service.description,
                //iconLinks:service.iconLinks,
                gifPreview: service.gifPreview,
                gifLink: service.gifLink,
                mainIconLink: service.mainIconLink,
            }
            const isClear = listToAdd.classList.contains("clear-language")
            newCard = createServiceCard(service, isClear);
        }
    }
    const res = {
        card:newCard,
        info:infoTmp,
        service:service,
        category:category,
        sendToBd:sendToBd,
    }
    return res;
}

let iconLinks;

const submitCardAdd = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const state = getCurState();

    const targetCard = lastClickedButton.closest("li");

    const action = targetCard.classList.contains("card-to-add") ? 'add' : 'edit';

    const listToAdd = targetCard.parentNode;
    const search = new URLSearchParams(window.location.search)
    let parentId = search.get("catalog");
    if (!parentId){
        parentId = search.get("serviceId");
    }
    console.log(parentId)



    const addExtra = document.querySelector(".add-extra");

    const type = addExtra.checked ? 'service' : 'catalog';
    const title = document.getElementById('title').value;
    
    const image = document.getElementById('image').value//.files[0];
    const video = document.getElementById('video').value//.files[0];

    const resVideo = document.getElementById('resVideo').value;

    const resText = assembleDescription();
    const description = resText.description;//"Тестовое наполнение";
    iconLinks = resText.iconLinks;


    const data = createSendData(state, listToAdd,
         type, title, image, video, resVideo, description, parentId);
    const newCard = data.card;

    const infoTmp = data.info;
    const category = data.category;
    const service = data.service;

    let sendToBd = data.sendToBd;
    

    if (newCard) {
        if (action === 'add'){
            if (sendToBd){
                sendCardToBd(state,sendToBd, parentId);
            }
            else{
                console.log("Что-то случилось с информыцией из формы")
            }
            if (state === "info-cards"){
                showInfoCard(infoTmp);
            }
            else{
                listToAdd.appendChild(newCard);
            }

            const cardAddedEvent = new CustomEvent('newCardCreated', {
                detail: { card:newCard}
            })
    
            document.dispatchEvent(cardAddedEvent);
        }
        else{
           /* const catalog = 'catalogs-list';
            const service = 'services-list';
            const info = 'info-cards';*/
            /// service - title, image (iconPreview), video (previcw), resVideo, description, iconList
            /// addition/info - title, image (iconPreview), video (previcw), resVideo, description, iconList
            ///category - image (iconPreview), video (previcw),



            const attribute = state === 'info-cards'  ? 'info-id' : state === 'catalogs-list' ? "catalog-id":"service-id";
            const id = targetCard.getAttribute(attribute);

            
            //if (state === "info-cards"){
            const updateEvent = new CustomEvent('cardUpdated', {})
            document.addEventListener("cardUpdated", ()=>{
                location.reload();
            })
            const selectElement = document.getElementById('parent-id');
            const selectedValue = selectElement.value;
            if (selectedValue !== parentId){
                removeServiceCategory(id).then(()=>{
                    addServiceCategory(id, selectedValue)
                    shouldReload = true;
                    document.dispatchEvent(updateEvent);
                });   
            }
                //}
            /*
            if (title){
                console.log("Ещё не сделано");
            }*/

            handleUpdate(title, async() => {
               await updateAdditionTitle(id, {title});
               document.dispatchEvent(updateEvent);
            });
            handleUpdate(image, async() => {
                if (state === 'catalogs-list'){
                    await updateCategoryMainIcon(id, {image});
                    document.dispatchEvent(updateEvent);
                }
                if (state === 'services-list'){
                    await updateServiceMainIcon(id, {image});
                    document.dispatchEvent(updateEvent);
                }
                if (state === 'info-cards'){
                    await updateAdditionMainIcon(id, {image});
                    document.dispatchEvent(updateEvent);
                }
            });
            handleUpdate(video, async() => {
                if (state === 'catalogs-list'){
                    await updateCategoryGifPreview(id, {video});
                    document.dispatchEvent(updateEvent);
                }
                if (state === 'services-list'){
                    await updateServiceGifPreview(id, {video});
                    document.dispatchEvent(updateEvent);
                }
                if (state === 'info-cards'){
                    await updateAdditionGifPreview(id, {video});
                    document.dispatchEvent(updateEvent);
                }
            });

            handleUpdate(resVideo, async() => {
                if (state === 'services-list'){
                    await updateServiceGif(id, {resVideo});
                    document.dispatchEvent(updateEvent);
                }
                if (state === 'info-cards'){
                    await updateAdditionGif(id, {resVideo});
                    document.dispatchEvent(updateEvent);
                }
            });

            handleUpdate(description, async() => {
                if (state === 'services-list'){
                    await updateServiceDescription(id, {description});
                    document.dispatchEvent(updateEvent);
                }
                if (state === 'info-cards'){
                    await updateAdditionDescription(id, {description});
                    document.dispatchEvent(updateEvent);
                }
            });
            handleUpdate(iconLinks.length !== 0, async() => {
                if (state === 'services-list'){
                    await iconLinks.forEach((link)=>{
                        addServiceIcon(id, {link});
                    })
                    document.dispatchEvent(updateEvent);
                }
                if (state === 'info-cards'){
                    await iconLinks.forEach((link)=>{
                        addAdditionIcon(id, {link});
                    })
                    document.dispatchEvent(updateEvent);
                }
            });
        }
        console.log("should added: ", newCard);
    }

    // Скрываем форму
    document.getElementById('card-form').removeEventListener('submit', submitCardAdd);
    document.getElementById('card-form-container').classList.add('hidden');
    document.getElementById('card-form').reset();
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
    clone.querySelectorAll("input").forEach((input) => {
        input.value = "";
    })
    list.appendChild(clone);
}

const removeNewResBlocks = ()=>{
    const list = document.querySelector(".res-text-parts.list");
    removeAllChildrenExceptFirst(list);
}


const hideForm = ()=>{
    document.getElementById('card-form-container').classList.add('hidden');
    const parentsOption = document.getElementById("parent-id");
    removeAllChildrenExceptFirst(parentsOption);
    removeNewResBlocks();
}

let lastClickedButton = null;

const removeAllChildrenExceptFirst = (parentElement)=> {
    while (parentElement.children.length > 1) {
      parentElement.removeChild(parentElement.lastChild);
    }
}

const changeParentOptions = (targetCard)=>{
    const state = getCurState();

    const parentDivs = document.querySelectorAll(".parent-existence");
    const resDivs = document.querySelector("section.res-card");

    if (state === 'catalogs-list'){
        //resDivs.forEach((div)=> div.classList.add("hidden"))
        resDivs.classList.add("hidden");

        const typeOfParent = document.querySelectorAll("div.parent-existence").forEach(parent=>{
            parent.classList.add("hidden");
        })
        document.querySelector(`label.parent-existence`).classList.add("hidden");
    }
    else if (state === 'info-cards'){

        const typeOfParent = document.querySelectorAll("div.parent-existence").forEach(parent=>{
            parent.classList.add("hidden");
        })
        document.querySelector(`label.parent-existence`).classList.add("hidden");

        parentDivs.forEach((div)=> div.classList.add("hidden"))
    }
    else{

        const typeOfParent = document.querySelectorAll("div.parent-existence").forEach(parent=>{
            parent.classList.add("hidden");
        })
        document.querySelector(`label.parent-existence`).classList.add("hidden");


        resDivs.classList.remove("hidden");
        /*resDivs.forEach((div)=>{ 
            if (div.classList.contains("hidden")){
                div.classList.remove("hidden")
            }
        });*/
        parentDivs.forEach((div)=>{ 
            if (div.classList.contains("hidden")){
                div.classList.remove("hidden")
            }
        });
    }

    if (state === "services-list"){
        const addExtra = document.querySelector(".add-extra");
        addExtra.click();
        const catalogName = getCellNameById(getCatalogId())
        const parentsOption = document.getElementById("parent-id");
        removeAllChildrenExceptFirst(parentsOption);
        const firstChild =  parentsOption.querySelectorAll("option")[0];
        if (firstChild){
            parentsOption.querySelectorAll("option")[0].textContent = catalogName;
            parentsOption.querySelectorAll("option")[0].value = catalogName;
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
        const hideExtra = document.querySelector(".hide-extra");
        hideExtra.click();
    }
}

const showForm = ()=>{
    event.stopPropagation();
    lastClickedButton = event.currentTarget;
    const targetCard = lastClickedButton.closest("li");

    const inputElement = document.getElementById('title');
    const labelElement = document.querySelector(`label[for="${inputElement.id}"]`);

    if (!targetCard.classList.contains("card-to-add") && !targetCard.classList.contains("info-card")){
        document.querySelector(".submit-form").textContent = "Изменить карточку";
        inputElement.removeAttribute('required');
        inputElement.classList.add("hidden");
        labelElement.classList.add("hidden");
    }
    else if(targetCard.classList.contains("info-card")){
        inputElement.removeAttribute('required');
    }
    else{
        document.querySelector(".submit-form").textContent = "Добавить карточку";
        inputElement.setAttribute('required', '');
        inputElement.classList.remove("hidden");
        labelElement.classList.remove("hidden");
    }
    changeParentOptions(targetCard);
    console.log("show form")
    document.getElementById('card-form-container').classList.remove('hidden');
    document.addEventListener('click', closeFormOnExitBorders);
    
    document.querySelector(".add-new-block").addEventListener("click", addNewResBlockButton)
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
    document.getElementById('card-form').addEventListener('submit', submitCardAdd);

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
};



export {createForm, showForm, showEditForm}
