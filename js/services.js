
import { hideCatalogs} from "./renderCatalogs.js";
import { createServiceCard } from "./main/createrObj.js";
import { getService } from "./api/api.js";
import { addHeader, addHeaderForSearch, removeSearchHeader} from "./headers.js";
import { getCellById, getCatalogId, getCellNameById, equalizeSubtitles } from "./util.js";
import { addPlayVidButton } from "./vidPlayButton.js";
import { hideSkeletonsAndReplace, addSkeletons, updateSkeletonElementCount } from './skeletons/skeleton.js';

import { addAdminButtonsToCards, addCadrdSample } from "./adminPanel.js";

const blank = "";

const displayServices = (services, searched = false)=> {

  const servicesContainer = document.querySelector('.services-list');
  //servicesContainer.innerHTML = ''; // Очищаем контейнер перед добавлением новых данных
  for(var i = 0; i < servicesContainer.children.length; i++){
    const service = servicesContainer.children[i];
    service.classList.add("hidden");
  }

  const titleCounts = {};

  services.content.forEach(function(card) {
    if (!titleCounts[card.title]) {
        titleCounts[card.title] = 1;
        titleCounts[card.title]++;
    }
  });
  //const services = getServicesByCatalog(cell); // Функция, которая возвращает список услуг по ID каталога
  services.content.forEach((service)=> {
    //const serviceElement = createService(service);
    /*if (titleCounts[service.title] > 1) {
      service.title = getCellNameById(service.categoryId) + " " + service.title;
    }*/

    const services = document.querySelector(".services");
    const card = createServiceCard(service, services.classList.contains("clear-language"));
    servicesContainer.appendChild(card);
    if (!searched){
      if(card.querySelector(".categoryName"))
        card.querySelector(".categoryName").remove();
    }
  });
  
  hideSkeletonsAndReplace("services");
  equalizeSubtitles();
  document.addEventListener("resize", equalizeSubtitles)
  //equalizeSubtitles("services")
}

const loadServices = (catalogId)=>
  getService(catalogId)
      .then((data) => {
        updateSkeletonElementCount(data.content.length);
        displayServices(data);
        addPlayVidButton();
        
        addAdminButtonsToCards();
        if (document.querySelector("body").classList.contains("admin")){
          addCadrdSample(document.querySelector('.services-list'));
        }
      })
      .catch((err)=> console.log(err));

const showServices = ()=>{
  addHeader();
  //addSkeletons();
  
  const id = getCatalogId();
  loadServices(id);
  //displayServices(cell);
  hideCatalogs();
}
/*
document.addEventListener('newCardCreated', (event)=>{
  //loadServices(event.detail.card.getAttribute("catalog-id"))
  showServices();
});*/

const updateURL = (query)=>{

  const searchParams = new URLSearchParams(window.location.search);

  // Обновляем или добавляем параметр admin
  searchParams.set('query', query);

  // Обновляем URL без перезаписи других параметров
  const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
  history.pushState({ query: query }, '', newUrl);
}

const showSearchedServices = (services, query)=>{
  removeSearchHeader();
  addHeaderForSearch();
  //history.pushState({ query: query }, '', `?query=${query}`);
  updateURL(query);
  //console.log(services)
  displayServices(services, true);
  hideCatalogs();
  addPlayVidButton();

  addAdminButtonsToCards();
  if (document.querySelector("body").classList.contains("admin")){
    addCadrdSample(document.querySelector('.services-list'));
  }
}


export {showServices, showSearchedServices, loadServices};