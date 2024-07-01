import { removeLastHeader} from "./headers.js";
import { getCatalogId } from "./util.js";

const goBackToCatalogs = ()=>{
    const list = document.querySelector('.catalogs-list');
    const services = document.querySelector('.services-list');
    list.classList.remove("hidden");
    services.innerHTML = "";
    removeLastHeader();
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


const createBackButton = (displayServices)=>{
    backButton.addEventListener('click', ()=> {
        if (!window.location.href.includes("services")){
            history.back();
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
                    }
                else{
                    window.location.href = "instruction.html";
                }
            } else {
                if (!notQuery && !notCatalogs){
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
                }
                else{
                    document.querySelector('.search-input').value = "";
                    goBackToCatalogs();
                    history.replaceState({}, '', window.location.pathname);
                    //history.back();
                    //hideAlerts();
                }
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