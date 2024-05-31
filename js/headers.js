import { getCellNameById } from "./util.js";

const searchHeader = "Результаты поиска";


const showArrows = ()=>{
    const listChildren = document.querySelector(".header-list");
    const prevHeader = listChildren.lastElementChild;
    const hiddenEl = prevHeader.querySelector(".hidden");
    hiddenEl.classList.remove("hidden");
}

const hideArrows = ()=>{
    const list = document.querySelector(".header-list");
    const prevHeader = list.lastElementChild;
    const hiddenEl = prevHeader.querySelector(".arrow");
    hiddenEl.classList.add("hidden");
}

const addHeader = ()=>{
    const curURL = window.location.href;
    const list = document.querySelector(".header-list");
    const listChildren = list.children;

    const newHeaderTemp = document.querySelector('#header').content.querySelector('li');
    
    const newHeader = document.importNode(newHeaderTemp, true);
    newHeader.querySelector("a").href = curURL;
    
    const arrow = document.createElement("img");
    arrow.classList.add("arrow");
    arrow.classList.add("hidden");
    arrow.src = "/img/breadMini3.svg"

    const prevHeader = listChildren[listChildren.length-1];
    showArrows();

    newHeader.querySelector("a").textContent = getCellNameById(curURL[curURL.length-1]);
    prevHeader.classList.replace("current-page", "prev-page");
    newHeader.appendChild(arrow);
    list.appendChild(newHeader);
}



const addHeaderForSearch = ()=>{
    const curURL = window.location.href;
    const list = document.querySelector(".header-list");
    const listChildren = list.children;

    const newHeaderTemp = document.querySelector('#header').content.querySelector('li');
    const newHeader = document.importNode(newHeaderTemp, true);

    showArrows();

    newHeader.querySelector("a").href = curURL;

    newHeader.querySelector("a").textContent = searchHeader;
    listChildren[listChildren.length-1].classList.replace("current-page", "prev-page");
    list.appendChild(newHeader);
} 

const getLastHeader = ()=>{
    const list = document.querySelector(".header-list");
    return list.lastChild;
}
  
const removeSearchHeader = ()=>{
    const lastHeader = getLastHeader().innerText;
    if (lastHeader === searchHeader){
        removeLastHeader();
    }
}
const removeLastHeader = ()=>{

    const list = document.querySelector(".header-list");
    list.removeChild(getLastHeader());
    const prevHeader = list.children[list.children.length-1];
    hideArrows();
    prevHeader.classList.replace("prev-page", "current-page");
}

const changeHeaderBorderRadius = ()=>{
    const body = document.querySelector("body");
    const header =  document.querySelector(".header-list");
    if (body.offsetWidth === header.offsetWidth){
        header.style = "border-radius:0px;";
        if(document.querySelector(".catalogs").classList.contains("clear-language")){
            //document.querySelector(".view-buttons").classList.add("hidden");
            document.querySelector(".buttons-area").style = "justify-content: center;"
        }
    }
    else{
        header.style = "border-radius:30px;";
        //document.querySelector(".view-buttons").classList.remove("hidden");
        document.querySelector(".buttons-area").style = "justify-content: center;"
    }
}

window.addEventListener('resize', changeHeaderBorderRadius);
document.addEventListener('DOMContentLoaded',changeHeaderBorderRadius);
export {addHeader, removeLastHeader, addHeaderForSearch, removeSearchHeader}