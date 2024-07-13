
import {  createCatalogCard } from "./main/createrObj.js";
import { hideSkeletonsAndReplace } from './skeletons/skeleton.js';
import { showServices } from "./services.js";
import { getCellById, equalizeSubtitles, getLastSubCatalog, countSubCatalogs, getPreSubCatalog } from "./util.js";

import { addCadrdSample } from "./adminPanel.js";
import { addHeader } from "./headers.js";

const catalogsList = document.querySelector('.catalogs-list');


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

const updateURLSubCatalog = (subCatalogId)=>{
  const searchParams = new URLSearchParams(window.location.search);

  // Обновляем или добавляем параметр admin
  const subCatalog = getLastSubCatalog();//searchParams.get("sub-catalog");
  if (subCatalog && subCatalog !== 0){
    // Получаем список всех существующих sub-catalog параметров в URL
    let i = 1; // начальный индекс для нового параметра sub-catalog
    while (searchParams.has(`sub-catalog${i}`)) {
        i++; // увеличиваем индекс, пока не найдем свободный
    }

    // Добавляем новый параметр sub-catalog с инкрементированным индексом
    searchParams.set(`sub-catalog${i}`, subCatalogId);
  }else{
    searchParams.set(`sub-catalog`, subCatalogId);
  }

  // Обновляем URL без перезаписи других параметров
  const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
  history.pushState({ subCatalogId: subCatalogId }, '', newUrl);
}


const catalogClick = (cell) =>{
  const catalogId = cell.getAttribute('catalog-id');
  //history.pushState({ catalogId: catalogId }, '', `?catalog=${catalogId}`);
  const id = cell.getAttribute("catalog-id")

  if(cell.classList.contains("has-sub-catalogs")){
    hideCatalogs();
    if (countSubCatalogs() >= 1){
      hideSubCategories();
    }
    showSubCategories(id);
    updateURLSubCatalog(catalogId);
    addHeader();
  }
  else{
    hideSubCategories();
    updateURL(catalogId);
    showServices();
  }
}

const hideSubCategories =()=>{
  //localStorage.setItem("subCatalogHref", window.location.search)
  const subCatalogs = document.querySelectorAll('.sub-catalogs');
  const id = getLastSubCatalog();//new URLSearchParams(window.location.search).get("sub-catalog");
  if (subCatalogs){
    const matchingElement = Array.from(subCatalogs).find(element =>element.getAttribute("parent-id") === id);
    if (matchingElement){
      const listSubCategory = matchingElement.querySelector(".sub-catalogs-list")
      listSubCategory.classList.add("hidden");
    }
  }
}
const showSubCategories =(id)=>{
  const subCatalogs = document.querySelectorAll('.sub-catalogs');
  if (subCatalogs){
    const matchingElement = Array.from(subCatalogs).find(element => element.getAttribute("parent-id") === id);
    if (matchingElement){
      const listSubCategory = matchingElement.querySelector(".sub-catalogs-list")
      listSubCategory.classList.remove("hidden");
    }
  }
}

const searchSubList = (id)=>{
  const subCatalogs = document.querySelectorAll('.sub-catalogs');
  if (subCatalogs){
    const matchingElement = Array.from(subCatalogs).find(element => element.getAttribute("parent-id") === id);
    if (matchingElement){
      return matchingElement.querySelector(".sub-catalogs-list");
    }
  }
}

const replaceCardToSubCategory =(cell)=>{
  if (cell.classList.contains("sub-catalog-card")){
    const id = cell.getAttribute("parent-id")
    const listSubCategory = searchSubList(id);
    listSubCategory.appendChild(cell);
  }
}

document.addEventListener('newCardCreated', (event)=>{
  const catalogId = event.detail.card.getAttribute("catalog-id");
  const button = event.detail.card.querySelector(".card-button");
  button.addEventListener('click', ()=>{
    catalogClick(event.detail.card);
    if (isAdmin()){
      addCadrdSample(document.querySelector('.services-list'));
    }
  });
});

const renderCatalogs = ()=>{
    const catalogCells = document.querySelectorAll('.catalog-card');

    catalogCells.forEach((cell) =>{
      replaceCardToSubCategory(cell);
      const button = cell.querySelector(".card-button");
      if (button){
        button.addEventListener('click', ()=>catalogClick(cell));
      }
    });
}

const returnState = (searchResult)=>{
  var urlParams = window.location.search;
    if (urlParams.match('catalog')) {

      /*const state = "catalog=";
      const index = urlParams.indexOf(state)+state.length;*/
      //var stateString = urlParams[index];
      let idCatalog = new URLSearchParams(window.location.search).get("catalog");
      let idSubCatalog = getLastSubCatalog();//new URLSearchParams(window.location.search).get("sub-catalog");
      if(idSubCatalog && idSubCatalog !== "" && idCatalog && idCatalog !== ""){
        var stateString = new URLSearchParams(urlParams).get('catalog');

        const subCatalogs = document.querySelectorAll('.sub-catalogs');
      
        const matchingElement = Array.from(subCatalogs).find(element =>element.getAttribute("parent-id") === stateString);
        if (matchingElement){
          const listSubCategory = matchingElement.querySelector(".sub-catalogs-list");
          listSubCategory.classList.remove("hidden");
        }else{
          showServices(getCellById(stateString));
        }
      }
      else if (idSubCatalog && idSubCatalog !== ""){

          //window.location.search = subCatalogHref;

          const subCatalogs = document.querySelectorAll('.sub-catalogs');
          //const id = new URLSearchParams(subCatalogHref).get("catalog");
          //const curId = new URLSearchParams(window.location.search).get("catalog");

            //localStorage.removeItem("subCatalogHref");
            const matchingElement = Array.from(subCatalogs).find(element =>element.getAttribute("parent-id") === idSubCatalog);
            const listSubCategory = matchingElement.querySelector(".sub-catalogs-list")
            listSubCategory.classList.remove("hidden");

            const services = document.querySelector('.services-list');
            services.innerHTML = "";


            const catalogs = document.querySelector(".catalogs:not(.sceleton)").querySelector("ul");
            catalogs.classList.add("hidden");
            const preSubId = getPreSubCatalog();
            if (preSubId){
              if (preSubId !== idSubCatalog){
                addHeader(getPreSubCatalog());
                addHeader(idSubCatalog);
              }
            }
            else{
              addHeader(idSubCatalog);
            }
      }
      else if (idCatalog && idCatalog !== ""){
        var stateString = new URLSearchParams(urlParams).get('catalog');
        showServices(getCellById(stateString));
      }
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
        catalogsList.appendChild(catalog);
    }
    hideSkeletonsAndReplace("catalogs");
    equalizeSubtitles();
    window.addEventListener('resize', equalizeSubtitles);
    /*equalizeIconContainers();
    window.addEventListener('resize', equalizeIconContainers);*/

    //equalizeSubtitles("catalogs")
}

const hideCatalogs = ()=>{
  catalogsList.classList.add("hidden");
}
const openCatalogs = ()=>{
    catalogsList.classList.remove("hidden");
}

const clearServices = ()=>{
    services.innerHTML = "";
}




export {initializeResults , hideCatalogs, hideSubCategories, openCatalogs, addCatalogButton, clearServices};
