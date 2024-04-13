import { createCatalog } from "./util.js";



const list = document.querySelector('.catalogs-list');

const services = document.querySelector('.services-list');


const createCatalogCard = (catalog)=>{
    const catalogTemplate = document.querySelector('#catalog-template').content.querySelector('li');
    const cardCatalog = document.importNode(catalogTemplate, true);
    const cardTitle = cardCatalog.querySelector('.card-title');
    const imgOrGif = cardCatalog.querySelector('.catalog-gif');

    imgOrGif.src = catalog.img;
    cardTitle.textContent = catalog.title;
    cardCatalog.setAttribute("catalog-id", catalog.id);
    return cardCatalog;
};


const createServiceCard = ({id, title, img})=>{
    const serviceTemplate = document.querySelector('#service-template').content.querySelector('li');
    const cardCatalog = document.importNode(serviceTemplate, true);
    const cardTitle = cardCatalog.querySelector('.card-description');
    const imgOrGif = cardCatalog.querySelector('.service-gif');

    imgOrGif.src = img;
    cardTitle.textContent = title;
    cardCatalog.setAttribute("catalog-id", id);

    const nextButton = cardCatalog.querySelector(".service-button");

    nextButton.addEventListener("click", (evt)=>{
    const serviceName = evt.target.parentNode.querySelector(".card-description").textContent;
    window.location.href = `result.html?serviceName=${encodeURIComponent(serviceName)}`;
    })
    return cardCatalog;
};


const fillList = (creator, num)=>{
    for (let i = 0; i < num; i++){
        const catalog = createCatalog();
        const newElement = creator(catalog);
        list.appendChild(newElement);
    }
}

const initializeResults = (num)=>{
    fillList(createCatalogCard, num);
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



export {initializeResults, createServiceCard , hideCatalogs, openCatalogs, clearServices};
