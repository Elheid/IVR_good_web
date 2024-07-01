
const createAdminButton = ()=>{
    const button = document.createElement('div');
    button.classList.add("admin-button");
    button.textContent = "admin";
    return button;
}

const body = document.querySelector("body");
let adminButton = document.querySelector(".admin-button");
if (!document.querySelector(".admin-button")){
    document.querySelector("header").appendChild(createAdminButton());
    adminButton = document.querySelector(".admin-button");
}

document.addEventListener("DOMContentLoaded", ()=>{
    if (window.location.search.indexOf("admin=true") > 0){
        adminButtonClick();
    }
})

const updateURL = ()=>{
    const isAdmin = body.classList.contains("admin");

    const searchParams = new URLSearchParams(window.location.search);

    // Обновляем или добавляем параметр admin
    searchParams.set('admin', isAdmin);

    // Обновляем URL без перезаписи других параметров
    const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
    history.pushState({ admin: isAdmin }, '', newUrl);
}

const adminButtonClick = ()=>{
    body.classList.toggle("admin")
    updateURL();
    toggleExtraButtons();
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

const createExtraButtons = ()=>{
    const container = document.createElement('div');
    container.classList.add("extended-container")
    const deleteButton = document.createElement('button');
    deleteButton.classList.add("extended-button");
    deleteButton.classList.add("delete-button");
    deleteButton.textContent = "delete";
    const editButton = document.createElement('button');
    editButton.classList.add("extended-button");
    editButton.classList.add("edit-button");
    editButton.textContent = "edit";
    container.appendChild(deleteButton);
    container.appendChild(editButton);
    return  container;
}

const deleteExtraButtons = (card)=>{
    const container = card.querySelector(".extended-container");
    container.remove();
}
const addAdminButtonsEvent = (card)=>{
    const container = createExtraButtons();

    if (!card.querySelector(".extended-container")){
        card.appendChild(container);
    }
}
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

const toggleExtraButtons = ()=>{
    const lists = document.querySelectorAll(".list-of-cards:not(.sceleton-list)");
    for(var i = 0; i < lists.length; i++){
        const cards = lists[i].children;
        if (cards.length > 0){
            for(var j = 0; j < cards.length; j++){
                if (!body.classList.contains("admin")){
                    deleteExtraButtons(cards[j]);
                }
                else{
                    addAdminButtonsEvent(cards[j]);
                }
            }
        }
    }
    
}


const addButtons = ()=>{
    adminButton.addEventListener("click", adminButtonClick)
}



const addAdminPanel = ()=>{
    addButtons();
}

export {addAdminPanel, addAdminButtonsToCards}