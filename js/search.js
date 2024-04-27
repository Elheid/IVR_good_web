// Функция для обработки события отправки формы поиска
import { getServiceByTitle, getSimilarService } from "./api.js";
import { showSearchedServices } from "./catalog.js";

const ALERT_SHOW_TIME = 3500;
const NETWORK_MESSAGE = 'Не удалось получить данные c сервера';

const createNetworkAlert = ()=>{
    const alertContainer = document.createElement('div');
    alertContainer.style.zIndex = '100';
    alertContainer.style.position = 'absolute';
    alertContainer.style.left = '0';
    alertContainer.style.top = '9%';
    alertContainer.style.right = '0';
    alertContainer.style.padding = '10px 0';
    alertContainer.style.fontSize = '20px';
    alertContainer.style.textAlign = 'center';
    alertContainer.style.backgroundColor = 'red';
    return alertContainer;
};

const showAlert = (message = NETWORK_MESSAGE) => {
    const alertContainer = createNetworkAlert();
    alertContainer.textContent = message;
  
    document.body.append(alertContainer);
  
    setTimeout(() => {
      alertContainer.remove();
    }, ALERT_SHOW_TIME);
};



const toggleBadSearch = ()=>{
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

const handleSearch = async (event) => {
    event.preventDefault(); // Отменяем стандартное поведение формы
    const query = document.querySelector('.search-input').value; // Получаем значение из поля ввода
    // Здесь вы можете использовать значение запроса (query) для выполнения поискового запроса к вашему API
    // Например, отправляем запрос к вашему API с поисковым запросом
    searchResult(query); 

    document.querySelector('.search-input').value = ''; 
  };
  
const searchResult = (query)=>
    getServiceByTitle(query)
        .then((data) => {
            hideAlerts();
            showSearchedServices(data, query)
        })
        .catch((err)=> {
            searchSimilarResult(query)
        });

const searchSimilarResult = (query)=>
    getSimilarService(query)
        .then((data) => {
            toggleBadSearch();
            showSearchedServices(data, query)
        })
        .catch((err)=> {
            showAlert(err)
  });


  // Находим форму поиска и добавляем обработчик события для отправки запроса поиска
  const addSearchButton = ()=> document.querySelector('.search-button').addEventListener('click', handleSearch);
  export {addSearchButton, searchResult, hideAlerts}
