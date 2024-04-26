import { createInfoCard } from "./main/createrObj.js";
import { createInfo } from "./util.js";
import { infoRes } from "./main/createrObj.js";
import { releaseWebcam, requestWebcam } from "./webcam.js";

const showAdditionalInfo = ()=>{
    const temp = {
        title:"Какой-то титул",
        url:"img/gastrual2.jpg",
        manualText:"Бла-бла-бла"
    }
    
    const info= infoRes(temp);
    const container = document.querySelector(".additional-info-res")
    removeInfoCards();

    var div = document.createElement("div");
    div.className = "close-container";

    var button = document.createElement("button");
    button.className = "close-button";
    
    var img = document.createElement("img");
    img.src = "img/next.png";
    img.alt = "Кнопка назад";
    button.appendChild(img);
    button.addEventListener("click", ()=>{
        closeInfoPopup();
    } );

    div.appendChild(button);

    container.appendChild(info);

    container.appendChild(div);
}

const removeAdditionalInfo = ()=>{
    const container = document.querySelector(".additional-info-res");
    container.innerHTML = "";
}

const showInfoCards = ()=>{
    const list = document.querySelector(".info-cards");
    for(var i=0; i<3; i++){
        const infoTmp = createInfo("Доп инфа для  "+document.querySelector(".card-title").textContent);
        const card = createInfoCard(infoTmp)
        
        list.appendChild(card);
        const nextButton = card.querySelector(".card-button");
        nextButton.addEventListener("click", (evt)=>{
            showAdditionalInfo();
        })
    }
    
}

const removeInfoCards =()=>{
    const list = document.querySelector(".info-cards");
    list.innerHTML = "";
}

const enablePopupScroll = ()=>{
    const popup = document.querySelector('.popup');
    document.body.style.overflow = 'hidden';
    popup.style.overflow ='auto';
}

const disablePopupScroll = ()=>{
    const popup = document.querySelector('.popup');
    document.body.style.overflow = 'auto'; 
    popup.style.overflow ='hidden';
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

const closeSectionWeb = (event)=> {
    const popup = document.querySelector('.popup');
    const overlay = document.querySelector('.overlay');
    if (popup && event.target.contains(overlay)) {
        closeWebcamPopup();
        document.removeEventListener('click', closeSection);
    }
};
const closePopupOnKeyWeb =(evt)=>{
    if (evt.key === 'Escape'){
        evt.preventDefault();
        closeWebcamPopup();
        document.removeEventListener('click', closePopupOnKey);
    }
};


const showPopup = ()=>{  
    const popup = document.getElementById('popup');
    popup.classList.add("popup-opened");

    document.getElementById('overlay').style.display = 'block';
    popup.style.display = 'block';
    enablePopupScroll();
}
const closePopup = ()=>{
    const popup = document.getElementById('popup');
    popup.classList.remove("popup-opened");
    document.getElementById('overlay').style.display = 'none';
    popup.style.display = 'none';
    disablePopupScroll(popup);
}

const showInfoPopup = ()=>{
    document.addEventListener('click', closeSection);
    document.addEventListener('keydown', closePopupOnKey);   
    showPopup();
    showInfoCards();
}
const closeInfoPopup = ()=>{
    closePopup();
    removeInfoCards();
    removeAdditionalInfo();
}

const showWebcamPopup = ()=>{ 
    document.addEventListener('click', closeSectionWeb);
    document.addEventListener('keydown', closePopupOnKeyWeb); 
    showPopup();
    requestWebcam();
}
const closeWebcamPopup = ()=>{
    closePopup();
    releaseWebcam();
}


const addPopupShow = ()=>{
    document.getElementById('showPopup').addEventListener('click', showPopup);
};
const addPopupClose = ()=>{
    document.getElementById('closePopup').addEventListener('click', closePopup);
}


const addInfoPopupShow = ()=>{
    document.getElementById('showPopup').addEventListener('click', showInfoPopup);
};
const addInfoPopupClose = ()=>{
    document.getElementById('closePopup').addEventListener('click', closeInfoPopup);
}

const addWebcamPopupShow = ()=>{
    const catalog= document.querySelector(".catalogs");
    if (catalog.classList.contains("clear-language"))
    {
        document.getElementById('showPopup').querySelector("img").classList.add("hidden")
    }
    
    document.getElementById('showPopup').addEventListener('click', showWebcamPopup);
};
const addWebcamPopupClose = ()=>{
    document.querySelectorAll('.closePopup').forEach((button)=>{
        button.addEventListener('click', closeWebcamPopup);
    })
}

export {addPopupShow, addPopupClose, addInfoPopupClose, addInfoPopupShow, addWebcamPopupShow, addWebcamPopupClose}