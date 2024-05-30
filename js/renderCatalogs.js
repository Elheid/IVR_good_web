
import {  createCatalogCard } from "./main/createrObj.js";
import { hideSkeletonsAndReplace } from './skeletons/skeleton.js';
import { showServices } from "./services.js";
import { getCellById } from "./util.js";
const list = document.querySelector('.catalogs-list');

const services = document.querySelector('.services-list');



/*const fillList = (creator, num)=>{
    for (let i = 0; i < num; i++){
        const catalog = createCatalog();
        const newElement = creator(catalog);
        list.appendChild(newElement);
    }
}*/
const renderCatalogs = ()=>{
    const catalogCells = document.querySelectorAll('.catalog-card');
    catalogCells.forEach((cell) =>{
      const button = cell.querySelector(".card-button");
      button.addEventListener('click', () =>{
        const catalogId = cell.getAttribute('catalog-id');
        history.pushState({ catalogId: catalogId }, '', `?catalog=${catalogId}`);
        showServices();
      });
    });
}
const returnState = (searchResult)=>{
  var urlParams = window.location.search;
    if (urlParams.match('catalog')) {
      var stateString = urlParams[urlParams.length-1];
      showServices(getCellById(stateString));
    }
    if (urlParams.match('query')) {
      var stateString = urlParams.split("=");
      var state = new URLSearchParams(urlParams).get('query');
      searchResult(state);
    }
};

const addCatalogButton = (searchResult)=>{
  window.onload = returnState(searchResult);
  document.addEventListener('DOMContentLoaded', renderCatalogs());
};


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




export {initializeResults , hideCatalogs, openCatalogs, addCatalogButton, clearServices};
