import {initializeResults} from './renderIcons.js';
import { loadSavedData } from './main.js';
import { addCatalogButton } from './catalog.js';
import { createBackButton } from './backButton.js';

createBackButton();
var flag = loadSavedData();
var catalogs = document.querySelector(".catalogs").classList.add(flag);
var services = document.querySelector(".services").classList.add(flag);
initializeResults(5);
addCatalogButton();