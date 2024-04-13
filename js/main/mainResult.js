import { createBackButton } from '../backButton.js';
import { showRes } from '../createResult.js';

const text = "Manual на ясном языке \nЧтобы получить загран паспорт, нужно ..."
const gif = "img/gastrual2.jpg";
const urlParams = new URLSearchParams(window.location.search);

var stateData = urlParams.get('serviceName');
const obj = {
    title: stateData,
    url: gif,
    manualText:text
}
showRes(obj);

createBackButton();
