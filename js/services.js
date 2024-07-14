
import { hideCatalogs, hideSubCategories} from "./renderCatalogs.js";
import { createServiceCard } from "./main/createrObj.js";
import { getService } from "./api/api.js";
import { addHeader, addHeaderForSearch, removeSearchHeader} from "./headers.js";
import { getCellById, getCatalogId, getCellNameById, equalizeSubtitles, isAdmin } from "./util.js";
import { addPlayVidButton } from "./vidPlayButton.js";
import { hideSkeletonsAndReplace, addSkeletons, updateSkeletonElementCount } from './skeletons/skeleton.js';

import { addAdminButtonsToCards, addCadrdSample } from "./adminPanel.js";


const blank = "";

const displayServices = (services, searched = false)=> {


  const servicesContainer = document.querySelector('.services-list');
  servicesContainer.classList.remove("hidden");
  //servicesContainer.innerHTML = ''; // Очищаем контейнер перед добавлением новых данных
  for(var i = 0; i < servicesContainer.children.length; i++){
    const service = servicesContainer.children[i];
    if (!service.classList.contains("card-to-add")){
      service.classList.add("hidden");
    }
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
        if (isAdmin()){
          addCadrdSample(document.querySelector('.services-list'));
        }
      })
      .catch((err)=>{ 
        console.log("Ошибка загрузки услуг или их нет "+err);
        if (isAdmin()){
          addCadrdSample(document.querySelector('.services-list'));
        }
      });

const showServices = ()=>{
  addHeader();
  //addSkeletons();
  
  const id = getCatalogId();
  loadServices(id);
  //displayServices(cell);
  document.querySelector(".services-list").classList.remove("hidden");
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
  hideSubCategories();
  addPlayVidButton();

  addAdminButtonsToCards();
  if (isAdmin()){
    addCadrdSample(document.querySelector('.services-list'));
  }
}


export {showServices, showSearchedServices, loadServices};