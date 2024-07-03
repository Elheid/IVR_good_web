
import { createInfoCard } from "./main/createrObj.js";
import { getParamFromURL } from "./util.js";
import { infoRes } from "./main/createrObj.js";
import {showPopup, closePopup} from "./popup/popup.js"
import { getInfoById } from "./api/api.js";
import { vidPlayIfIntersect } from "./vidPlayButton.js";

import { addCadrdSample, extraButtonsUpdate } from "./adminPanel.js";

const getIsClear = (isClear)=>{
    return isClear;
}

const closeSection = (event)=> {
    const popup = document.querySelector('.popup');
    const overlay = document.querySelector('.overlay');
    if (popup && event.target.contains(overlay)) {
        closeInfoPopup();
        document.removeEventListener('click', closeSection);
    }
};

const closePopupOnKey =(evt)=>{
    if (evt.key === 'Escape'){
        evt.preventDefault();
        closeInfoPopup();
        document.removeEventListener('click', closePopupOnKey);
    }
};

const showInfoPopup = ()=>{
    document.addEventListener('click', closeSection);
    document.addEventListener('keydown', closePopupOnKey);   
    showPopup();
    showInfoCards();
    if (document.querySelector("body").classList.contains("admin")){
        addCadrdSample(document.querySelector('.info-cards'));
      }
}
const closeInfoPopup = ()=>{
    closePopup();
    removeInfoCards();
    removeAdditionalInfo();
}


const addInfoPopupShow = ()=>{
    document.getElementById('showPopup').addEventListener('click', showInfoPopup);
};
const addInfoPopupClose = ()=>{
    document.getElementById('closePopup').addEventListener('click', closeInfoPopup);
}
//info popup end

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

    /*const width = container.parentElement.offsetWidth;
    container.style = `width:calc(${width}px - 4%);`;// top:11%;*/
}

const removeAdditionalInfo = ()=>{
    const container = document.querySelector(".additional-info-res");
    container.innerHTML = "";
}


const loadInfo = (id)=>
    getInfoById(id)
        .then((data) => {
            showInfoCard(data);
            vidPlayIfIntersect();
        })
        .catch((err)=> console.log(err)
);

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

const showInfoCard = (infoTmp)=>{
    const list = document.querySelector(".info-cards");
    const card = createInfoCard(infoTmp);

    const clear = getParamFromURL()[1];
    if (clear === "true"){
        card.classList.add("clear-card")
        var img = document.createElement('img');
        img.classList.add('icon-in-card');
        img.src = infoTmp.mainIconLink;
        card.querySelector(".card-button").appendChild(img);
        const vid = card.querySelector("video");
        vid.classList.add("hidden");
    }


    list.appendChild(card);
    
    const additionalInfo = {
        gifLink: infoTmp.gifLink,
        description:infoTmp.description,
        title:infoTmp.title,
        iconLinks:infoTmp.iconLinks
    }
    
    const nextButton = card.querySelector(".card-button");
    nextButton.addEventListener("click", (evt)=>{
        showAdditionalInfo(additionalInfo);
    })

    extraButtonsUpdate(card);
    changeColorOfAddCard();
}


const returnPopupTitle = ()=>{
    const cardTitle = document.querySelector(".popup-title");
    cardTitle.textContent = "Дополнительная информация"; 
}

const showInfoCards = ()=>{


    const additionalInfoIds = document.getElementById("popup").getAttribute("addition-info-id");
    if (additionalInfoIds !== "null")
    {
        const idArray = additionalInfoIds.split(",");

        for(var i=0; i<idArray.length; i++){
            loadInfo(idArray[i]);
        }
        returnInfoCards();
    }
    else{
        const list = document.querySelector(".info-cards");
        const div = document.createElement("div");
        div.innerText = "Дополнительной информации нет";
        list.appendChild(div);
    }
}

const hideInfoCards =()=>{
    const list = document.querySelector(".info-cards");
    //list.innerHTML = "";
    list.classList.add("hidden");
}

const removeInfoCards =()=>{
    const list = document.querySelector(".info-cards");
    list.innerHTML = "";
}

const returnInfoCards =()=>{
    const list = document.querySelector(".info-cards");
    //list.innerHTML = "";
    if (list.classList.contains("hidden")){
        list.classList.remove("hidden");
    }
}

export {addInfoPopupShow, addInfoPopupClose, getIsClear}