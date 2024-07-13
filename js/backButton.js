import { removeLastHeader,addHeader} from "./headers.js";
import { countSubCatalogs, getCatalogId, getLastSubCatalog, getLastSubCatalogName, getPreSubCatalog, updateMarginButtonsOnList } from "./util.js";

const goBackToCatalogs = ()=>{

    const searchParams = new URLSearchParams(window.location.search);

    // Обновляем или добавляем параметр admin

    const subCatalogHref = localStorage.getItem("subCatalogHref");
    //localStorage.removeItem("subCatalogHref");
    //window.location.search = subCatalogHref;

    const curId = new URLSearchParams(window.location.search).get("catalog");

    const subCatalogs = document.querySelectorAll('.sub-catalogs');
    let idCatalog = new URLSearchParams(window.location.search).get("catalog");
    let idSubCatalog = getLastSubCatalog();

    //const subCatalog = searchParams.get('sub-catalog');
    const notQuery = !window.location.href.includes("query=");
    if (!notQuery){
        const list = document.querySelector('.catalogs-list');
        const services = document.querySelector('.services-list');
        list.classList.remove("hidden");
        services.innerHTML = "";
        const subCatalogs = document.querySelectorAll('.sub-catalogs');
        subCatalogs.forEach((catalog)=>catalog.querySelector("ul").classList.add("hidden"))
        removeLastHeader();
        updateMarginButtonsOnList(list);

        updateParamUrl('catalog');

    }
    else if (idCatalog !== "" && idCatalog && idSubCatalog !== '' && idSubCatalog){
        const matchingElement = Array.from(subCatalogs).find(element =>element.getAttribute("parent-id") === idSubCatalog);
        const listSubCategory = matchingElement.querySelector(".sub-catalogs-list")
        listSubCategory.classList.remove("hidden");
        const services = document.querySelector('.services-list');
        services.innerHTML = "";
        removeLastHeader();
        const newSearch = new URLSearchParams(window.location.search);
        newSearch.delete("catalog");
        history.replaceState({}, '', window.location.pathname +"?"+ newSearch.toString());
        addHeader()
    }
    else if(idSubCatalog !== '' && idSubCatalog && countSubCatalogs() > 1){

        const preLastSub = getPreSubCatalog();
        const subCatalogs = document.querySelectorAll('.sub-catalogs');
        const matchingElement = Array.from(subCatalogs).find(element =>element.getAttribute("parent-id") === preLastSub);

        subCatalogs.forEach((catalog)=>catalog.querySelector("ul").classList.add("hidden"))
        const listSubCategory = matchingElement.querySelector(".sub-catalogs-list")
        listSubCategory.classList.remove("hidden");

        removeLastHeader();
        updateMarginButtonsOnList(listSubCategory);

        //console.log(getLastSubCatalogName())
        //history.back();

        updateParamUrl(getLastSubCatalogName())
        
    }
    else if(idSubCatalog !== '' && idSubCatalog){
        const list = document.querySelector('.catalogs-list');
        const services = document.querySelector('.services-list');
        list.classList.remove("hidden");
        services.innerHTML = "";
        const subCatalogs = document.querySelectorAll('.sub-catalogs');
        subCatalogs.forEach((catalog)=>catalog.querySelector("ul").classList.add("hidden"))
        removeLastHeader();
        updateMarginButtonsOnList(list);


        updateParamUrl("sub-catalog");
        
    }
    else{
        const list = document.querySelector('.catalogs-list');
        const services = document.querySelector('.services-list');
        list.classList.remove("hidden");
        services.innerHTML = "";
        const subCatalogs = document.querySelectorAll('.sub-catalogs');
        subCatalogs.forEach((catalog)=>catalog.querySelector("ul").classList.add("hidden"))
        removeLastHeader();
        updateMarginButtonsOnList(list);
        //updateParamUrl('catalog');
    }
}

const goBackToServices = ()=>{
    //const list = document.querySelector('.catalogs-list');
    const services = document.querySelector('.services-list');
    const listArray = Array.from(services.children);

    // Фильтруем элементы без класса hidden и удаляем их
    /*listArray.filter(item => {
        if(!item.classList.contains('hidden')){
            //item = 0;
            item.remove()
            listArray.splice(listArray.indexOf(item), 1); 
        }
    });
    
    // Для оставшихся элементов убираем класс hidden
    listArray.forEach(item => {
        if (item.classList.contains('hidden')) {
            item.classList.remove('hidden');
        }
    });*/
    listArray.forEach(item => {
        if (!item.classList.contains('hidden')) {
            // Удаляем элементы без класса hidden
            item.remove();
        } else {
            // Убираем класс hidden у оставшихся элементов
            item.classList.remove('hidden');
        }
    });
    /*for(var i = 0; i < listArray.length; i++){
        services.appendChild(listArray[i]);
    }*/
    
    /*for (var i = 0; i < services.children.length; i++){
        const service = services.children[i];
        if (!service.classList.contains("hidden")){
            service.remove();
        }
        else{
            service.classList.remove("hidden");
        }
    }*/
    //list.classList.remove("hidden");
    removeLastHeader();
}

const backButton = document.querySelector(".return-button");


const updateParamUrl = (paramName)=>{
    const searchParams = new URLSearchParams(window.location.search);
    //let paramName = 'catalog';
    const paramState = searchParams.get(paramName);
    
    const search = new URLSearchParams(window.location.search)
    // Проверка, содержит ли путь параметр
    if (window.location.search.includes(paramName)) {
        search.delete(paramName);
        //console.log(`Параметр '${paramName}' уже существует в пути.`);
        history.replaceState({}, '', window.location.pathname +"?" +search.toString());
    } else {
        //console.log(`Параметр '${paramName}' не существует в пути.`);
        history.replaceState({}, '', window.location.pathname);
        // Вы можете добавить ваш параметр здесь
    } 
}
const backEvent = new CustomEvent('goBackEvent', { });
/*window.addEventListener('DOMContentLoaded', () => {
    // Шаг 5: Проверяем, нужно ли диспатчить событие
    const shouldDispatchEvent = localStorage.getItem('dispatchGoBackEvent');
    if (shouldDispatchEvent) {
      // Шаг 6: Удаляем флаг из localStorage
      localStorage.removeItem('dispatchGoBackEvent');
      
      // Шаг 7: Диспатчим событие

      document.dispatchEvent(backEvent);
    }
  });*/
const createBackButton = (displayServices)=>{
    backButton.addEventListener('click', ()=> {
        if (!window.location.href.includes("services")){
            /*const preRes = localStorage.getItem("pre-res-search");
            if (preRes){
                window.location.href = "services.html" + preRes;
            }
            else{
                history.back();
            }*/
           //localStorage.setItem('dispatchGoBackEvent', 'true');
            //history.back();
            
            var breadcrumbs = document.querySelectorAll('.breadcrumb-item a');
            if (breadcrumbs.length > 0) {
                var lastBreadcrumb = breadcrumbs[breadcrumbs.length - 1];
                window.location.href = lastBreadcrumb.href;
            } else {
                history.back();
            }
            
            //hideAlerts();
            //showServices();
        }
        else{
            const notCatalogs = !window.location.href.includes("catalog=");
            const notQuery = !window.location.href.includes("query=");
            if (notCatalogs && notQuery) {
                const catalogs = document.querySelector(".catalogs");
                if (catalogs.classList.contains("clear-language"))
                    {
                        window.location.href = "index.html";
                        setTimeout(() => {
                          document.dispatchEvent(backEvent);
                        }, 0);
                    }
                else{
                    window.location.href = "instruction.html";
                    setTimeout(() => {
                        document.dispatchEvent(backEvent);
                      }, 0);
                }
            } else {
               /* if (!notQuery && !notCatalogs){
                    goBackToServices();
                    history.back();
                    const urlParams = window.location.search;
                    const searchParams  = new URLSearchParams(urlParams)
                    if (searchParams.get("query")) {
                        // Удаляем параметр
                        searchParams.delete("query");
                    }
                    const newParams = searchParams.toString();
                    const newUrl = `${window.location.pathname}${newParams ? '?' + newParams : ''}`;
                    window.location.search = newParams; 
                    if(document.querySelector('.services-list').children.length === 0){
                        //displayServices(getCatalogId());
                    }
                    //location.reload()
                }*/
                //else{
                    document.querySelector('.search-input').value = "";
                    goBackToCatalogs();
                    setTimeout(() => {
                        document.dispatchEvent(backEvent);
                      }, 0);
                    
                    //history.back();
                    //hideAlerts();
                //}
            }
        }

    });
    /*window.addEventListener('popstate', (event)=> {
        if (event.state && event.state.catalogId) {
            openCatalogs();
            clearServices();
            history.replaceState({}, '', window.location.pathname);
        }
    });*/
};

export {createBackButton};