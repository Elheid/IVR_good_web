import { createGastrualSkeleton } from "./main/createrObj.js";
import { createForm, showForm } from "./form.js";

import { getCurState, updateMargin, isAdmin } from "./util.js";

import { deleteCategory, deleteService, deleteAddition } from "./api/api.js";

const body = document.querySelector("body");


const createAdminButton = () => {
    /*      
    <input type="checkbox" id="toggle" class="toggleCheckbox" />
    <label for="toggle" class='toggleContainer'>
      <div>This is a toggle</div>   
      <div>button</div>
    </label>
    */
    const button = document.createElement('input');
    button.type = "checkbox";
    button.id = "toggle";
    button.classList.add("toggleCheckbox");
    button.classList.add("admin-button");

    const label = document.createElement('label');
    label.htmlFor = "toggle"; // Используем htmlFor вместо for
    label.classList.add("toggleContainer");



    const title1 = document.createElement('div');
    //title1.textContent = "Просмотр";

    const title2 = document.createElement('div');
    //title2.textContent = "Редактирование";

    const img1 = document.createElement('img');
    img1.src = "/img/view.svg";

    const img2 = document.createElement('img');
    img2.src = "/img/edit.svg";
    title1.appendChild(img1);
    title2.appendChild(img2);

    // Добавляем div в label
    label.appendChild(title1);
    label.appendChild(title2);


    updateIsAdmin();

    // Возвращаем button и label
    return { button, label };
}

const updateIsAdmin = ()=>{
    /*const searchUrl = window.location.search;
    const curState = new URLSearchParams(searchUrl).get("admin");
    if (curState === "true"){
        if(!body.classList.contains("admin")){
            body.classList.add("admin")
        }
    }
    else{
        if(body.classList.contains("admin")){
            body.classList.remove("admin")
        }
    }*/
}

const updateURL = ()=>{
    const isAdmin = body.classList.contains("admin");

    const searchUrl = window.location.search;
    let searchParams = new URLSearchParams(searchUrl);
    const paramName = "admin";

    // Обновляем или добавляем параметр admin
    /*if (searchParams.has('admin')) {
        // Если параметр существует, изменяем его значение
        searchParams.set('admin', isAdmin);
    } else {
        // Если параметра нет, добавляем его
        searchParams.append('admin', isAdmin);
    }*/
    //searchParams.set('admin', isAdmin);
    /*const curState = new URLSearchParams(searchUrl).get("admin");
    if (window.location.search.includes(paramName)) {
        if (curState === isAdmin){
            history.replaceState({}, '', searchUrl);
        }
        else{
            history.replaceState({}, '', searchUrl.replace(paramName+"="+curState, paramName+"="+isAdmin));
        }  
    } else {
        history.pushState({}, '', window.location.pathname + searchUrl + `&${paramName}=${isAdmin}`);
        // Вы можете добавить ваш параметр здесь
    }*/
    // Обновляем URL без перезаписи других параметров
    /*const newUrl = `${window.location.pathname}?${window.location.search}`;
    history.pushState({ admin: isAdmin }, '', newUrl);*/
}

const toggleButtonStateUpdate = ()=> {
    const body = document.body;
    const toggleCheckbox = document.getElementById('toggle');

    // Устанавливаем начальное состояние чекбокса в зависимости от класса admin у body
    //console.log("func"+isAdmin())
    //console.log("actual" + localStorage.getItem("isAdmin"))
    if (isAdmin()) {
        toggleCheckbox.checked = true;
    } else {
        toggleCheckbox.checked = false;
    }

    // Обработчик для изменения положения переключателя при изменении состояния чекбокса
    /*toggleCheckbox.addEventListener('change', ()=> {
        if (this.checked) {
            document.querySelector('.toggleContainer::before').style.left = '50%';
        } else {
            document.querySelector('.toggleContainer::before').style.left = '0%';
        }
    });*/

    //toggleCheckbox.dispatchEvent(new Event('change'));
}

const adminUpdate = ()=>{
    const toggleCheckbox = document.getElementById('toggle');
    
    if (isAdmin()){
        addAdminExtra();
        resAddEditButtons();
        toggleCheckbox.checked = true;
    }
    else{
        removeAdminExtra();
        toggleCheckbox.checked = false;
        resDeleteEditButtons();
    }
}

const adminButtonClick = ()=>{
    const admin = localStorage.getItem("isAdmin");
    const undefindCheck = typeof admin !== 'undefined';
    const toggleCheckbox = document.getElementById('toggle');

    if (!undefindCheck && !toggleCheckbox.checked){
        localStorage.setItem("isAdmin", false);
    }
    else if (undefindCheck && !isAdmin()){
        localStorage.setItem("isAdmin", true);
    }
    else{
        localStorage.setItem("isAdmin", false);
    }
    //console.log(localStorage.getItem("isAdmin"))
    adminUpdate();
    
    /*if (!prevClickAddAdmin && !undefindCheck){
        localStorage.setItem("isAdmin", true);
        prevClickAddAdmin = true
    }
    else{
        localStorage.setItem("isAdmin", false);
        prevClickAddAdmin = false
    }

    if (localStorage.getItem("isAdmin")){
        localStorage.setItem("isAdmin", true);
        body.classList.add("admin")
    }
    else{
        localStorage.setItem("isAdmin", false);
        body.classList.remove("admin")
    }*/
    updateURL();
    //toggleAdminExtra();
    /*
    if (localStorage.getItem("isAdmin") !== "true"){
        addAdminExtra();
        resAddEditButtons();
        toggleCheckbox.checked = true;
    }
    else{
        removeAdminExtra();
        toggleCheckbox.checked = false;
        resDeleteEditButtons();
    }*/
    //toggleButtonStateUpdate();
    //toggleEditResButtons();
}
const deleteExtraButtons = (card)=>{
    const container = card.querySelector(".extended-container");
    if (container) container.remove();
}

const addAdminButtonsEvent = (card)=>{
    const container = createExtraButtons();
    if (!card.querySelector(".extended-container")){
        if(!card.classList.contains("card-to-add")){
            let toInsert = card.querySelector(".card-content");
            if (card.querySelector(".card-content")){
                toInsert.insertBefore(container, card.querySelector(".card-button"));
            }
            else{//? card.querySelector(".card-content") : card;
                card.querySelector(".card-button").appendChild(container);
            }   
            
        }
    }
    const img = card.querySelector(".extended-button img");
    const video = card.querySelector("video");
    if (img){
        /*video.addEventListener('loadeddata', () =>
        {
            img.addEventListener('load', () => {
                updateMargin(card, container);
                updateStyleButtonsClearCard(container);
            });
        })*/
        img.addEventListener('load', () => {
            updateMargin(card, container);
            updateStyleButtonsClearCard(container);
        });
    }
}
const updateStyleButtonsClearCard = (container)=>{
    const isClear = container.closest("ul").parentNode.classList.contains("clear-language");
    const cardButton = container.parentNode.querySelector(".card-button");
    if (isClear){
        container.style.paddingBottom = "30px";
        container.style.paddingTop = "5px";
        if (isAdmin()){
            cardButton.style.height = "calc(100% - 3em)";//"auto";
            if(cardButton.querySelector(".icon-container")){
                cardButton.querySelector(".icon-container").style.marginTop = "20px";
            } 
        }
        else{
            cardButton.style.height = "auto";
            if(cardButton.querySelector(".icon-container")){
                cardButton.querySelector(".icon-container").style.marginTop = "";
            } 
        }

    }
}



const addAdminButtonsToCards = ()=>{
    if(isAdmin()){
        const lists = document.querySelectorAll(".list-of-cards:not(.sceleton-list)");
        for(var i = 0; i < lists.length; i++){
            const cards = lists[i].children;
            if (cards.length > 0){
                for(var j = 0; j < cards.length; j++){
                    addAdminButtonsEvent(cards[j])
                }
            }
        }
    }
}

const addAdminExtra = ()=>{
    const lists = document.querySelectorAll(".list-of-cards:not(.sceleton-list)");
    for(var i = 0; i < lists.length; i++){
        const cards = lists[i].children;
        if (isAdmin()){
            addCadrdSample(lists[i]);
        }
        if (cards.length > 0){
            for(var j = 0; j < cards.length; j++){
                extraButtonsUpdate(cards[j])
            }

        }
    }
}
const removeAdminExtra = ()=>{
    const lists = document.querySelectorAll(".list-of-cards:not(.sceleton-list)");
    for(var i = 0; i < lists.length; i++){
        const cards = lists[i].children;
        if (!isAdmin()){
            deleteCadrdSample(lists[i]);
        }
        if (cards.length > 0){
            for(var j = 0; j < cards.length; j++){
                extraButtonsUpdate(cards[j])
            }

        }
    }
}
/*
const toggleAdminExtra = ()=>{
    const lists = document.querySelectorAll(".list-of-cards:not(.sceleton-list)");
    for(var i = 0; i < lists.length; i++){
        const cards = lists[i].children;
        if (localStorage.getItem("isAdmin") !== "true"){
            addCadrdSample(lists[i]);
        }
        else{
            deleteCadrdSample(lists[i]);
        }
        if (cards.length > 0){
            for(var j = 0; j < cards.length; j++){
                extraButtonsUpdate(cards[j])
            }

        }
    }
    
}*/

const extraButtonsUpdate = (card)=>{
    if (!isAdmin()){
        deleteExtraButtons(card);

        //deleteCadrdSample(lists[i]);
    }
    else{
        addAdminButtonsEvent(card);

        //addCadrdSample(lists[i]);
    }
}

const editButtonClick = (event)=>{
    event.stopPropagation();
    showForm();
    /*const target = evt.target.closest('li');
    if (target.classList.contains("edited"))
    {
        target.classList.remove("edited");
    }
    else{
        showForm();
        target.classList.add("edited");
    }*/
}

const deleteButtonClick = (event)=>{
    event.stopPropagation();
    confirmDelete(event);
}


const deleteCard = (type,id)=>{
    switch(type) {
        case 'catalog': 
            deleteCategory(id)
            break;
      
        case 'service':  
            deleteService(id)
            break;

        case 'info':  
            //console.log("C info card Ещё не сделано")
            deleteAddition(id);
            break;
      
        default:
            console.log("Ошибка с созданием запроса удаления")
            break;
      }
}
const confirmDelete = (event)=> {
        event.preventDefault();
        const target = event.target.closest('li');

        let state = "catalog";

        let id = event.target.closest('li').getAttribute("catalog-id");
        if (!id){
            id = event.target.closest('li').getAttribute("service-id");
            state = "service";
            if (!id){
                id = event.target.closest('li').getAttribute("info-id");
                state = "info";
            }
        }
        const title = target.querySelector(".card-title").textContent;
        console.log(title + "  id " + id)
        // Отображаем диалоговое окно с подтверждением
        if (confirm("Вы действительно хотите удалить?")) {
            // Запрашиваем ввод текста для подтверждения
            const input = prompt('Для подтверждения удаления введите название удаляемого объекта:');
            if (input === title) {
                console.log("Элемент " + title + " удалён");
                target.remove();
                deleteCard(state,id)
            } else {
                alert("Неверное слово. Удаление отменено.");
                console.log("Удаление отменено");
            }
        } else {
            // Если пользователь отменил, ничего не делаем
            console.log("Удаление отменено");
        }
}


const createExtraButtons = ()=>{
    const container = document.createElement('div');
    container.classList.add("extended-container")
    const deleteButton = document.createElement('button');
    deleteButton.classList.add("extended-button");
    deleteButton.classList.add("delete-button");
    const imgDelete = document.createElement('img');
    imgDelete.src = "/img/trash.svg";
    deleteButton.appendChild(imgDelete);


    /*const cards = document.querySelectorAll(".card");
    for (var i = 0; i < cards.length; i++){
        if(cards[i].offsetWidth !== 0){
            const width = (cards[i].offsetWidth - deleteButton.offsetWidth);
            deleteButton.style.marginLeft = `calc(${width}px )`;
            break;
        }
    }*/
    deleteButton.addEventListener("click", (evt)=>deleteButtonClick(evt))

    const editButton = document.createElement('button');
    editButton.classList.add("extended-button");
    editButton.classList.add("edit-button");
    const imgEdit = document.createElement('img');
    imgEdit.src = "/img/edit.svg";
    editButton.appendChild(imgEdit);
    editButton.addEventListener("click", (evt)=>editButtonClick(evt))

    container.appendChild(deleteButton);
    container.appendChild(editButton);
    
    return  container;
}

const equalizeSampleHeight = ()=>{
    let cards = document.querySelectorAll('.card');
    if (cards.length > 1){
            
        
        const cardToAdd = document.querySelector('.card-to-add').querySelector(".card-content");
        let maxHeight = 0;
        let maxWidth = 0;
        
        cards.forEach((cardInCards)=> {
        const card = cardInCards.querySelector(".card-button");
        if (card){
            if (card.offsetHeight > maxHeight) {
                maxHeight = card.offsetHeight;
            }
            if (card.offsetWidth > maxWidth) {
                maxWidth = card.offsetWidth
            }
        }
        });
    

        if (!cardToAdd.parentNode.parentNode.classList.contains("hidden")){
            cardToAdd.style.height = maxHeight > 300 ? "fit-content" :maxHeight + 'px';
            cardToAdd.style.width = maxHeight < 100 ? "fit-content" : maxWidth + 'px';
            if (cardToAdd.querySelector(".gif")){
                cardToAdd.querySelector(".gif").style.width = maxWidth + 'px';
            }
        }
    }
}

const addCadrdSample = (list)=>{
    const state = getCurState();
    /*
    if (list.children.length != 0){
        for (var i = 0; i < list.children.length; i++){
            if(list.children[i].classList.contains("card-to-add")){
                return;
            }
        }
    }*/

    const alreadyHas = list.querySelector('.card-to-add') !== null;
    const notInfoCards = (list.children.length === 0 && state !== "info-cards");
    const hollowServicesWhileCatalogs = (list.children.length === 0 && state === "catalogs-list");
    const hollowCategory = (list.children.length === 0 && state === "services-list");
    const subCategory = document.querySelector(".sub-catalogs-list");
    let subCategories = false;
    if (subCategory){
        subCategories = ((!subCategory.classList.contains("hidden")) && state === "services-list" && list.classList.contains(state))
    }
    if (alreadyHas){
        return;
    }
    if (hollowServicesWhileCatalogs){
        return
    }
    const categoryId = new URLSearchParams(window.location.search).get("category");
    const hiddenService = list.classList.contains("hidden") && list.classList.contains("services-list");
    if (hiddenService){
        return;
    }
    if (!hollowCategory && (notInfoCards)){
        return;
    }
    if (subCategories){
        return;
    }
    if (hollowCategory){
        list.classList.remove("hidden");
        list.parentNode.classList.remove("hidden");
    }
   /* if ((alreadyHas || (notInfoCards || notServicesWhileCatalogs)) && !hollowCategory){
        return;
    }*/
    const isClear = list.parentNode.classList.contains("clear-language");
    const fragmentToAppend = createGastrualSkeleton(1, isClear);
    //if (list.classList.contains(state)){
        fragmentToAppend.firstElementChild.classList.add("card-to-add");
        fragmentToAppend.firstElementChild.removeAttribute("catalog-id");
        fragmentToAppend.firstElementChild.querySelector(".card-button").classList.remove("skeleton-substrate");
        fragmentToAppend.firstElementChild.querySelector(".card-button").classList.replace("card-button","cardButton-to-add")
        if(fragmentToAppend.firstElementChild.querySelector(".gif")){
            fragmentToAppend.firstElementChild.querySelector(".gif").style = "animation: none;"
        }
        if (fragmentToAppend.firstElementChild.querySelector(".skeleton-content")){
            fragmentToAppend.firstElementChild.querySelector(".skeleton-content").style = "animation: none;"
        }
        //fragmentToAppend.firstElementChild.querySelector(".card-button").replaceWith(fragmentToAppend.firstElementChild.querySelector(".card-button").cloneNode(true));
        list.appendChild(fragmentToAppend);

        const catalog = new URLSearchParams(window.location.search).get("catalog");
        const subcatalog = new URLSearchParams(window.location.search).get("sub-catalog");
        if (catalog && catalog !== "" || subcatalog && subcatalog !== ""){
            document.querySelector(".catalogs-list").classList.add("hidden");
        }
        document.addEventListener("resize", equalizeSampleHeight)
        equalizeSampleHeight();

        createForm();

        let otherList;
        if (state === "services-list"){
            otherList = document.querySelector('.catalogs-list');
            //for (var i = 0; i < otherList.children.length; i++){
                addCadrdSample(otherList);
                const cards = otherList.children;
                for (var i = 0; i< cards.length; i++){
                    updateMargin(cards[i], cards[i].querySelector(".extended-container"));
                }

                /*if(otherList.querySelector('.card-to-add') !== null){
                    return;
                }
                else if(i === otherList.children.length - 1 ){
                    addCadrdSample(otherList);
                }*/
            //}
        }

    //}
}
const deleteCadrdSample = (list)=>{
    var urlParams = window.location.search;
    const state = (urlParams.match('catalog')) ? 'services-list' :  'catalogs-list';
    const isClear = list.classList.contains("clear-language");
    for (var i = 0; i < list.children.length; i++){
        if(list.children[i].classList.contains("card-to-add")){
            list.children[i].remove();
        }
    }
}
/*const addEventsExtraButtons = ()=>{
    const editButton = document.querySelectorAll(".edit-button");
    editButton.forEach((button)=>{
        button.addEventListener("click", (evt)=>editButtonClick(evt))
    })
    const deleteButton = document.querySelectorAll(".delete-button")
    deleteButton.forEach((button)=>{
        button.addEventListener("click", (evt)=>deleteButtonClick(evt))
    })
}*/

const createEditElementBitton = ()=>{
    const button = document.createElement('button');
    button.classList.add("edit-element-button");
    button.textContent = "edit";
    return button;
}

const toggleElements = (name) => {
    // Hide all conditional elements
    document.querySelectorAll('.conditional').forEach(el => el.classList.add('hidden'));
    document.querySelectorAll('.reduced').forEach(el => el.classList.add('hidden'));

    
    document.querySelectorAll('#type').forEach(el => el.removeAttribute("required"));
    document.querySelectorAll('[for="title"], #title').forEach(el => el.removeAttribute("required"));
    // Show elements based on name
    if (name === 'title') {
      document.querySelectorAll('[for="title"], #title').forEach(el => el.classList.remove('hidden'));
    } else if (name === 'video') {
      document.querySelectorAll('[for="resVideo"], #resVideo').forEach(el => el.classList.remove('hidden'));
    } else if (name === 'description') {
      document.querySelectorAll('aside.res-text-parts').forEach(el => el.classList.remove('hidden'));
    }
  }


const editResClick = (name)=>{
    console.log("edit  " + name);
    toggleElements(name);
    showForm();
}


const editResElement = (elemet, name)=>{
    const button = createEditElementBitton();
    button.addEventListener("click", ()=>{
        editResClick(name, elemet);
    });
    const resTitle = elemet.classList.contains("res-title");
    if(resTitle){
        //button.classList.add("hidden");
        return;
    }
    if(elemet.classList.contains("title") && elemet.textContent.indexOf("Дополнительная информация")>0){
        button.classList.add("hidden");
        elemet.appendChild(button);
    }
    else if (elemet.classList.contains("title") && elemet.textContent.indexOf("Дополнительная информация") <=0){
        if (elemet.parentNode.querySelector(".edit-element-button")){
            elemet.parentNode.querySelector(".edit-element-button").classList.remove("hidden")
        }
        else{
            elemet.appendChild(button);
        }
    }
    else{
        elemet.parentNode.insertBefore(button, elemet);
    }
}

const resDeleteEditButtons = ()=>{
    const buttons = document.querySelectorAll(".edit-element-button")
    buttons.forEach((button)=>button.remove())
}

const resAddEditButtons = ()=>{
    const titles = document.querySelectorAll(".title");
    const descriptions = document.querySelectorAll(".manual-text:not(.skeleton .manual-text)");
    const videos = document.querySelectorAll(".result-video");
    const elementsToEdit = [];
    titles.forEach((title)=> elementsToEdit.push({element:title, name:"title"}));
    descriptions.forEach((description)=> elementsToEdit.push({element:description, name:"description"}));
    videos.forEach((video)=> elementsToEdit.push({element:video, name:"video"}));
    elementsToEdit.forEach((elemet)=>editResElement(elemet.element, elemet.name))
}

/*
const toggleEditResButtons = ()=>{
    if (localStorage.getItem("isAdmin") !== "true"){
        resAddEditButtons();
    }
    else{
        resDeleteEditButtons();
    }
}*/

const addButtons = ()=>{
    let adminButton = document.querySelector(".admin-button");
    adminButton.addEventListener("click", adminButtonClick)
}



const addAdminPanel = ()=>{
    let adminButton = document.querySelector(".admin-button");
    if (!adminButton) {
        const { button, label } = createAdminButton();
        const header = document.querySelector("header");
        header.appendChild(button);
        header.appendChild(label);
        adminButton = document.querySelector(".admin-button");
    }
    document.addEventListener('newCardCreated', (event)=>{
        const card = event.detail.card;
        addAdminButtonsEvent(card)

        const video = card.querySelector("video");
        const container = card.querySelector(".extended-container")
        if (video){
            video.addEventListener('loadeddata', () =>
            {
                updateMargin(card, container);
                updateStyleButtonsClearCard(container);
            })
        }
    });
    document.addEventListener("DOMContentLoaded", ()=>{
        //if (localStorage.getItem("isAdmin") !== "true"){
            //adminButtonClick();
        //}
        adminUpdate();
    })


    addButtons();
    /*var urlParams = window.location.search;
    const isAddCardNeed = (urlParams.match('services')) ? true : false;
    if (isAddCardNeed){
        addCadrdSample();
    }*/
}

export {addAdminPanel, addAdminButtonsToCards, addCadrdSample, extraButtonsUpdate, adminButtonClick, resAddEditButtons,  adminUpdate}