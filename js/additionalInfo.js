
import {showPopup, closePopup} from "./popup/popup.js"
import { getInfoById } from "./api/api.js";
import { vidPlayIfIntersect } from "./vidPlayButton.js";

import { addCadrdSample } from "./adminPanel.js";

import { showInfoCard, removeAdditionalInfo, returnInfoCards, changeColorOfAddCard } from "./showInfo.js";

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
    if (document.querySelector(".info-cards").classList.contains("hidden")){
        document.querySelector(".info-cards").classList.remove("hidden")
    }
    if (document.querySelector("body").classList.contains("admin")){
        addCadrdSample(document.querySelector('.info-cards'));
        changeColorOfAddCard();
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

const loadInfo = (id)=>
    getInfoById(id)
        .then((data) => {
            showInfoCard(data);
            vidPlayIfIntersect();
        })
        .catch((err)=> console.log(err)
);


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


const removeInfoCards =()=>{
    const list = document.querySelector(".info-cards");
    list.innerHTML = "";
}

export {addInfoPopupShow, addInfoPopupClose, getIsClear}