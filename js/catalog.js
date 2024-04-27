
import { getAllServices, createService } from "./util.js";
import { hideCatalogs} from "./renderIcons.js";
import { createServiceCard } from "./main/createrObj.js";
import { getService } from "./api.js";
import { addHeader } from "./headers.js";
import { getCellById, getCatalogId } from "./util.js";


const displayServices = (services)=> {

  const servicesContainer = document.querySelector('.services-list');
  servicesContainer.innerHTML = ''; // Очищаем контейнер перед добавлением новых данных

  //const services = getServicesByCatalog(cell); // Функция, которая возвращает список услуг по ID каталога
  services.content.forEach((service)=> {
    //const serviceElement = createService(service);
    const services = document.querySelector(".services");
    const card = createServiceCard(service, services.classList.contains("clear-language"));
    servicesContainer.appendChild(card);
  });
}



const showServices = (cell)=>{
  addHeader();
  const loadServices = (catalogId)=>
  getService(catalogId)
      .then((data) => {
        displayServices(data);
      })
      .catch((err)=> console.log(err));
  const id = getCatalogId();
  loadServices(id);
  //displayServices(cell);
  hideCatalogs();
}

const renderCatalogs = ()=>{
  const catalogCells = document.querySelectorAll('.catalog-card');
  catalogCells.forEach((cell) =>{
    cell.addEventListener('click', () =>{
      const catalogId = cell.getAttribute('catalog-id');
      history.pushState({ catalogId: catalogId }, '', `?catalog=${catalogId}`);
      showServices(cell);
    });
  });
}

const addCatalogButton = ()=>{
  window.onload = function(){
    var urlParams = window.location.search;
    if (urlParams.match('catalog')) {
        var stateString = urlParams[urlParams.length-1];
        showServices(getCellById(stateString));
    }
  }
  document.addEventListener('DOMContentLoaded', renderCatalogs());
};

export {addCatalogButton, showServices};