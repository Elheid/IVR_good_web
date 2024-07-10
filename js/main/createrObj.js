// это должно быть временная штука ддля проверки идеи
import { getCellNameById, getParamFromURL } from "../util.js";

const tryJsonParse = (value, name)=>{
    let res;
    try {
        res = JSON.parse(value)[name];  // Попробуем распарсить как JSON
    } catch (e) {
        res =  value;  
    }
    return res;
}

const iconInsertion = (textFromBd, iconLinks)=>{
    const iconRegex = /\\icon(\d+)/g;

    // Массив для сохранения найденных значений

    const replacedText =  textFromBd.replace(iconRegex, (match, p1) => {
    return `<img class="icons" src="${iconLinks[Number(p1)]}" alt="icon${p1}">`;
    });
    // Вставка результата в <pre> элемент
    return replacedText;
}

const insertBlocks = (text, textFromBd, icons, isInfoCards)=>{
    let textOfBlocks = extractSubstrings(textFromBd)
    if (!textFromBd.includes("\n-")){
        textOfBlocks = extractSubstringsInfo(textFromBd);
    }
    if (!textFromBd.includes("\icon")){
        textOfBlocks = textFromBd;
        text.innerHTML = (textOfBlocks);
    }
    else{
        const blocks = partingByBlocks(textOfBlocks, icons, isInfoCards);
        for (var i = 0; i < blocks.length; i++){
            text.appendChild(blocks[i]);
        }
    }
}

const partingByBlocks = (blocksOfText, icons, isInfoCards)=>{
    const blocks = [];
    for (var i = 0; i < blocksOfText.length; i++){
        let text = blocksOfText[i];
        if (!isInfoCards){
            text = text.slice(1);//slice чтобы убрать /n
        }
        const block = document.createElement('span');
        block.classList.add("text-icon-block")
        block.innerHTML = iconInsertion(text, icons);
        blocks.push(block);
    }
    return blocks;
}

const extractSubstrings = (input)=>{
    // Регулярное выражение для поиска подстрок
    const regex = /\n-.*?\n\\icon\d+/gs;
    
    // Метод match возвращает массив всех найденных подстрок
    const matches = input.match(regex);
    
    // Если ничего не найдено, возвращаем пустой массив
    return matches || [];
}


const extractSubstringsInfo = (input)=>{
    // Регулярное выражение для поиска блоков
    const regex = /.*?\n\\icon\d+/gs;

    // Метод match возвращает массив всех найденных блоков
    const blocks = input.match(regex);

    // Если ничего не найдено, возвращаем пустой массив
    return blocks || [];
}


const createRes = (result, clear)=>{
    const template = document.querySelector('#result').content;
    const res = document.importNode(template, true);
    const gif = res.querySelector("video");
    if (clear !== "true"){
        gif.src = result.gifLink;//"img/gastrual2.jpg";
        gif.setAttribute("type","video/mp4")
        gif.muted = true;
        gif.play().catch(error => {
            console.log('Autoplay failed:', error);
        });
    }
    else{
        gif.classList.add("hidden");
    }
    const text = res.querySelector(".manual-text");
    const cardTitle = document.querySelector(".res-title");
    //cardTitle.classList.remove("card-title");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = result.title; 

    //const textFromBd = iconInsertion(result.description, result.iconLinks);
    const textFromBd = result.description;
    //разбтиение на подстроки начиная с /n- до /icon
    const infoCardText = false;
    insertBlocks(text, textFromBd, result.iconLinks, infoCardText);


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
    gif.muted = true;

    //document.querySelector(".additional-info-res.card-title").classList.add("hidden")
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
    if (getParamFromURL()[1] == "true"){
        gif.classList.add("hidden");
    }else{
        gif.src = info.gifLink;
    }
    
    //text.innerHTML = iconInsertion(info.description, info.iconLinks);
    const infoCardText = true;
    insertBlocks(text, info.description, info.iconLinks, infoCardText);
    return res;
}

const createInfoCard = (info)=>{
    const infoTemplate = document.querySelector('#additional-info').content.querySelector('li');


    const infoCard = document.importNode(infoTemplate, true);
    const cardTitle = infoCard.querySelector('.card-description');

    const imgOrGif = infoCard.querySelector('.info-card-gif');

    imgOrGif.src = info.gifPreview;
    imgOrGif.muted = true;
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

    var iconContainer = document.createElement('div');
    iconContainer.classList.add("icon-container");




    //const svgUrl = 'https://storage.yandexcloud.net/akhidov-ivr/icon6.svg';
    let svgUrl = iconGif;
    /*if (svgUrl.includes("icon2") || svgUrl.includes("icon20")){
        svgUrl = 'https://storage.yandexcloud.net/akhidov-ivr/icon6.svg';
    }*/

    const changeSvgAttributes = (id)=>{
        //const svgElement = document.querySelector('svg');
        let svgElement = document.getElementById(id)
        /*if (window.location.href.includes("catalog")){
            svgElement = document.getElementById(cardParent.getAttribute("service-id"))
        }*/

        //svgElement.classList.add('icon');
        const width = svgElement.getAttribute("width");
        const height = svgElement.getAttribute("height");
        svgElement.setAttribute("viewBox", `0 0 ${width} ${height}`)
        svgElement.removeAttribute("width");
        svgElement.removeAttribute("width");
    
        svgElement.setAttribute("width", "100%");
        svgElement.setAttribute("height", "100%")
    }
    async function loadSVG(svgUrl) {
        try {
            const response = await fetch(svgUrl);
            const svgText = await response.text();
    
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
    
            const fillElements = svgDoc.querySelectorAll('[fill]');
            fillElements.forEach(el => {
                el.setAttribute('fill', '#ffffff');
            });
            let id = cardParent.getAttribute("catalog-id");
            if (window.location.href.includes("catalog") || window.location.href.includes("query")){
                id = cardParent.getAttribute("service-id");
            }
            else{
                id = cardParent.getAttribute("catalog-id");
            }
            svgDoc.documentElement.setAttribute("id", id);
            iconContainer.appendChild(svgDoc.documentElement);
            changeSvgAttributes(id);
        } catch (error) {
            console.error('Ошибка при загрузке или изменении SVG:', error);
            console.error('svg -> ', iconGif);
            var icon = document.createElement('img');
            icon.classList.add("icon");
            icon.src = iconGif;
            if (!window.location.href.includes("catalog")){
                card.appendChild(icon);
            } 
        }
    }

    loadSVG(svgUrl);
    card.appendChild(iconContainer);
    
    //loadAndModifySVG(svgUrl);


    //icon.src = iconGif; 
    //card.appendChild(icon);
    //iconContainer.appendChild(icon);

    const cardTitle = document.createElement('h3');
    cardTitle.classList.add("card-title");
    cardTitle.classList.add("card-description");
    cardTitle.textContent = title;


    var cardHeader = document.createElement('div');
    cardHeader.classList.add("card-header");

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

    cardCatalog.setAttribute("catalog-id", catalog.id);

    const cardButton = cardCatalog.querySelector(".card-button");
    
    //const imgOrGif = cardCatalog.querySelector('img.catalog-gif');

    const title = tryJsonParse(catalog.title, "title");
   
    if (!(clearLanguage)){
        //imgOrGif.classList.add("hidden");
        cardButton.appendChild(createVidContainer());
        cardButton.appendChild(createSubstrate());
       // cardCatalog.appendChild(createVidContainer());
        const vidOrGif = cardCatalog.querySelector('video.gif');
        const cardTitle = cardCatalog.querySelector('.card-description');

        const gifPreview = tryJsonParse(catalog.gifPreview, "video")

        vidOrGif.src = gifPreview;

        vidOrGif.loop = true;
        vidOrGif.muted = true;
        vidOrGif.autoplay = true;
        

        cardTitle.textContent = title;
    }
    else{
        const mainIcon = tryJsonParse(catalog.mainIconLink, "image")
        if (!mainIcon){
            mainIcon = "/img/close.jpg"
        }
        if (mainIcon.length != 0){
            var clearCard = createClarLangCard(cardCatalog, title, catalog.itemsInCategoryIds.length, mainIcon);
            cardCatalog = (clearCard);
        }
        else{
            var clearCard = createClarLangCard(cardCatalog, title, catalog.itemsInCategoryIds.length);
            cardCatalog = (clearCard);
        }
        //cardTitle.textContent = catalog.title + " " + catalog.itemsInCategoryIds.length + " услуг";
        //imgOrGif.src = "img/clear.jpg";
        
    }
    return cardCatalog;
};


const createServiceCard = (service, clearLanguage)=>{
    const serviceTemplate = document.querySelector('#service-template').content.querySelector('li');
    var cardService = document.importNode(serviceTemplate, true);

    cardService.setAttribute("service-id", service.id);

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



    const nextButton = cardService.querySelector(".service-button");

    nextButton.addEventListener("click", (evt)=>{
    //const serviceName = evt.target.parentNode.querySelector(".card-description").textContent;
    const liEl = evt.target.closest('li');
    const serviceId = liEl.getAttribute("service-id");
    const language = document.querySelector(".services");
        //header save
    const saveData = (data)=>{
        localStorage.setItem("header", JSON.stringify(data));
    }
        
    const data = document.querySelector(".header-list")
    //window.location.href = destinationClear;
    const detaHTML = data.outerHTML;
    saveData(detaHTML);

    const isAdmin = document.querySelector("body").classList.contains("admin");

    window.location.href = `result.html?serviceId=${encodeURIComponent(serviceId)}&language=${encodeURIComponent(
    language.classList.contains('clear-language'))}&admin=${isAdmin}&`;

    })

    return cardService;
};


const loadHeaderData = () => {
    const savedData = localStorage.getItem("header");
      if (savedData != null){
        return savedData;
      }
}
    

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

const changeVidLists = (lists)=>{
    for (var i = 0; i < lists.length; i++){
        lists[i].style = "width: 80%; margin-left: auto; margin-right: auto;";
    }
}
const returnVidLists = (lists)=>{
    for (var i = 0; i < lists.length; i++){
        lists[i].style = "";
    }
}

const createEventsButtons = (listOfCards)=>{
    const catalog = document.querySelector(".catalogs");
    const twoInRow = document.querySelector(".two-in-row");
    const oneInRow = document.querySelector(".one-in-row");

    if (!catalog.classList.contains("clear-language")){
        oneInRow.addEventListener("click", ()=>{
            changeVidLists(listOfCards);
            rowButtonEvent(listOfCards, false,"20px", "8.6%");
        })
        twoInRow.addEventListener("click", ()=>{
            returnVidLists(listOfCards);
            rowButtonEvent(listOfCards, true, "0", "6%");
        })

    }else{
        twoInRow.classList.add("opacity");
        oneInRow.classList.add("opacity");
    }

    /*
    width: 80%;
    margin-left: auto;
    margin-right: auto;*/
}

const createGoButtons = ()=>{
    const lists = document.querySelectorAll(".list-of-cards:not(.sceleton-list)");
    createEventsButtons(lists);
}

const createGastrualSkeleton = (count, isClear)=>{
    let template = document.querySelector('#gastrual-skeleton').content;
    if (isClear){
        template = document.querySelector('#clear-skeleton').content;
    }
    var fragment = document.createDocumentFragment();

    for(var i = 0; i < count; i++){
        const skeleton = document.importNode(template, true);
        fragment.appendChild(skeleton);
    }
    return fragment;
}



export {createRes, createGoButtons, createServiceCard, createGastrualSkeleton, createCatalogCard, createInfoCard, infoRes, loadHeaderData}