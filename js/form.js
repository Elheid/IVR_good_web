import { createCatalogCard, createServiceCard } from "./main/createrObj.js";
import { getCatalogId, getCellNameById, getCatalogsId } from "./util.js";

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
const submitCardAdd = (event) => {
    event.preventDefault();

    //const listToAdd = event.target.closest("li");
    //const listToAdd = document.querySelector(".list-of-cards.catalogs-list");
    const targetCard = lastClickedButton.closest("li");
    const listToAdd = targetCard.parentNode;

    const addExtra = document.querySelector(".add-extra");
    const hideExtra = document.querySelector(".hide-extra");

    const type = addExtra.checked ? 'service' : 'catalog';
    const title = document.getElementById('title').value;
    const id = document.getElementById('id').value;
    const image = document.getElementById('image').files[0];
    const video = document.getElementById('video').files[0];

    let newCard;

    if (type === 'catalog') {
        // Создаем объект категории
        const category = {
            gifLink: video ? URL.createObjectURL(video) : "",
            gifPreview: video ? URL.createObjectURL(video) : "",
            mainIconLink: image ? URL.createObjectURL(image): "",
            itemsInCategoryIds: [],  
            title: title,
            id: id,
            parentCategoryId: '' 
        };
        const isClear = listToAdd.parentNode.classList.contains("clear-language")
        newCard = createCatalogCard(category, isClear);;
    } else if (type === 'service') {
        // Создаем объект сервиса

        const service = {
            categoryId: '1', // Замените на реальный идентификатор категории
            gifLink: video ? URL.createObjectURL(video) : URL.createObjectURL(image),
            gifPreview: video ? URL.createObjectURL(video) : URL.createObjectURL(image),
            id: id, // Замените на реальный идентификатор сервиса
            title: title
        };
        const isClear = listToAdd.classList.contains("clear-language")
        newCard = createServiceCard(service, isClear);
    }

    if (newCard) {
        if (targetCard.classList.contains("card-to-add")){
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
    document.getElementById('card-form-container').classList.add('hidden');
    document.getElementById('card-form').reset();
};


const hideForm = ()=>{
    document.getElementById('card-form-container').classList.add('hidden');
}

let lastClickedButton = null;

const changeParentOptions = (targetCard)=>{
    var urlParams = window.location.search;
    const state = (urlParams.match('catalog')) ? 'services' :  'catalogs';
    if (state === "services"){
        const addExtra = document.querySelector(".add-extra");
        addExtra.click();
        const catalogName = getCellNameById(getCatalogId())
        const parentsOption = document.getElementById("parent-id")
        parentsOption.querySelectorAll("option")[0].textContent = catalogName;
        parentsOption.querySelectorAll("option")[0].value = catalogName;

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
            const clone = document.importNode(parentsOption.querySelectorAll("option")[0], true);
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
    document.getElementById('card-form').addEventListener('submit', (event)=> submitCardAdd(event));

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
