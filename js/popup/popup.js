

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
    //disablePopupScroll(popup);
}



const addPopupShow = ()=>{
    document.getElementById('showPopup').addEventListener('click', showPopup);
};
const addPopupClose = ()=>{
    document.getElementById('closePopup').addEventListener('click', closePopup);
}


export {showPopup, closePopup ,addPopupShow, addPopupClose}