import { addGastrualSearch, removeGastrualSearch, removeAllTags } from "../search/gastrualSearch.js";
import { startWebcam, stopWebcam } from "../api/gastrualApi.js";

import { resetIdleTimer } from "../returnHome.js";




const closeSectionWeb = (event)=> {
    const popup = document.querySelector('.popup');
    const overlay = document.querySelector('.overlay');
    if (popup && event.target.contains(overlay)) {
        closeWebcamPopup();
        document.removeEventListener('click', closeSectionWeb);
    }
};
const closePopupOnKeyWeb =(evt)=>{
    if (evt.key === 'Escape'){
        evt.preventDefault();
        closeWebcamPopup();
        document.removeEventListener('click', closePopupOnKeyWeb);
    }
};


const showPopup = ()=>{  
    const popup = document.getElementById('popup');
    popup.classList.add("popup-opened");

    document.getElementById('overlay').style.display = 'block';
    popup.style.display = 'block';
    //enablePopupScroll();
}
const closePopup = ()=>{
    const popup = document.getElementById('popup');
    popup.classList.remove("popup-opened");
    document.getElementById('overlay').style.display = 'none';
    popup.style.display = 'none';
    stopWebcam();
    //disablePopupScroll(popup);
}

const showWebcamPopup = ()=>{ 
    startWebcam();
    document.addEventListener('click', closeSectionWeb);
    document.addEventListener('keydown', closePopupOnKeyWeb); 
    showPopup();
    //requestWebcam();
    addGastrualSearch();
}
const closeWebcamPopup = ()=>{
    closePopup();
    //releaseWebcam();
    removeGastrualSearch();
    removeAllTags();
}

const addWebcamPopupShow = ()=>{
    const catalog= document.querySelector(".catalogs");
    if (catalog.classList.contains("clear-language"))
    {
        document.querySelector(".search-button").style = "margin-right: 0";
        document.getElementById('showPopup').querySelector("img").classList.add("hidden")
    }
    else{
        document.querySelector(".search-button").style = "margin-right: 2vw";
    }
    
    document.getElementById('showPopup').addEventListener('click', showWebcamPopup);
};
const addWebcamPopupClose = ()=>{
    document.querySelectorAll('.closePopup').forEach((button)=>{
        button.addEventListener('click', closeWebcamPopup);
    })
}

export {addWebcamPopupShow, addWebcamPopupClose}