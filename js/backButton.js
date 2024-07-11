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
            var breadcrumbs = document.querySelectorAll('.breadcrumb-item a');
            if (breadcrumbs.length > 0) {
                var lastBreadcrumb = breadcrumbs[breadcrumbs.length - 1];
                window.location.href = lastBreadcrumb.href;
            } else {
                history.back();
            }
            //history.back();
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
                    
                    const searchParams = new URLSearchParams(window.location.search);
                    let paramName = 'admin';
                    const paramState = searchParams.get(paramName);
                    

                    // Проверка, содержит ли путь параметр
                    if (window.location.pathname.includes(paramName)) {
                        console.log(`Параметр '${paramName}' уже существует в пути.`);
                        history.replaceState({}, '', window.location.pathname);
                    } else {
                        console.log(`Параметр '${paramName}' не существует в пути.`);
                        history.replaceState({}, '', window.location.pathname + `?${paramName}=${paramState}`);
                        // Вы можете добавить ваш параметр здесь
                    }
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