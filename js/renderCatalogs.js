
import {  createCatalogCard } from "./main/createrObj.js";
import { hideSkeletonsAndReplace } from './skeletons/skeleton.js';
import { showServices } from "./services.js";
import { getCellById, equalizeSubtitles } from "./util.js";

import { addCadrdSample } from "./adminPanel.js";

const list = document.querySelector('.catalogs-list');

const services = document.querySelector('.services-list');



/*const fillList = (creator, num)=>{
    for (let i = 0; i < num; i++){
        const catalog = createCatalog();
        const newElement = creator(catalog);
        list.appendChild(newElement);
    }
}*/
const updateURL = (catalogId)=>{
  const searchParams = new URLSearchParams(window.location.search);

  // Обновляем или добавляем параметр admin
  searchParams.set('catalog', catalogId);

  // Обновляем URL без перезаписи других параметров
  const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
  history.pushState({ catalogId: catalogId }, '', newUrl);
}

const catalogClick = (cell) =>{
  const catalogId = cell.getAttribute('catalog-id');
  //history.pushState({ catalogId: catalogId }, '', `?catalog=${catalogId}`);
  updateURL(catalogId);
  showServices();
}

document.addEventListener('newCardCreated', (event)=>{
  const catalogId = event.detail.card.getAttribute("catalog-id");
  const button = event.detail.card.querySelector(".card-button");
  button.addEventListener('click', ()=>{
    catalogClick(event.detail.card);
    if (document.querySelector("body").classList.contains("admin")){
      addCadrdSample(document.querySelector('.services-list'));
    }
  });
});

const renderCatalogs = ()=>{
    const catalogCells = document.querySelectorAll('.catalog-card');
    catalogCells.forEach((cell) =>{
      const button = cell.querySelector(".card-button");
      button.addEventListener('click', ()=>catalogClick(cell));
    });
}

const returnState = (searchResult)=>{
  var urlParams = window.location.search;
    if (urlParams.match('catalog')) {
      /*const state = "catalog=";
      const index = urlParams.indexOf(state)+state.length;*/
      //var stateString = urlParams[index];
      var stateString = new URLSearchParams(urlParams).get('catalog');
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
    equalizeSubtitles();
    window.addEventListener('resize', equalizeSubtitles);
    /*equalizeIconContainers();
    window.addEventListener('resize', equalizeIconContainers);*/

    //equalizeSubtitles("catalogs")
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
