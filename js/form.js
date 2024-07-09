import { createCatalogCard, createServiceCard } from "./main/createrObj.js";
import { getCatalogId, getCellNameById, getCatalogsId, getCurState } from "./util.js";
import { showInfoCard } from "./showInfo.js";
import { createCategory, createService, addServiceCategory } from "./api/api.js";


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
            createService(sendData)
            .then((data) => {
                const id = data.id;
                addServiceCategory(id ,parentId);
                setIdAfterAdd(service, id)
            });
            break;

        case info:  
            console.log("Ещё не сделано")
            break;
      
        default:
            console.log("Ошибка с созданием запроса добавления")
            break;
      }
}

const submitCardAdd = (event) => {
    event.preventDefault();
    event.stopPropagation();


    const state = getCurState();



    //const listToAdd = event.target.closest("li");
    //const listToAdd = document.querySelector(".list-of-cards.catalogs-list");
    const targetCard = lastClickedButton.closest("li");

    const action = targetCard.classList.contains("card-to-add") ? 'add' : 'edit';

    const listToAdd = targetCard.parentNode;
    const search = new URLSearchParams(window.location.search)
    const parentId = search.get("catalog")//targetCard.getAttribute("catalog-id");
    console.log(parentId)

    const addExtra = document.querySelector(".add-extra");
    const hideExtra = document.querySelector(".hide-extra");

    const type = addExtra.checked ? 'service' : 'catalog';
    const title = document.getElementById('title').value;
    //const id = document.getElementById('id').value;
    
    const image = document.getElementById('image').value//.files[0];
    const video = document.getElementById('video').value//.files[0];

    //"https://storage.yandexcloud.net/akhidov-ivr/10full.mp4"
    const resVideo = document.getElementById('resVideo').value;
    const description = document.getElementById('res-description').value;//"Тестовое наполнение";


    let newCard;

    let infoTmp;
    let category;
    let service;

    let sendToBd;
    if (state === "info-cards"){

        infoTmp = {
            //gifLink: video ? URL.createObjectURL(video) : URL.createObjectURL(image),
            mainIconLink: image, 
            gifLink:image,
            description:description ? description : ".",
            title: title,
        };
        newCard = showInfoCard(infoTmp);
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
                title: title,
                parentId:""
            };
            sendToBd = {
                title: service.title,
                description:service.description,
                gifPreview: service.gifPreview,
                gifLink: service.gifLink,
                mainIconLink: service.mainIconLink,
            }
            const isClear = listToAdd.classList.contains("clear-language")
            newCard = createServiceCard(service, isClear);
        }
    }

    if (newCard) {
        if (action === 'add'){
            if (sendToBd){
                sendCardToBd(state,sendToBd, parentId);
            }
            else{
                console.log("Что-то случилось с информыцией из формы")
            }
            listToAdd.appendChild(newCard);
        }
        else{
            targetCard.parentNode.replaceChild(newCard, targetCard);
        }
        console.log("should added: ", newCard);
        const cardAddedEvent = new CustomEvent('newCardCreated', {
            detail: { card:newCard}
        })

        document.dispatchEvent(cardAddedEvent);
    }

    // Скрываем форму
    document.getElementById('card-form').removeEventListener('submit', submitCardAdd);
    document.getElementById('card-form-container').classList.add('hidden');
    document.getElementById('card-form').reset();
};


const hideForm = ()=>{
    document.getElementById('card-form-container').classList.add('hidden');
    const parentsOption = document.getElementById("parent-id");
    removeAllChildrenExceptFirst(parentsOption);
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
    const resDivs = document.querySelectorAll(".res-parts");
    if (state === 'catalogs-list'){
        resDivs.forEach((div)=> div.classList.add("hidden"))
    }
    if (state === 'info-cards'){
        parentDivs.forEach((div)=> div.classList.add("hidden"))
    }
    else{
        resDivs.forEach((div)=>{ 
            if (div.classList.contains("hidden")){
                div.classList.remove("hidden")
            }
        });
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
    changeParentOptions(targetCard);
    console.log("show form")
    document.getElementById('card-form-container').classList.remove('hidden');
    document.addEventListener('click', closeFormOnExitBorders);
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
    console.log(editField);

    const name = document.querySelector("label");
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
