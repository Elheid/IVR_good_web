import { createGastrualSkeleton } from "./main/createrObj.js";
import { createForm, showForm } from "./form.js";


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
    const searchUrl = window.location.search;
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
    }
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
    const curState = new URLSearchParams(searchUrl).get("admin");
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
    }
    // Обновляем URL без перезаписи других параметров
    /*const newUrl = `${window.location.pathname}?${window.location.search}`;
    history.pushState({ admin: isAdmin }, '', newUrl);*/
}

const toggleButtonStateUpdate = ()=> {
    const body = document.body;
    const toggleCheckbox = document.getElementById('toggle');

    // Устанавливаем начальное состояние чекбокса в зависимости от класса admin у body
    if (body.classList.contains('admin')) {
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

    // Запускаем событие change, чтобы применить начальное состояние
    toggleCheckbox.dispatchEvent(new Event('change'));
}

const adminButtonClick = ()=>{
    body.classList.toggle("admin")
    updateURL();
    toggleAdminExtra();
    toggleButtonStateUpdate();
    toggleEditResButtons();
   /* if (!body.classList.contains("admin")){
        deleteExtraButtons();
    }
    else{
        addAdminButtonsToCards();
    }*/
    
    if (!body.classList.contains("admin")){
        //document.removeEventListener('click', adminButtonClick);
    }
}
const deleteExtraButtons = (card)=>{
    const container = card.querySelector(".extended-container");
    container.remove();
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
    if (img){
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
        cardButton.style.height = "auto";
    }
}

const updateMargin = (card, container) => {
    if (card.offsetWidth !== 0) {
        const deleteButton = container.querySelector(".delete-button");
        const editButton = container.querySelector(".edit-button");
        const width = (card.offsetWidth - deleteButton.offsetWidth);
        const leftMargin = width/28
        deleteButton.style.marginLeft = `calc(${width - leftMargin}px)`;
        editButton.style.marginLeft = `calc(${leftMargin}px)`;
    }
};


const addAdminButtonsToCards = ()=>{
    if(body.classList.contains("admin")){
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

const toggleAdminExtra = ()=>{
    const lists = document.querySelectorAll(".list-of-cards:not(.sceleton-list)");
    for(var i = 0; i < lists.length; i++){
        const cards = lists[i].children;
        if (body.classList.contains("admin")){
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
    
}

const extraButtonsUpdate = (card)=>{
    if (!body.classList.contains("admin")){
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

const confirmDelete = (event)=> {
    // Предотвращаем стандартное действие кнопки
    event.preventDefault();

    // Отображаем диалоговое окно с подтверждением
    if (confirm("Вы действительно хотите удалить?")) {
        // Если пользователь подтвердил, выполнить удаление (например, отправка формы)
        // В данном примере просто выводим сообщение в консоль
        console.log("Элемент удалён");
        const target = event.target.closest('li');
        target.remove();
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
            
        
        const cardToAdd = document.querySelector('.card-to-add');
        let maxHeight = 0;
        
        cards.forEach((card)=> {
        if (card.offsetHeight > maxHeight) {
        maxHeight = card.offsetHeight;
        }
        });
        
        cardToAdd.style.height = maxHeight + 'px';
    }
}

const addCadrdSample = (list)=>{
    var urlParams = window.location.search;
    const state = (urlParams.match('serviceId'))? 'info-cards' : (urlParams.match('catalog')) ? 'services-list' :  'catalogs-list';
    if (list.children.length != 0){
        for (var i = 0; i < list.children.length; i++){
            if(list.children[i].classList.contains("card-to-add")){
                return;
            }
        }
    }
    const isClear = list.parentNode.classList.contains("clear-language");
    const fragmentToAppend = createGastrualSkeleton(1, isClear);
    if (list.classList.contains(state)){
        fragmentToAppend.firstElementChild.classList.add("card-to-add")
        fragmentToAppend.firstElementChild.querySelector(".card-button").classList.remove("skeleton-substrate")
        if(fragmentToAppend.firstElementChild.querySelector(".gif")){
            fragmentToAppend.firstElementChild.querySelector(".gif").style = "animation: none;"
        }
        if (fragmentToAppend.firstElementChild.querySelector(".skeleton-content")){
            fragmentToAppend.firstElementChild.querySelector(".skeleton-content").style = "animation: none;"
        }
        //fragmentToAppend.firstElementChild.querySelector(".card-button").replaceWith(fragmentToAppend.firstElementChild.querySelector(".card-button").cloneNode(true));
        list.appendChild(fragmentToAppend);


        equalizeSampleHeight();

        createForm();
    }
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

const editResElement = (elemet)=>{
    const button = createEditElementBitton();
    //button.addEventListener("click",showForm);
    if(elemet.classList.contains("title")){
        if (elemet.classList.contains("popup-title")){
            button.classList.add("hidden");
        }
        elemet.appendChild(button);
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
    titles.forEach((title)=> elementsToEdit.push(title));
    descriptions.forEach((description)=> elementsToEdit.push(description));
    videos.forEach((video)=> elementsToEdit.push(video));
    elementsToEdit.forEach((elemet)=>editResElement(elemet))
}

const toggleEditResButtons = ()=>{
    if (body.classList.contains("admin")){
        resAddEditButtons();
    }
    else{
        resDeleteEditButtons();
    }
}

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

    document.addEventListener("DOMContentLoaded", ()=>{
        if (window.location.search.indexOf("admin=true") > 0){
            adminButtonClick();
        }
    })


    addButtons();
    /*var urlParams = window.location.search;
    const isAddCardNeed = (urlParams.match('services')) ? true : false;
    if (isAddCardNeed){
        addCadrdSample();
    }*/
}

export {addAdminPanel, addAdminButtonsToCards, addCadrdSample, extraButtonsUpdate, adminButtonClick, toggleEditResButtons}