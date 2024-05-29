
import {  createCatalogCard } from "./main/createrObj.js";
import { hideSkeletonsAndReplace } from './skeletons/skeleton.js';
const list = document.querySelector('.catalogs-list');

const services = document.querySelector('.services-list');



/*const fillList = (creator, num)=>{
    for (let i = 0; i < num; i++){
        const catalog = createCatalog();
        const newElement = creator(catalog);
        list.appendChild(newElement);
    }
}*/


const initializeResults = (cards)=>{
    const categoties = cards.content;
    const catalogs = document.querySelector(".catalogs");
    for(var i = 0; i < categoties.length; i++){
        const catalog = createCatalogCard(categoties[i], catalogs.classList.contains("clear-language"));
        list.appendChild(catalog);
    }
    hideSkeletonsAndReplace("catalogs");
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
