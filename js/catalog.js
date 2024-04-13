
import { getAllServices, createService } from "./util.js";
import { createServiceCard , hideCatalogs} from "./renderIcons.js";

const displayServices = (cell)=> {

  const target = cell;

  const servicesContainer = document.querySelector('.services-list');
  servicesContainer.innerHTML = ''; // Очищаем контейнер перед добавлением новых данных

  const services = getServicesByCatalogId(target); // Функция, которая возвращает список услуг по ID каталога
  services.forEach((service)=> {
    const serviceElement = createService(service);
    const card = createServiceCard(serviceElement);
    servicesContainer.appendChild(card);
  });
}

function getServicesByCatalogId(target) {
  const title = target.innerText;
  return getAllServices(title);
}

const renderCatalogs = ()=>{
  const catalogCells = document.querySelectorAll('.catalog-card');
  catalogCells.forEach((cell)=> {
    cell.addEventListener('click', () =>{
      const catalogId = cell.getAttribute('catalog-id');
      displayServices(cell);
      hideCatalogs();
      history.pushState({ catalogId: catalogId }, '', `?catalog=${catalogId}`);
    });
  });
}

const addCatalogButton = ()=>{
document.addEventListener('DOMContentLoaded', renderCatalogs());
};

export {addCatalogButton, renderCatalogs};