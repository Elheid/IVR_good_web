import {initializeResults} from '../renderIcons.js';
import { loadSavedData } from './main.js';
import { addCatalogButton } from '../catalog.js';
import { createBackButton } from '../backButton.js';

createBackButton();
var flag = loadSavedData();
var catalogs = document.querySelector(".catalogs").classList.add(flag);
var services = document.querySelector(".services").classList.add(flag);

const listOfCards = document.querySelectorAll(".list-of-cards");

const twoInRow = document.querySelector(".two-in-row");
const oneInRow = document.querySelector(".one-in-row");

oneInRow.addEventListener("click", ()=>{
    listOfCards.forEach((card)=> card.classList.add("list"));
})
twoInRow.addEventListener("click", ()=>{
    listOfCards.forEach((card)=> card.classList.remove("list"));
})

initializeResults(4);
addCatalogButton();
