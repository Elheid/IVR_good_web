import { createCatalog } from "./util.js";
import { createGoButtons, createCatalogCard } from "./main/createrObj.js";
import { removeLastHeader } from "./headers.js";

const list = document.querySelector('.catalogs-list');

const services = document.querySelector('.services-list');



const fillList = (creator, num)=>{
    for (let i = 0; i < num; i++){
        const catalog = createCatalog();
        const newElement = creator(catalog);
        list.appendChild(newElement);
    }
}


const initializeResults = (cards)=>{
    const categoties = cards.content;
    for(var i = 0; i < categoties.length; i++){
        const catalogs = document.querySelector(".catalogs");
        const catalog = createCatalogCard(categoties[i], catalogs.classList.contains("clear-language"));
        list.appendChild(catalog);
    }
    createGoButtons();
}

const hideCatalogs = ()=>{
  list.classList.add("hidden");
}
const openCatalogs = ()=>{
    list.classList.remove("hidden");
}

const clearServices = ()=>{
    services.innerHTML = "";
}

const goBackToCatalogs = ()=>{
    openCatalogs();
    clearServices();
    removeLastHeader();
}


export {initializeResults , hideCatalogs, openCatalogs, clearServices, goBackToCatalogs};
