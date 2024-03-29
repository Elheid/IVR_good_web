import {initializeResults} from './renderIcons.js';
import { loadSavedData } from './main.js';

var flag = loadSavedData();
var services = document.querySelector(".services").classList.add(flag);
initializeResults(5);