import {initializeResults, addCatalogButton} from '../renderCatalogs.js';
import { loadSavedData } from './main.js';
import { createBackButton } from '../backButton.js';
import { addWebcamPopupClose, addWebcamPopupShow } from '../popup/popupWebcam.js';
import { getCategories } from '../api/api.js';
import { addSearchButton, searchResult } from '../search/search.js';
import { addPlayVidButton } from '../vidPlayButton.js';
import { createGoButtons } from './createrObj.js';
import { addSkeletons, updateSkeletonElementCount } from '../skeletons/skeleton.js';


addSkeletons("catalogs");

createBackButton();


var flag = loadSavedData();
document.querySelector(".catalogs").classList.add(flag);
document.querySelector(".services").classList.add(flag);
if (document.querySelector(".catalogs").classList.contains("gestural-language")){
  document.querySelector(".view-choose").style.marginTop = "6%";
}


const loadCategories = async () => {
    await getCategories()
      .then((data) => {
        updateSkeletonElementCount(data.content.length);
        initializeResults(data);
        addCatalogButton(searchResult);
        addPlayVidButton();
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

addWebcamPopupClose();
addWebcamPopupShow();


createGoButtons();
