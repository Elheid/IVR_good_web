import { createBackButton } from '../backButton.js';
import { showRes } from '../createResult.js';
import { addInfoPopupShow, addInfoPopupClose } from '../additionalInfo.js';

import { getServiceById } from '../api.js';

const text = "Manual на ясном языке \nЧтобы получить загран паспорт, нужно ..."
const gif = "img/gastrual2.jpg";
const urlParams = new URLSearchParams(window.location.search);

const stateData = urlParams.get('serviceId');

const obj = {
    title: stateData,
    url: gif,
    manualText:text
}

const loadResult = ()=>
    getServiceById(urlParams.get('serviceId'))
        .then((data) => {
            showRes(data);
            addInfoPopupShow();
            addInfoPopupClose();
        })
        .catch((err)=> console.log(err)
);

loadResult();


createBackButton();