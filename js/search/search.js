// Функция для обработки события отправки формы поиска
import { getServiceByTitle, getSimilarService } from "../api/api.js";
import { showSearchedServices } from "../services.js";


const ALERT_SHOW_TIME = 3500;
const NETWORK_MESSAGE = 'Не удалось получить данные c сервера';

const createNetworkAlert = ()=>{
    const alertContainer = document.createElement('div');
    alertContainer.style.zIndex = '100';
    alertContainer.style.position = 'absolute';
    alertContainer.style.left = '0';
    alertContainer.style.top = '8%';
    alertContainer.style.right = '0';
    alertContainer.style.padding = '2vw 0';
    alertContainer.style.fontSize = '20px';
    alertContainer.style.textAlign = 'center';
    alertContainer.style.backgroundColor = '#E04E39';
    alertContainer.style.display = 'flex';
    alertContainer.style.alignItems = 'center';
    alertContainer.style.justifyContent = "center";
    alertContainer.style.zIndex = "1001";
    return alertContainer;
};

const showAlert = (message = NETWORK_MESSAGE) => {
    const alertContainer = createNetworkAlert();
    alertContainer.innerHTML = message + "<img style='width:1.5vw; height:1.5vw;' src='/img/nothSearch.png'>";
  
    //document.body.append(alertContainer);
  
    setTimeout(() => {
      //alertContainer.remove();
    }, ALERT_SHOW_TIME);
};



/*const toggleBadSearch = ()=>{
    const badSearch = document.querySelector(".bad-search");
    if (badSearch.classList.contains("hidden")) {
        badSearch.classList.remove("hidden");
    }
}


const hideAlerts = ()=>{
    const badSearch = document.querySelector(".bad-search");

    if (!badSearch.classList.contains("hidden")) {
        badSearch.classList.add("hidden");
    }
}
*/
const handleSearch = async (event) => {
    event.preventDefault(); // Отменяем стандартное поведение формы
    const query = document.querySelector('.search-input').value; // Получаем значение из поля ввода
    // Здесь вы можете использовать значение запроса (query) для выполнения поискового запроса к вашему API
    // Например, отправляем запрос к вашему API с поисковым запросом
    //searchResult(query); 
    if (query === ""){
        return;
    }
    try {
        await searchResult(query);
    } catch (error) {
        console.log(error);
        await searchSimilarResult(query);
    }


    //document.querySelector('.search-input').value = ''; 
  };
  
const searchResult = (query)=>
    getServiceByTitle(query)
        .then((data) => {
            //hideAlerts();
            showSearchedServices(data, query)
        })
        .catch((err)=> {
            throw new Error(err);
        });

const searchSimilarResult = (query)=>
    getSimilarService(query)
        .then((data) => {
            //toggleBadSearch();
            showSearchedServices(data, query)
        })
        .catch((err)=> {
            showAlert("По запросу ничего не найдено")
  });


  // Находим форму поиска и добавляем обработчик события для отправки запроса поиска
  const addSearchButton = (searchButton)=> searchButton.addEventListener('click', handleSearch);
  const addSearchEnter = ()=> document.addEventListener('keyup', (evt)=>{
    if (evt.keyCode === 13) {
    handleSearch(evt);
    }
});
  export {addSearchButton, addSearchEnter, searchResult, /*hideAlerts*/}

