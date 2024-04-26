
import { getAllServices, createService } from "./util.js";
import { hideCatalogs} from "./renderIcons.js";
import { createServiceCard } from "./main/createrObj.js";
import { getService } from "./api.js";

//это бы в util убрать мб
const getCellById = (id)=>{
  const catalogCells = document.querySelectorAll('.catalog-card');
  for (const cell of catalogCells){
    const catalogId = cell.getAttribute('catalog-id');
    if (catalogId == id){
      return cell;
    }
  }
}
const getCellNameById = (id)=>{
  const cell = getCellById(id);
  return cell.innerText;
}
const getCatalogId = ()=>{
  const href = window.location.search;
  return href[href.length-1];
}
//

const displayServices = (services)=> {

  const servicesContainer = document.querySelector('.services-list');
  servicesContainer.innerHTML = ''; // Очищаем контейнер перед добавлением новых данных

  //const services = getServicesByCatalog(cell); // Функция, которая возвращает список услуг по ID каталога
  services.content.forEach((service)=> {
    //const serviceElement = createService(service);
    const card = createServiceCard(service);
    servicesContainer.appendChild(card);
  });
}

function getServicesByCatalog(cell) {
  const title = cell.innerText;
  return getAllServices(title);
}

//это вообще в отдельный файл
const addHeader = ()=>{
  const curURL = window.location.href;
  const list = document.querySelector(".header-list");
  const listChildren = list.children;
  const newHeaderTemp = document.querySelector('#header').content.querySelector('li');
  const newHeader = document.importNode(newHeaderTemp, true);
  newHeader.querySelector("a").href = curURL;
  newHeader.querySelector("a").textContent = getCellNameById(curURL[curURL.length-1]);
  listChildren[listChildren.length-1].classList.replace("current-page", "prev-page");
  list.appendChild(newHeader);
}

const removeLastHeader = ()=>{
  const list = document.querySelector(".header-list");
  list.removeChild(list.lastChild);
  list.children[list.children.length - 1].classList.replace("prev-page", "current-page");
}
//

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

export {addCatalogButton, removeLastHeader, showServices};