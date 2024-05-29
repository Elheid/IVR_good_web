
import { hideCatalogs} from "./renderIcons.js";
import { createServiceCard, createGoButtons } from "./main/createrObj.js";
import { getService } from "./api/api.js";
import { addHeader, addHeaderForSearch, removeSearchHeader} from "./headers.js";
import { getCellById, getCatalogId, getCellNameById } from "./util.js";
import { addPlayVidButton } from "./video.js";
import { hideSkeletonsAndReplace, addSkeletons } from './skeletons/skeleton.js';

const displayServices = (services)=> {

  const servicesContainer = document.querySelector('.services-list');
  servicesContainer.innerHTML = ''; // Очищаем контейнер перед добавлением новых данных

  const titleCounts = {};

  services.content.forEach(function(card) {
    if (!titleCounts[card.title]) {
        titleCounts[card.title] = 1;
    } else {
        titleCounts[card.title]++;
    }
  });
  //const services = getServicesByCatalog(cell); // Функция, которая возвращает список услуг по ID каталога
  services.content.forEach((service)=> {
    //const serviceElement = createService(service);
    if (titleCounts[service.title] > 1) {
      service.title = getCellNameById(service.categoryId) + " " + service.title;
    }
    const query = window.location.href;
    if (query.includes("query")){
      const categoryName = getCellNameById(service.categoryId);
      service.title = categoryName + " -> " + service.title;
    }

    const services = document.querySelector(".services");
    const card = createServiceCard(service, services.classList.contains("clear-language"));
    servicesContainer.appendChild(card);
  });
  hideSkeletonsAndReplace("services")
}



const showServices = ()=>{
  addHeader();
  const loadServices = (catalogId)=>
  getService(catalogId)
      .then((data) => {
        displayServices(data);
        addPlayVidButton();
      })
      .catch((err)=> console.log(err));
  const id = getCatalogId();
  loadServices(id);
  //displayServices(cell);
  addSkeletons();
  hideCatalogs();
}

const showSearchedServices = (services, query)=>{
  removeSearchHeader();
  addHeaderForSearch();
  history.pushState({ query: query }, '', `?query=${query}`);
  displayServices(services);
  hideCatalogs();
  addPlayVidButton();

}


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

export {addCatalogButton, showServices, showSearchedServices};