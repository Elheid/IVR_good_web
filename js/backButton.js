import { removeLastHeader} from "./headers.js";

const goBackToCatalogs = ()=>{
    const list = document.querySelector('.catalogs-list');
    const services = document.querySelector('.services-list');
    list.classList.remove("hidden");
    services.innerHTML = "";
    removeLastHeader();
}

const backButton = document.querySelector(".return-button");


const createBackButton = ()=>{
    backButton.addEventListener('click', ()=> {
        if (!window.location.href.includes("services")){
            history.back();
            //hideAlerts();
            //showServices();
        }
        else{
            if (!window.location.href.includes("?catalog=") && !window.location.href.includes("?query=")) {
                const catalogs = document.querySelector(".catalogs");
                if (catalogs.classList.contains("clear-language"))
                    {
                        window.location.href = "index.html";
                    }
                else{
                    window.location.href = "instruction.html";
                }
            } else {
                document.querySelector('.search-input').value = "";
                goBackToCatalogs();
                history.replaceState({}, '', window.location.pathname);
                //hideAlerts();
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