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

let iconLinks;

const handleUpdate = async (condition, updateFunc, updateEvent) => {
    if (condition) {
        try {
            if (updateFunc){
                await updateFunc();
                await document.dispatchEvent(updateEvent);
            } 
        } catch (error) {
            console.error('Error during update:', error);
        }
    }
};

const setIdAndAddIcons = async(type, data)=>{
    setIdAfterAdd(type, data.id);
    for (const link of iconLinks) {
        await addServiceIcon(data.id, { link });
    }
}

const sendCardToBd = async (type, sendData, parentId) => {
    const catalog = 'catalogs-list';
    const service = 'services-list';
    const info = 'info-cards';
    const actions = {
        [catalog]: async () => {
            const data = await createCategory(sendData);
            setIdAfterAdd(catalog, data.id);
        },
        [service]: async () => {
            const data = await createService(sendData);
            await addServiceCategory(data.id, parentId);
            setIdAndAddIcons(service, data);
            /*setIdAfterAdd(service, data.id);
            for (const link of iconLinks) {
                await addServiceIcon(data.id, { link });
            }*/
        },
        [info]: async () => {
            const data = await createAddition(sendData);
            setIdAndAddIcons(info, data);
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
    const isClear = listToAdd.parentNode.classList.contains("clear-language");
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
            parentId: ""
        };
        sendToBd = { ...service };
        newCard = createServiceCard(service, isClear);
    }

    return { newCard, sendToBd };
};

const submitForm = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    const state = getCurState();
    const targetCard = lastClickedButton.closest("li");
    const action = targetCard.classList.contains("card-to-add") ? 'add' : 'edit';
    const listToAdd = targetCard.parentNode;
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
    iconLinks = resText.iconLinks;

    const { newCard, sendToBd } = createSendData(state, listToAdd, type, title, image, video, resVideo, description, parentId);

    if (newCard) {
        if (action === 'add') {
            if (sendToBd) {
                await sendCardToBd(state, sendToBd, parentId);
            } else {
                console.log("Что-то случилось с информацией из формы");
            }
            if (state === "info-cards") {
                showInfoCard(sendToBd);
            } else {
                listToAdd.appendChild(newCard);
            }
            const cardAddedEvent = new CustomEvent('newCardCreated', { detail: { card: newCard } });
            document.dispatchEvent(cardAddedEvent);
        } else {
            const attribute = state === 'info-cards' ? 'info-id' : state === 'catalogs-list' ? "catalog-id" : "service-id";
            const id = targetCard.getAttribute(attribute);
            const updateEvent = new CustomEvent('cardUpdated', {});
            document.addEventListener("cardUpdated", () => location.reload());

            const selectElement = document.getElementById('parent-id');
            const selectedValue = selectElement.value;
            if (!selectElement.classList.contains("hidden") && selectedValue !== parentId) {
                await removeServiceCategory(id);
                await addServiceCategory(id, selectedValue);
                document.dispatchEvent(updateEvent);
            }

            const updates = [
                { condition: title, func: () => updateAdditionTitle(id, { title }) },
                { condition: image, func: () => {
                    if (state === 'catalogs-list') return updateCategoryMainIcon(id, { image });
                    if (state === 'services-list') return updateServiceMainIcon(id, { image });
                    if (state === 'info-cards') return updateAdditionMainIcon(id, { image });
                }},
                { condition: video, func: () => {
                    if (state === 'catalogs-list') return updateCategoryGifPreview(id, { video });
                    if (state === 'services-list') return updateServiceGifPreview(id, { video });
                    if (state === 'info-cards') return updateAdditionGifPreview(id, { video });
                }},
                { condition: resVideo, func: () => {
                    if (state === 'services-list') return updateServiceGif(id, { resVideo });
                    if (state === 'info-cards') return updateAdditionGif(id, { resVideo });
                }},
                { condition: description, func: () => {
                        if (state === 'services-list'){
                            updateServiceDescription(id, { description })
                            .then(()=>{
                                if (iconLinks.length !== 0){
                                    for (const link of iconLinks) {
                                        addServiceIcon(id, { link });
                                    }
                                }
                            })
                        };
                        if (state === 'info-cards'){
                            updateAdditionDescription(id, { description })
                            .then(()=>{
                                if (iconLinks.length !== 0){
                                    for (const link of iconLinks) {
                                        addAdditionIcon(id, { link });
                                    }
                                }
                            })
                        }
                        return;
                    }
                }];
                /*{ condition: iconLinks.length !== 0, func: async () => {
                    // тут нужно очистить иконки
                    for (const link of iconLinks) {
                        if (state === 'services-list') await addServiceIcon(id, { link });
                        if (state === 'info-cards') await addAdditionIcon(id, { link });
                    }
                }}*/

            for (const { condition, func } of updates) {
                handleUpdate(condition, func, updateEvent);
            }
        }
        console.log("should added: ", newCard);
    }

    document.getElementById('card-form').removeEventListener('submit', submitForm);
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
    clone.querySelectorAll("textarea").forEach((input) => {
        input.value = "";
        input.textContent = "";
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

        const typeOfParent = document.querySelectorAll("div.parent-existence");
        typeOfParent.forEach(parent=>{
            parent.classList.add("hidden");
        })
        document.querySelector(`label.parent-existence`).classList.add("hidden");
    }
    else if (state === 'info-cards'){

        const typeOfParent = document.querySelectorAll("div.parent-existence");
        typeOfParent.forEach(parent=>{
            parent.classList.add("hidden");
        })
        document.querySelector(`label.parent-existence`).classList.add("hidden");

        parentDivs.forEach((div)=> div.classList.add("hidden"))
    }
    else{

        const typeOfParent = document.querySelectorAll("div.parent-existence");
        typeOfParent.forEach(parent=>{
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
