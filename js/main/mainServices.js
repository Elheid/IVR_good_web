import {initializeResults} from '../renderIcons.js';
import { loadSavedData } from './main.js';
import { addCatalogButton } from '../catalog.js';
import { createBackButton } from '../backButton.js';
import { addWebcamPopupClose, addWebcamPopupShow } from '../popup.js';
import { getCategories } from '../api.js';
import { addSearchButton, searchResult } from '../search.js';
import { addPlayVidButton } from '../video.js';
import { createGoButtons } from './createrObj.js';



createBackButton();

var flag = loadSavedData();
document.querySelector(".catalogs").classList.add(flag);
document.querySelector(".services").classList.add(flag);


const loadCategories = async () => {
    await getCategories()
      .then((data) => {
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
