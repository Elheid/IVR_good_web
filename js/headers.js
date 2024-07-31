import { findSubCatalogByValue, getCellNameById, getLastSubCatalog, removeLastQueryParam } from "./util.js";

const searchHeader = "Результаты поиска";


document.addEventListener(("DOMContentLoaded"), ()=>{
    /*onst subCatalogHref = localStorage.getItem("subCatalogHref");
    const curId = new URLSearchParams(window.location.search).get("catalog");
    const id = new URLSearchParams(subCatalogHref).get("catalog");
    if (id !== curId){
        addHeader(id);
    }*/
        const curId = new URLSearchParams(window.location.search).get("catalog");
        if(curId){
            const name = getCellNameById(curId);
            if (!hasSimilar() && name !== ""){
                addHeader(curId);
            }
        }
})
document.addEventListener(("goBackEvent"), ()=>{
    /*onst subCatalogHref = localStorage.getItem("subCatalogHref");
    const curId = new URLSearchParams(window.location.search).get("catalog");
    const id = new URLSearchParams(subCatalogHref).get("catalog");
    if (id !== curId){
        addHeader(id);
    }*/
    const curId = new URLSearchParams(window.location.search).get("catalog");
    if(curId){
        if (!hasSimilar(getCellNameById(curId))){
            addHeader(curId);
        }
    }
})


const showArrows = ()=>{
    const listChildren = document.querySelector(".header-list");
    const prevHeader = listChildren.lastElementChild;
    const hiddenEl = prevHeader.querySelector(".hidden");
    hiddenEl.classList.remove("hidden");
}

const hideArrows = ()=>{
    const list = document.querySelector(".header-list");
    const prevHeader = list.lastElementChild;
    const hiddenEl = prevHeader.querySelector(".arrow");
    hiddenEl.classList.add("hidden");
}
const updateParamUrl = (paramName)=>{
    const searchParams = new URLSearchParams(window.location.search);
    const paramState = searchParams.get(paramName);
    
    const search = new URLSearchParams(window.location.search)
    if (window.location.search.includes(paramName)) {
        search.delete(paramName);
        //console.log(`Параметр '${paramName}' уже существует в пути.`);
        return  window.location.pathname +"?" +search.toString();
    }

}

const addSubHeader = (prevHeadId = null)=>{
    const curURL = window.location.href;
    const list = document.querySelector(".header-list");
    const listChildren = list.children;


    const newHeaderTemp = document.querySelector('#header').content.querySelector('li');
    
    const newHeader = document.importNode(newHeaderTemp, true);
    if (prevHeadId){
        const newParam = removeLastQueryParam();
        newHeader.querySelector("a").href = newParam;
    }
    else{
        newHeader.querySelector("a").href = curURL;
    }
    
    const arrow = document.createElement("img");
    arrow.classList.add("arrow");
    arrow.classList.add("hidden");
    arrow.src = "/img/breadMini3.svg"


    var urlParams = window.location.search;
    /*const state = "catalog=";
    const index = urlParams.indexOf(state)+state.length;*/
    let catalogId = new URLSearchParams(urlParams).get('catalog');
    if (!catalogId){
        catalogId = getLastSubCatalog();
    }
    let nameBread;
    if(prevHeadId){
        nameBread = getCellNameById(prevHeadId);
    }
    else{
        nameBread = getCellNameById(catalogId);
    }

    if (hasSimilar(nameBread)){
        return
    }

    const prevHeader = listChildren[listChildren.length-1];
    showArrows();

    newHeader.querySelector("a").textContent = nameBread;

    prevHeader.classList.replace("current-page", "prev-page");
    newHeader.appendChild(arrow);
    list.appendChild(newHeader);
}


let prevFontSizes = [];
let iteration = 0;

const removeFontSize = ()=>{
    const breadcrumbs = document.querySelectorAll('.breadcrumb-item');
    let filteredObjects = 0;
    if (prevFontSizes.length > 0){
        const targetIteration = iteration - 1 < 0 ? 0: iteration - 1;
        filteredObjects = prevFontSizes.filter(obj => obj.iteration === targetIteration);
        filteredObjects.shift();
        prevFontSizes = prevFontSizes.filter(obj => obj.iteration !== targetIteration);
    }
    breadcrumbs.forEach(breadcrumb => {
        const text = breadcrumb.querySelector("a");
        if(filteredObjects !== 0){
            const shift = filteredObjects.shift();
            text.style.fontSize = shift.size + "px";
        }
        else{
            text.style.fontSize = "";
        }
    });
    iteration--;
}

const adjustBreadcrumbFontSize = ()=> {
    const breadcrumbs = document.querySelectorAll('.breadcrumb-item');
    const totalWidth = document.querySelector('.header-list').offsetWidth;
    let availableWidth = totalWidth;


    breadcrumbs.forEach(breadcrumb => {
        availableWidth -= breadcrumb.offsetWidth;
    });

    const viewportWidth = window.innerWidth;

    // Рассчитываем размер шрифта в пикселях для 1.2vw
    const fontSizeInVW = 1.2;
    const fontSizeInPixels = (fontSizeInVW / 100) * viewportWidth;


    const fontSizeEm =  fontSizeInPixels;//16; // Assuming base font size is 16px
    const minFontSizeEm = 10; // Minimum font size in em

    const maxFontSizePrev = 20;
    const maxFontSizeCurr = 32;
    let resSize;
    //if (availableWidth < 0) {
        resSize = Math.max(minFontSizeEm, fontSizeEm + availableWidth / breadcrumbs.length);
    //}
    breadcrumbs.forEach(breadcrumb => {
        const text = breadcrumb.querySelector("a");
        if (breadcrumb.classList.contains("current-page")){
            let size = text.style.fontSize;
            if (size === ""){
                size = "32";
            }
            const curFont = parseInt(size.match(/\d+/));
            if (resSize > maxFontSizeCurr || curFont <= maxFontSizeCurr){
                resSize = maxFontSizeCurr;
            }
        }
        else{
            if (resSize > maxFontSizePrev){
                resSize =  maxFontSizePrev;
            }
        }
        //if (curFontSize !== ""){
            //const curFontSize = text.style.fontSize;
            //const curFontNumber = parseInt(resSize.match(/\d+/));1
            const resBread = {type:breadcrumb.classList.contains("current-page"), size:resSize, iteration:iteration}
            prevFontSizes.push(resBread);
        //}
        
        text.style.fontSize = resSize + 'px';
    });
    iteration++;
}


const addHeader = (prevHeadId = null)=>{
    const curURL = window.location.href;
    const list = document.querySelector(".header-list");
    const listChildren = list.children;


    const newHeaderTemp = document.querySelector('#header').content.querySelector('li');
    
    const newHeader = document.importNode(newHeaderTemp, true);
    newHeader.querySelector("a").href = curURL;
    
    const arrow = document.createElement("img");
    arrow.classList.add("arrow");
    arrow.classList.add("hidden");
    arrow.src = "/img/breadMini3.svg"


    var urlParams = window.location.search;
    /*const state = "catalog=";
    const index = urlParams.indexOf(state)+state.length;*/
    let catalogId = new URLSearchParams(urlParams).get('catalog');
    if (!catalogId){
        catalogId = getLastSubCatalog();
    }
    let nameBread;
    if(prevHeadId){
        nameBread = getCellNameById(prevHeadId);
    }
    else{
        nameBread = getCellNameById(catalogId);
    }

    if (hasSimilar(nameBread)){
        return
    }

    const prevHeader = listChildren[listChildren.length-1];
    showArrows();

    newHeader.querySelector("a").textContent = nameBread;

    prevHeader.classList.replace("current-page", "prev-page");
    newHeader.appendChild(arrow);

    list.appendChild(newHeader);

    adjustBreadcrumbFontSize();
}

const hasSimilar = (title)=>{
    const list = document.querySelector(".header-list").children;
    for (var i = 0; i< list.length; i++){
        const crunch = list[i].querySelector("a").textContent;
        if (crunch === title){
            return true;
        }
    }
    return false;
}



const addHeaderForSearch = ()=>{
    const curURL = window.location.href;
    const list = document.querySelector(".header-list");
    const listChildren = list.children;

    const newHeaderTemp = document.querySelector('#header').content.querySelector('li');
    const newHeader = document.importNode(newHeaderTemp, true);

    showArrows();

    newHeader.querySelector("a").href = curURL;

    newHeader.querySelector("a").textContent = searchHeader;
    listChildren[listChildren.length-1].classList.replace("current-page", "prev-page");

    list.appendChild(newHeader);

    adjustBreadcrumbFontSize();
} 

const getLastHeader = ()=>{
    const list = document.querySelector(".header-list");
    const items = list.querySelectorAll("li");
    const lastItem = items[items.length - 1];
    return lastItem;
}

const removeSearchHeader = ()=>{
    let lastHeader = getLastHeader().innerText;
    const mainHeader = document.querySelector(".header-list").children[1].innerText;
    if (lastHeader === searchHeader){
        removeLastHeader();
    }
    
    /*while (lastHeader !== mainHeader){
        lastHeader = getLastHeader().innerText;
        if (lastHeader === searchHeader){
            removeLastHeader();
        }
        lastHeader = getLastHeader().innerText;
        if(lastHeader !== mainHeader){
            removeLastHeader();
        }
    }*/
   //removeFontSize();
}
const removeLastHeader = ()=>{

    const list = document.querySelector(".header-list");

    let lastHeader = getLastHeader().innerText;
    const mainHeader = document.querySelector(".header-list").children[1].innerText;
    if(lastHeader !== mainHeader){
    list.removeChild(getLastHeader());
    const prevHeader = list.children[list.children.length-1];
    hideArrows();
    prevHeader.classList.replace("prev-page", "current-page");
    }
    //adjustBreadcrumbFontSize();
    removeFontSize();
}

const changeButtonsArea = ()=>{
    if(document.querySelector(".catalogs").classList.contains("clear-language")){
        //document.querySelector(".view-buttons").classList.add("hidden");
        document.querySelector(".buttons-area").style = "justify-content: center;"
    }
}
const changeHeaderBorderRadius = ()=>{
    const body = document.querySelector("body");
    const header =  document.querySelector(".header-list");
    if (header){
        if (body.offsetWidth === header.offsetWidth){
            header.style = "border-radius:0px;";
        }
        else{
            header.style = "border-radius:30px;";
            //document.querySelector(".view-buttons").classList.remove("hidden");
            //document.querySelector(".buttons-area").style = "justify-content: center;"
        }
    }
}

var urlParams = window.location.href;
    if (urlParams.match('services') || urlParams.match('result')){
        if (!urlParams.match('result')){
            document.addEventListener('DOMContentLoaded',changeButtonsArea);  
        }
        window.addEventListener('resize', changeHeaderBorderRadius);
        document.addEventListener('DOMContentLoaded',changeHeaderBorderRadius); 
    }
    
export {addHeader, removeLastHeader, addHeaderForSearch, removeSearchHeader, addSubHeader}