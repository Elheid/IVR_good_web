import {initializeResults, addCatalogButton} from '../renderCatalogs.js';
import { loadSavedData } from './main.js';
import { createBackButton } from '../backButton.js';
import { addWebcamPopupClose, addWebcamPopupShow } from '../popup/popupWebcam.js';
import { getCategories } from '../api/api.js';
import { addSearchButton, addSearchEnter, searchResult } from '../search/search.js';
import { addPlayVidButton } from '../vidPlayButton.js';
import { createGoButtons } from './createrObj.js';
import { addSkeletons, updateSkeletonElementCount } from '../skeletons/skeleton.js';
//import { equalizeIconContainers } from '../util.js';
import { createHomeReturner } from '../returnHome.js';

import { addAdminPanel, addAdminButtonsToCards, adminUpdate } from '../adminPanel.js';

import { loadServices } from '../services.js';


import { addAuth } from '../auth.js';
import { config } from '../../config.js';


addSkeletons("catalogs");

createBackButton(loadServices);


var flag = loadSavedData();
document.querySelector(".catalogs").classList.add(flag);
document.querySelector(".services").classList.add(flag);
if (document.querySelector(".catalogs").classList.contains("gestural-language")){
  document.querySelector(".view-choose").style.marginTop = "6%";
}


if (config.adminPanelOn){
  addAdminPanel();
}


document.querySelector(".services-list").classList.add("hidden");
const loadCategories = async () => {
    await getCategories()
      .then((data) => {
        updateSkeletonElementCount(data.content.length);
        initializeResults(data);
        addCatalogButton(searchResult);
        addPlayVidButton();
        adminUpdate();
        /*if (localStorage.getItem("isAdmin") === "true"){
          addAdminButtonsToCards();
        }*/
      })
      .catch((err)=> console.log(err));
};
loadCategories();




const hideArrows = ()=>{
  const screenWidth = window.innerWidth;
  if (screenWidth < 768){
      const arrows = document.querySelectorAll(".arrow");
      arrows.forEach((arrow)=>{ arrow.classList.add("opacity")});
  }
}
hideArrows();

addSearchButton(document.querySelector('.search-button'));
addSearchEnter();

addWebcamPopupClose();
addWebcamPopupShow();


createGoButtons();

createHomeReturner();

addAuth();

const switchLanguage = document.querySelector(".switch-language");
switchLanguage.addEventListener("click", ()=>{
  const allLists = document.querySelectorAll(`.${flag}:not(.skeleton)`);
  if (flag === "clear-language"){
    localStorage.setItem("language", "gestural-language");
    allLists.forEach((list)=>{
      list.classList.replace(flag, "gestural-language")
    })
  }
  if (flag === "gestural-language"){
    localStorage.setItem("language", "clear-language");
    allLists.forEach((list)=>{
      list.classList.replace(flag, "clear-language")
    })
  }
  window.location.reload();
})