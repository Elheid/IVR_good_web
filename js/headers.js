import { getCellNameById } from "./util.js";

const searchHeader = "Результаты поиска";

const addHeader = ()=>{
    const curURL = window.location.href;
    const list = document.querySelector(".header-list");
    const listChildren = list.children;

    const newHeaderTemp = document.querySelector('#header').content.querySelector('li');
    const newHeader = document.importNode(newHeaderTemp, true);
    newHeader.querySelector("a").href = curURL;

    const prevHeader = listChildren[listChildren.length-1];
    const hiddenEl = prevHeader.querySelector(".hidden");
    hiddenEl.classList.remove("hidden");

    newHeader.querySelector("a").textContent = getCellNameById(curURL[curURL.length-1]);
    prevHeader.classList.replace("current-page", "prev-page");
    list.appendChild(newHeader);
}



const addHeaderForSearch = ()=>{

    const curURL = window.location.href;
    const list = document.querySelector(".header-list");
    const listChildren = list.children;

    const newHeaderTemp = document.querySelector('#header').content.querySelector('li');
    const newHeader = document.importNode(newHeaderTemp, true);


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
    const hiddenEl = prevHeader.querySelector(".arrow");
    hiddenEl.classList.add("hidden");
    list.children[list.children.length - 1].classList.replace("prev-page", "current-page");
}
  export {addHeader, removeLastHeader, addHeaderForSearch, removeSearchHeader}