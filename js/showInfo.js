import { extraButtonsUpdate, resAddEditButtons, resDeleteEditButtons } from "./adminPanel.js";
import { createAndUpdateInfoCard, infoRes } from "./main/createrObj.js";


const changeColorOfAddCard = ()=>{
    if (document.querySelector(".card-to-add")){
        document.querySelector(".card-to-add").classList.add("newAdd");
        /*if (document.querySelector(".card-to-add .gif")){
            document.querySelector(".card-to-add .gif").style = "color: #bba8a8;"
        }
        if (document.querySelector(".card-to-add .skeleton-content")){
            document.querySelector(".card-to-add .skeleton-content").style = "color: #bba8a8;"
        }*/
    }
}


const addOpenResultButton = (data, card)=>{
    const additionalInfo = {
        gifLink: data.gifLink,
        description:data.description,
        title:data.title,
        iconLinks:data.iconLinks,
        id: data.id,
    }
    const nextButton = card.querySelector(".card-button");
    nextButton.addEventListener("click", (evt)=>{
        showAdditionalInfo(additionalInfo);
    })
}
////info card

const showAdditionalInfo = (temp)=>{
    const info= infoRes(temp);
    const container = document.querySelector(".additional-info-res")


    //removeInfoCards();
    hideInfoCards();

    var div = document.createElement("div");
    div.className = "close-container";

    var button = document.createElement("button");
    button.className = "close-button";
    
    var img = document.createElement("img");
    img.src = "img/arrow-left-white.svg";
    img.alt = "Кнопка назад";
    button.appendChild(img);
    button.addEventListener("click", ()=>{
        //closeInfoPopup();
        removeAdditionalInfo();
        returnInfoCards();
        returnPopupTitle();
    } );

    div.appendChild(button);

    container.appendChild(info);

    container.appendChild(div);

    //toggleEditResButtons();
    const buttons = document.querySelectorAll(".edit-element-button");
    buttons.forEach(button =>{
        if (button.classList.contains("hidden")){
            button.classList.remove("hidden");
        }
    })
    if (isAdmin()){
        resAddEditButtons();
    }
    else{
        resDeleteEditButtons();
    }

    /*const width = container.parentElement.offsetWidth;
    container.style = `width:calc(${width}px - 4%);`;// top:11%;*/
}

const removeAdditionalInfo = ()=>{
    const container = document.querySelector(".additional-info-res");
    container.innerHTML = "";
}

const returnInfoCards =()=>{
    const list = document.querySelector(".info-cards");
    //list.innerHTML = "";
    if (list.classList.contains("hidden")){
        list.classList.remove("hidden");
    }
}

const returnPopupTitle = ()=>{
    const cardTitle = document.querySelector(".popup-title");
    const edit = cardTitle.parentNode.querySelector(".edit-element-button");
    if(edit){
        edit.classList.add("hidden")
    }
    cardTitle.textContent = "Дополнительная информация"; 
}

const hideInfoCards =()=>{
    const list = document.querySelector(".info-cards");
    //list.innerHTML = "";
    list.classList.add("hidden");
}

const showInfoCard = (infoTmp)=>{
    returnPopupTitle();
    const card = createAndUpdateInfoCard(infoTmp);
    addOpenResultButton(infoTmp, card)
    const list = document.querySelector(".info-cards");
    list.appendChild(card);
    if (localStorage.getItem("isAdmin") === "true"){
        extraButtonsUpdate(card); 
    }
    //changeColorOfAddCard();
}

export {showInfoCard, removeAdditionalInfo, returnInfoCards, changeColorOfAddCard}