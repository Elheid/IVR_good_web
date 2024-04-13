//пока тупо работает, нужно переделать
import { openCatalogs, clearServices } from "./renderIcons.js";
const backButton = document.querySelector(".return-button");


const createBackButton = ()=>{
    backButton.addEventListener('click', ()=> {
        if (!window.location.href.includes("?catalog=")) {
            window.location.href = "index.html";
          } else {
            openCatalogs();
            clearServices();
            history.replaceState({}, '', window.location.pathname);
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