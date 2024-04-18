import { openCatalogs, clearServices } from "./renderIcons.js";
import { removeLastHeader } from "./catalog.js";
const backButton = document.querySelector(".return-button");


const createBackButton = ()=>{
    backButton.addEventListener('click', ()=> {
        if (!window.location.href.includes("services")){
            history.back();
        }
        else{
            if (!window.location.href.includes("?catalog=")) {
                window.location.href = "instruction.html";
            } else {
                openCatalogs();
                clearServices();
                removeLastHeader();
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