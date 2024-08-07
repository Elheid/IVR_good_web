import { createBackButton } from '../backButton.js';
import { showRes } from '../createResult.js';
import { addInfoPopupShow, addInfoPopupClose, getIsClear } from '../additionalInfo.js';
import { getParamFromURL} from '../util.js';
import { getServiceById } from '../api/api.js';
import { createHomeReturner } from '../returnHome.js';
import { addSkeletonRes } from '../skeletons/skeletonResult.js';



addSkeletonRes();

/*const text = "Manual на ясном языке \nЧтобы получить загран паспорт, нужно ..."
const gif = "img/gastrual2.jpg";
const urlParams = new URLSearchParams(window.location.search);
*/


const res = getParamFromURL();
const id = res[0];
const isClear = res[1];


getIsClear(isClear)



const loadResult = ()=>
    getServiceById(id)
        .then((data) => {
            showRes(data, isClear);
            addInfoPopupShow();
            addInfoPopupClose();


        })
        .catch((err)=> console.log(err)
);

loadResult();

createBackButton();

createHomeReturner();