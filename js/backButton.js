import { goBackToCatalogs} from "./renderIcons.js";
//import { hideAlerts } from "./search.js";
//import { removeLastHeader } from "./catalog.js";


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