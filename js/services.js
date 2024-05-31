
import { hideCatalogs} from "./renderCatalogs.js";
import { createServiceCard } from "./main/createrObj.js";
import { getService } from "./api/api.js";
import { addHeader, addHeaderForSearch, removeSearchHeader} from "./headers.js";
import { getCellById, getCatalogId, getCellNameById, equalizeSubtitles } from "./util.js";
import { addPlayVidButton } from "./vidPlayButton.js";
import { hideSkeletonsAndReplace, addSkeletons } from './skeletons/skeleton.js';

const displayServices = (services)=> {

  const servicesContainer = document.querySelector('.services-list');
  servicesContainer.innerHTML = ''; // Очищаем контейнер перед добавлением новых данных

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
  });
  hideSkeletonsAndReplace("services");
  equalizeSubtitles();
  //equalizeSubtitles("services")
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


export {showServices, showSearchedServices};