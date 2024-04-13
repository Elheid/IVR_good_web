
const createRes = ({title, url, manualText})=>{
    const template = document.querySelector('#result').content;
    const res = document.importNode(template, true);
    const gif = res.querySelector("img");
    const text = res.querySelector(".manual-text");
    const cardTitle = res.querySelector(".card-title");
    cardTitle.textContent = title; 
    gif.src = url;
    text.textContent = manualText;
    return res;
}

const showRes = (obj)=>{
    const list = document.querySelector(".manual-strp");
    list.appendChild(createRes(obj));
}

export {showRes}