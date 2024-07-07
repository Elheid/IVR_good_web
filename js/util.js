//const ARR_OF_TITLES = ["Паспорт", "Снилс", "ИНН","Судимость"];
const ARR_OF_SERVICES= {
    "Паспорт":[
    "Достижение 14 лет",
    "Достижение 20 лет/Достижение 45 лет",
    "Изменились персональные данные",
    "Изменение внешности",
    "Непригодность паспорта",
    
    "Опечатка в паспорте",
    "Паспорт украден/утерян",
    "Смена пола"],
    "СНИЛС":["Круг заявителей",
        "Перечень документов",
        "Срок предоставления",
        "Госпошлина"],
    "Судимость":["За пределами РФ",
        "На территории РФ"],
    "ИНН":["Круг заявителей",
        "Перечень документов",
        "Срок предоставления",
        "Госпошлина",
        "Смена ИНН"]
};
const ARR_OF_TITLES = Object.keys(ARR_OF_SERVICES);
const getRandomArrayElement = (elements) => elements[getRandomInteger(0, elements.length - 1)];
const getRandomInteger = (a, b) => {
    const lower = Math.ceil(Math.min(a, b));
    const upper = Math.floor(Math.max(a, b));
    const result = Math.random() * (upper - lower + 1) + lower;
    return Math.floor(result);
};
const idCreater = () =>{
    let lastGeneratedId = 0;
  
    return function () {
      lastGeneratedId += 1;
      return lastGeneratedId;
    };
};



const createIdForCatalog = idCreater();
const createIdForService = idCreater();
const createIdForInfo = idCreater();



const titleCreator = idCreater();

const emptyGifURL = "img/ratherGIF.jpg";
const emptyForClear = "img/clear.jpg";
/*
const getTitles = ()=>{
    const id = titleCreator() - 1;
    return ARR_OF_TITLES[id];
}*//*

const createCatalog = () => ({
    id: createIdForCatalog(), //любое число
    title:getTitles(),//getRandomArrayElement(ARR_OF_TITLES),
    img:document.querySelector(".catalogs").classList.contains("clear-language") 
    ? emptyForClear : emptyGifURL
});
const getAllServices = (title)=> { return ARR_OF_SERVICES[title];}


const createService = (title) => ({
    id: createIdForService(), //любое число
    title:title,
    img:document.querySelector(".services").classList.contains("clear-language") 
    ? emptyForClear : emptyGifURL
});

const createInfo = (title) => ({
    id: createIdForInfo(), //любое число
    title:title,
    img:"img/ratherGIF.jpg",
    additionalInfo:"сделай то, не знаю, что"
});*/

const getCellById = (id)=>{
    const catalogs = document.querySelector(".catalogs:not(.sceleton)")
    const catalogCells = catalogs.querySelectorAll('.catalog-card');
    for (const cell of catalogCells){
      const catalogId = cell.getAttribute('catalog-id');
      if (catalogId == id){
        return cell;
      }
    }
}

const getCellNameById = (id)=>{
    const cell = getCellById(id);
    const title = cell.querySelector(".card-title");
    return title.innerText;
}
const getCatalogId = ()=>{
    const urlParams = window.location.search;
    return new URLSearchParams(urlParams).get('catalog');
}
const getCatalogsNames = ()=>{
    const catalogs = document.querySelector(".list-of-cards.catalogs-list").children;
    const res = [];
    for (let i = 0; i < catalogs.length; i++){
        res.push(catalogs[i].querySelector(".card-title").textContent)
    }
    //catalogs.forEach(catalog=> res.push(catalog.querySelector(".card-title").textContent));
    return res;
}
const getCatalogsId = ()=>{
    const catalogs = document.querySelector(".list-of-cards.catalogs-list").children;
    const res = [];
    for (let i = 0; i < catalogs.length; i++){
        res.push(catalogs[i].getAttribute("catalog-id"))
    }
    //catalogs.forEach(catalog=> res.push(catalog.querySelector(".card-title").textContent));
    return res;
}

/*
const getServicesByCatalog = (cell)=>{
    const title = cell.innerText;
    return getAllServices(title);
}*/


const equalizeSubtitles = ()=>{
    //const container = document.querySelector(`.${list} .list-of-cards:not(.sceleton-list)`)
    var cards = document.querySelectorAll('.substrate');
    var maxHeight = 0;
    
    cards.forEach((card)=> {
    if (card.offsetHeight > maxHeight) {
    maxHeight = card.offsetHeight;
    }
    });
    cards.forEach(function(card) {
    card.style.height = maxHeight > 300 ? "fit-content" :maxHeight + 'px';;
    });
}

const equalizeIconContainers = ()=>{
    //const container = document.querySelector(`.${list} .list-of-cards:not(.sceleton-list)`)
    var containers = document.querySelectorAll('.icon-container');
    var maxHeight = 0;
    
    containers.forEach((icon)=> {
    if (icon.offsetHeight > maxHeight) {
    maxHeight = icon.offsetHeight;
    }
    });
    
    containers.forEach(function(card) {
    card.style.height = maxHeight + 'px';
    });
}

const getParamFromURL = ()=>{
    //const regex = /=(.*?)\?/g;
    //const stateData = urlParams.get('serviceId');
    /*const href = window.location.href;
    const regex = /=(.*?)\&/g;
    let matches = href.match(regex);*/
    const searchParams = new URLSearchParams(window.location.search);
    let paramNames = ['serviceId','language','admin'];
    //const paramState = searchParams.get(paramName);
    const res = [];
    paramNames.forEach((name)=>{
        res.push(searchParams.get(name));
    })
   /* matches.forEach((match)=>{
        res.push(match.replace("?", "").replace("=",""));
    });*/
    return res;
}

const updateMarginButtonsOnList = (list)=>{
    const cards = list.children;
    for (var i = 0; i< cards.length; i++){
        updateMargin(cards[i], cards[i].querySelector(".extended-container"));
    }
}

const updateMargin = (card, container) => {
    if (container){
        if (card.offsetWidth !== 0) {
            const deleteButton = container.querySelector(".delete-button");
            const editButton = container.querySelector(".edit-button");
            const width = (card.offsetWidth - deleteButton.offsetWidth);
            const leftMargin = width/28
            deleteButton.style.marginLeft = `calc(${width - leftMargin}px)`;
            editButton.style.marginLeft = `calc(${leftMargin}px)`;
        }
    }
};

const getCurState = ()=>{
    var urlParams = window.location.search;
    return (urlParams.match('serviceId'))? 'info-cards' : (urlParams.match('catalog')) ? 'services-list' :  'catalogs-list';
}

export {/*createCatalog, createService, createInfo, getAllServices,*/
     getCellById, getCatalogId, getCellNameById,
    equalizeSubtitles, getParamFromURL, equalizeIconContainers, getCatalogsId,
    updateMargin, updateMarginButtonsOnList, getCurState};
