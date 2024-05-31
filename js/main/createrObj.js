// это должно быть временная штука ддля проверки идеи
import { getCellNameById, getParamFromURL } from "../util.js";

const iconInsertion = (textFromBd, iconLinks)=>{
    const iconRegex = /\\icon(\d+)/g;

    // Массив для сохранения найденных значений

    const replacedText =  textFromBd.replace(iconRegex, (match, p1) => {
    return `<img class="icons" src="${iconLinks[Number(p1)]}" alt="icon${p1}">`;
    });
    // Вставка результата в <pre> элемент
    return replacedText;
}



const createRes = (result, clear)=>{
    const template = document.querySelector('#result').content;
    const res = document.importNode(template, true);
    const gif = res.querySelector("video");
    if (clear !== "true"){
        gif.src = result.gifLink;//"img/gastrual2.jpg";
    }
    else{
        gif.classList.add("hidden");
    }
    const text = res.querySelector(".manual-text");
    const cardTitle = res.querySelector(".card-title");
    cardTitle.classList.remove("card-title");
    cardTitle.classList.add("res-title");
    cardTitle.textContent = result.title; 

    const textFromBd = result.description;

    text.innerHTML = iconInsertion(textFromBd, result.iconLinks);

    const popup = document.getElementById("popup");
    if (result.additionIds !== null)
    {
        popup.setAttribute("addition-info-id", result.additionIds);

    }
    else{
        popup.setAttribute("addition-info-id", null);
    }

    return res;
}

const infoRes = (info)=>{
    const template = document.querySelector('#result-info').content;
    const res = document.importNode(template, true);
    const gif = res.querySelector("video");
    gif.classList.add("result-info-gif");


    const text = res.querySelector(".manual-text");
    //text.classList.remove("manual-text");
    //text.classList.add("info-text");
    text.parentNode.classList.remove("manual");
    text.parentNode.classList.add("info-manual");
    //const cardTitle = res.querySelector(".card-title");
    const cardTitle = document.querySelector(".popup-title");
    /*const button = res.querySelector("button");
    button.innerHTML = "";*/
    cardTitle.textContent = info.title; 
    gif.src = info.gifLink;
    
    text.innerHTML = iconInsertion(info.description, info.iconLinks);;
    return res;
}

const createInfoCard = (info)=>{
    const infoTemplate = document.querySelector('#additional-info').content.querySelector('li');


    const infoCard = document.importNode(infoTemplate, true);
    const cardTitle = infoCard.querySelector('.card-description');

    //const imgOrGif = infoCard.querySelector('.info-gif');

    //imgOrGif.src = info.gifPreview;
    cardTitle.textContent = info.title;
    infoCard.setAttribute("info-id", info.id);
    return infoCard;
};


const createPlayButton = ()=>{
    var playButton = document.createElement('img');
    playButton.classList.add('play-button');
    playButton.src = 'img/play2.svg';
    return playButton;
}

const createVidContainer = ()=>{
    var videoOverlay = document.createElement('div');
    videoOverlay.classList.add('video-overlay');

    // Создаем img элемент для кнопки воспроизведения


    // Создаем video элемент
    var videoElement = document.createElement('video');
    videoElement.classList.add('gif');
    videoElement.src = ''; 

    // Добавляем атрибут playsinline
    videoElement.setAttribute('playsinline', true);
    videoElement.muted = true

    //videoOverlay.appendChild(createPlayButton());

    videoOverlay.appendChild(videoElement);
    return videoOverlay;
}

const createClarLangCard = (cardParent, title, count, iconGif)=>{

    cardParent.children[0].classList.add("clear-card");
    const card = cardParent.querySelector("button");
    /*var cardTitle = document.createElement('p');
    cardTitle.classList.add('title');
    cardTitle.trxtContent = title;*/

    //var iconContainer = document.createElement('div');
    //iconContainer.classList.add("icon-container");

    var icon = document.createElement('img');
    icon.classList.add("icon");


    /*const svgUrl = 'https://storage.yandexcloud.net/akhidov-ivr/icon2.svg';


        async function loadAndModifySVG(url) {
        try {
        // Загружаем SVG содержимое
        const response = await fetch(url);
        const svgText = await response.text();

        // Создаём временный элемент для парсинга SVG
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');

        // Изменяем все элементы с атрибутом fill
        const elements = svgDoc.querySelectorAll('[fill]');
        elements.forEach(el => {
        el.setAttribute('fill', '#ffffff');
        });

        // Получаем HTML контейнер и вставляем изменённый SVG
        icon.innerHTML = '';
        icon.appendChild(svgDoc.documentElement);
        } catch (error) {
        console.error('Ошибка при загрузке или изменении SVG:', error);
        }
    }
    loadAndModifySVG(svgUrl);*/


    icon.src = iconGif; 
    //iconContainer.appendChild(icon);
    //card.appendChild(iconContainer);

    const cardTitle = document.createElement('h3');
    cardTitle.classList.add("card-title");
    cardTitle.classList.add("card-description");
    cardTitle.textContent = title;


    var cardHeader = document.createElement('div');
    cardHeader.classList.add("card-header");

    card.appendChild(icon);

    var cardContent = document.createElement('div');
    cardContent.classList.add("card-header");
    cardContent.appendChild(cardTitle);



    var arrow = document.createElement('img');
    arrow.classList.add('arrow-img');
    arrow.src = "/img/arrow.svg"; 


    //cardFooter.appendChild(icon);
    //cardFooter.appendChild(arrow);

    //card.appendChild(cardTitle);

    var cardFooter = document.createElement('div');
    cardFooter.classList.add("card-footer");

    if(cardParent.classList.contains("catalog-card")){
        var countServices = document.createElement('p');
        countServices.classList.add('count-services');
        countServices.textContent = count + " услуг";
        cardFooter.appendChild(countServices);
    }

    cardFooter.appendChild(arrow);
    cardContent.appendChild(cardFooter)
    card.appendChild(cardContent);
    return cardParent;
}

const createSubstrate = ()=>{
   /* <div class="substrate">
    <h3 class="card-title card-description">Зашлушка</h3>
    <img src="/img/arrow-right.svg">
  </div>*/

  
    var container = document.createElement('div');
    container.classList.add('substrate');

    var title = document.createElement('h3');
    title.classList.add('card-title');
    title.classList.add('card-description');

    var arrow = document.createElement('img');
    arrow.src = "/img/arrow-right.svg"; 

    container.appendChild(title);
    container.appendChild(arrow);
    return container;
}

const createCatalogCard = (catalog, clearLanguage)=>{
    const catalogTemplate = document.querySelector('#catalog-template').content.querySelector('li');
    var cardCatalog = document.importNode(catalogTemplate, true);
    const cardButton = cardCatalog.querySelector(".card-button");
    
    //const imgOrGif = cardCatalog.querySelector('img.catalog-gif');

   
    if (!(clearLanguage)){
        //imgOrGif.classList.add("hidden");
        cardButton.appendChild(createVidContainer());
        cardButton.appendChild(createSubstrate());
       // cardCatalog.appendChild(createVidContainer());
        const vidOrGif = cardCatalog.querySelector('video.gif');
        const cardTitle = cardCatalog.querySelector('.card-description');
        vidOrGif.src = catalog.gifPreview;
        
        cardTitle.textContent = catalog.title;
    }
    else{
        
        if (catalog.mainIconLink.length != 0){
            var clearCard = createClarLangCard(cardCatalog, catalog.title, catalog.itemsInCategoryIds.length, catalog.mainIconLink);
            cardCatalog = (clearCard);
        }
        else{
            var clearCard = createClarLangCard(cardCatalog, catalog.title, catalog.itemsInCategoryIds.length);
            cardCatalog = (clearCard);
        }
        //cardTitle.textContent = catalog.title + " " + catalog.itemsInCategoryIds.length + " услуг";
        //imgOrGif.src = "img/clear.jpg";
        
    }

    
    cardCatalog.setAttribute("catalog-id", catalog.id);
    return cardCatalog;
};


const createServiceCard = (service, clearLanguage)=>{
    const serviceTemplate = document.querySelector('#service-template').content.querySelector('li');
    var cardService = document.importNode(serviceTemplate, true);
    
    const cardButton = cardService.querySelector(".card-button");
    //const imgOrGif = cardService.querySelector('img.service-gif');

    if (!(clearLanguage)){
        const query = window.location.href;

        cardButton.appendChild(createVidContainer());
        if (query.includes("query")){
            const categoryName = getCellNameById(service.categoryId);
            var categoryNameSpan = document.createElement('h3');
            categoryNameSpan.classList.add("categoryName")
            categoryNameSpan.textContent = categoryName ;
            cardButton.append(categoryNameSpan);
            //service.title = categoryName + " -> " + service.title;
          }
          
        cardButton.appendChild(createSubstrate());
        //cardService.appendChild(createVidContainer());
        const vidOrGif = cardService.querySelector('video.gif');
        vidOrGif.src = service.gifPreview;

    }
    else{

        //imgOrGif.src = "img/clear.jpg";
        //var clearCard = createClarLangCard(cardService, service.title, 
            //service.itemsInCategoryIds ? service.itemsInCategoryIds.length : 0);
        if (service.mainIconLink.length != 0){
                var clearCard = createClarLangCard(cardService, service.title, service.itemsInCategoryIds ? service.itemsInCategoryIds.length : 0, service.mainIconLink);
                cardService = (clearCard);
            }
        else{
                var clearCard = createClarLangCard(cardService, service.title, service.itemsInCategoryIds ? service.itemsInCategoryIds.length : 0);
                cardService = (clearCard);
        }

        const query = window.location.href;
        if (query.includes("query")){
          const categoryName = getCellNameById(service.categoryId);
          var categoryNameSpan = document.createElement('h3');
          categoryNameSpan.classList.add("categoryName")
          categoryNameSpan.textContent = categoryName;
          cardService.querySelector(".card-header").append(categoryNameSpan);
          //service.title = categoryName + " -> " + service.title;
        }


        //cardTitle.textContent = catalog.title + " " + catalog.itemsInCategoryIds.length + " услуг";
        //imgOrGif.src = "img/clear.jpg";
        //cardService = (clearCard);
    }
    const cardTitle = cardService.querySelector('.card-description');
    cardTitle.textContent = service.title;



    cardService.setAttribute("service-id", service.id);

    const nextButton = cardService.querySelector(".service-button");

    nextButton.addEventListener("click", (evt)=>{
    //const serviceName = evt.target.parentNode.querySelector(".card-description").textContent;
    const liEl = evt.target.closest('li');
    const serviceId = liEl.getAttribute("service-id");
    const language = document.querySelector(".services");
    window.location.href = `result.html?serviceId=${encodeURIComponent(serviceId)}?language=${encodeURIComponent(
        language.classList.contains('clear-language'))}?`;
    })
    return cardService;
};


const rowButtonEvent = (listOfCards, remove ,marginTop, marginTop2)=>{
    if(listOfCards[1].children.length === 0){
        listOfCards = listOfCards[0];
    }
    else{
        listOfCards = listOfCards[1];
    }
    if (remove){
        listOfCards.classList.remove("list");
    }
    else{
        listOfCards.classList.add("list");
    }
    
    const list = listOfCards.children;
    for (var i = 0; i < list.length; i++){
        const card = list[i];
        card.querySelector(".card-button").style.marginTop = marginTop;
        document.querySelector(".view-choose").style.marginTop = marginTop2;
    };
}

const createEventsButtons = (listOfCards)=>{
    const catalog = document.querySelector(".catalogs");
    const twoInRow = document.querySelector(".two-in-row");
    const oneInRow = document.querySelector(".one-in-row");

    if (!catalog.classList.contains("clear-language")){
        oneInRow.addEventListener("click", ()=>{
            rowButtonEvent(listOfCards, false,"20px", "7.5%");
        })
        twoInRow.addEventListener("click", ()=>{
            rowButtonEvent(listOfCards, true, "0", "5%");
        })

    }else{
        twoInRow.classList.add("opacity");
        oneInRow.classList.add("opacity");
    }
}

const createGoButtons = ()=>{
    const lists = document.querySelectorAll(".list-of-cards:not(.sceleton-list)");
    createEventsButtons(lists);
}

const createGastrualSkeleton = (count)=>{
    const template = document.querySelector('#gastrual-skeleton').content;
    var fragment = document.createDocumentFragment();

    for(var i = 0; i < count; i++){
        const skeleton = document.importNode(template, true);
        fragment.appendChild(skeleton);
    }
    return fragment;
}



export {createRes, createGoButtons, createServiceCard, createGastrualSkeleton, createCatalogCard, createInfoCard, infoRes}