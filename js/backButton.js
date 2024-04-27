import { goBackToCatalogs} from "./renderIcons.js";

//import { removeLastHeader } from "./catalog.js";


const backButton = document.querySelector(".return-button");


const createBackButton = ()=>{
    backButton.addEventListener('click', ()=> {
        if (!window.location.href.includes("services")){
            history.back();
            //showServices();
        }
        else{
            if (!window.location.href.includes("?catalog=")) {
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