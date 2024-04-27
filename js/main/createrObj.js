// это должно быть временная штука ддля проверки идеи

const createRes = (result)=>{
    const template = document.querySelector('#result').content;
    const res = document.importNode(template, true);
    const gif = res.querySelector("img");
    const text = res.querySelector(".manual-text");
    const cardTitle = res.querySelector(".card-title");
    cardTitle.textContent = result.title; 
    gif.src = "img/gastrual2.jpg";
    text.textContent = result.description;

    const popup = document.getElementById("popup");
    if (result.additionIds !== null)
    {
        popup.setAttribute("addition-info-id", result.additionIds);

    }
    else
        popup.setAttribute("addition-info-id", null);
    return res;
}

const infoRes = (info)=>{
    const template = document.querySelector('#result').content;
    const res = document.importNode(template, true);
    const gif = res.querySelector("img");
    const text = res.querySelector(".manual-text");
    const cardTitle = res.querySelector(".card-title");
    const button = res.querySelector("button");
    button.innerHTML = "";
    cardTitle.textContent = info.title; 
    gif.src = info.gifLink;
    text.textContent = info.description;
    return res;
}


const createCatalogCard = (catalog, clearLanguage)=>{
    const catalogTemplate = document.querySelector('#catalog-template').content.querySelector('li');
    const cardCatalog = document.importNode(catalogTemplate, true);
    const cardTitle = cardCatalog.querySelector('.card-title');
    const imgOrGif = cardCatalog.querySelector('.catalog-gif');

    if (!(clearLanguage)){
        imgOrGif.src = catalog.gifLink;
    }
    else{
        imgOrGif.src = "img/clear.jpg";
    }

    cardTitle.textContent = catalog.title;
    cardCatalog.setAttribute("catalog-id", catalog.id);
    return cardCatalog;
};


const createServiceCard = (service, clearLanguage)=>{
    const serviceTemplate = document.querySelector('#service-template').content.querySelector('li');
    const cardCatalog = document.importNode(serviceTemplate, true);
    const cardTitle = cardCatalog.querySelector('.card-description');
    const imgOrGif = cardCatalog.querySelector('.service-gif');

    if (!(clearLanguage)){
        imgOrGif.src = service.gifLink;
    }
    else{
        imgOrGif.src = "img/clear.jpg";
    }

    cardTitle.textContent = service.title;
    cardCatalog.setAttribute("service-id", service.id);


    const nextButton = cardCatalog.querySelector(".service-button");

    nextButton.addEventListener("click", (evt)=>{
    //const serviceName = evt.target.parentNode.querySelector(".card-description").textContent;
    const serviceId = evt.target.parentNode.parentNode.getAttribute("service-id");
    window.location.href = `result.html?serviceId=${encodeURIComponent(serviceId)}`;
    })
    return cardCatalog;
};

const createInfoCard = (info)=>{
    const infoTemplate = document.querySelector('#additional-info').content.querySelector('li');

    const infoCard = document.importNode(infoTemplate, true);
    const cardTitle = infoCard.querySelector('.card-description');
    const imgOrGif = infoCard.querySelector('.info-gif');


    imgOrGif.src = info.gifLink;
    cardTitle.textContent = info.title;
    infoCard.setAttribute("info-id", info.id);
    return infoCard;
};


const createGoButtons = ()=>{
    const listOfCards = document.querySelectorAll(".list-of-cards");

    const twoInRow = document.querySelector(".two-in-row");
    const oneInRow = document.querySelector(".one-in-row");
    
    oneInRow.addEventListener("click", ()=>{
        listOfCards.forEach((card)=> card.classList.add("list"));
    })
    twoInRow.addEventListener("click", ()=>{
        listOfCards.forEach((card)=> card.classList.remove("list"));
    })
}



export {createRes, createGoButtons, createServiceCard, createCatalogCard, createInfoCard, infoRes}