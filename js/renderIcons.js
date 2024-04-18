import { createCatalog } from "./util.js";

import { createGoButtons, createCatalogCard } from "./main/createrObj.js";

const list = document.querySelector('.catalogs-list');

const services = document.querySelector('.services-list');



const fillList = (creator, num)=>{
    for (let i = 0; i < num; i++){
        const catalog = createCatalog();
        const newElement = creator(catalog);
        list.appendChild(newElement);
    }
}


const initializeResults = (num)=>{
    fillList(createCatalogCard, num);
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



export {initializeResults , hideCatalogs, openCatalogs, clearServices};
