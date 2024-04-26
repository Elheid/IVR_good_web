import {initializeResults} from '../renderIcons.js';
import { loadSavedData } from './main.js';
import { addCatalogButton } from '../catalog.js';
import { createBackButton } from '../backButton.js';
import { addWebcamPopupClose, addWebcamPopupShow } from '../popup.js';

import { getCategories } from '../api.js';

createBackButton();
var flag = loadSavedData();
var catalogs = document.querySelector(".catalogs").classList.add(flag);
var services = document.querySelector(".services").classList.add(flag);



console.log(getCategories());

const loadCategories = async () => {
    await getCategories()
      .then((data) => {
        initializeResults(data);
        addCatalogButton();
      })
      .catch((err)=> console.log(err));
};
loadCategories();




addWebcamPopupClose();
addWebcamPopupShow();


