//const BASE_URL = 'http://localhost:8080/';
const BASE_URL = 'https://pincode-dev.ru/ivr-good/';
const Route = {
  GET_CATEGORY: 'categories',
  GET_SERVICES: 'items/search/byCategory?categoryId=',
  GET_SERVICE_BY_ID:"items/",
  GET_INFO: 'additions/',
  SEARCH_SERVICE_BY_TITTLE:"items/search?title=",
  SEARCH_SIMILAR_SERVICE:"items/search/similar?title=",
  SEND_DATA: '/',

  
  CREATE_CATEGORY: 'categories',
  DELETE_CATEGORY: 'categories/',
  UPDATE_CATEGORY_MAIN_ICON: 'categories/',
  UPDATE_CATEGORY_GIF: 'categories/',
  UPDATE_CATEGORY_GIF_PREVIEW: 'categories/',
  SET_CATEGORY_PARENT: 'categories/',
  REMOVE_CATEGORY_CHILD: 'categories/children/remove/',



  CREATE_SERVICE: 'items',
  DELETE_SERVICE: 'items/',
  REMOVE_SERVICE_CATEGORY: 'items/',
  ADD_SERVICE_CATEGORY: 'items/',
  UPDATE_SERVICE_MAIN_ICON: 'items/',
  REMOVE_SERVICE_ICON: 'items/',
  ADD_SERVICE_ICON: 'items/',
  UPDATE_SERVICE_GIF: 'items/',
  UPDATE_SERVICE_GIF_PREVIEW: 'items/',
  UPDATE_SERVICE_DESCRIPTION: 'items/',


  CREATE_ADDITION: 'additions',
  DELETE_ADDITION: 'additions/',
  REMOVE_ADDITION_ICON: 'additions/',
  UPDATE_ADDITION_TITLE: 'additions/',
  UPDATE_ADDITION_MAIN_ICON: 'additions/',
  ADD_ADDITION_ICON: 'additions/',
  UPDATE_ADDITION_GIF: 'additions/',
  UPDATE_ADDITION_DESCRIPTION: 'additions/',
  UPDATE_ADDITION_GIF_PREVIEW: 'additions/'

};

const Method = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE'
};

const ErrorText = {
  GET_DATA: 'Не удалось загрузить данные. Попробуйте изменить запрос',
  SEND_DATA: 'Не удалось отправить форму. Попробуйте ещё раз',
  DELETE_DATA: 'Не удалось удалить данные. Попробуйте ещё раз',
  UPDATE_DATA: 'Не удалось обновить данные. Попробуйте ещё раз'
};

const load = (route, errorText, method = Method.GET, body = null, ) =>
  fetch(`${BASE_URL}${route}`, {method, body})
    .then((response) => {
      if (!response.ok) {
        throw new Error();  
      }
      return response.json();
    })
    .catch(() => {
      throw new Error(errorText);
});

const fetchForm = (route, errorText, method = Method.GET, body = null) =>
  fetch(`${BASE_URL}${route}`, { 
    method, 
    body: body ? JSON.stringify(body) : null,
    headers: body ? { 'Content-Type': 'application/json','accept': '*/*' } : {} 
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error();
      }
      const json = response.json();
      return json;
    })
    .catch(() => {
      throw new Error(errorText);
});

const loadById = (route, id, errorText, method = Method.GET, body = null) =>
  fetch(`${BASE_URL}${route}${id}`, { 
    method, 
    body: body ? JSON.stringify(body) : null,
    headers: body ? { 'Content-Type': 'application/json','accept': '*/*' } : {} 
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error();
      }
      return response.json();
    })
    .catch(() => {
      throw new Error(errorText);
});

/*
const loadToSearch = ( title, errorText, method = Method.GET, body = null) =>
  fetch(`${BASE_URL}items/search?title=${title}`, {method, body})
    .then((response) => {
      if (!response.ok) {
        throw new Error();
      }
      return response.json();
    })
    .catch(() => {
      loadToSearchSimilar(title);
});

const loadToSearchSimilar = (title, errorText, method = Method.GET, body = null) =>
  fetch(`${BASE_URL}items/search/similar?title=${title}`, {method, body})
    .then((response) => {
      if (!response.ok) {
        throw new Error();
      }
      return response.json();
    })
    .catch(() => {
      throw new Error(errorText);});
*/

const getCategories= () => load(Route.GET_CATEGORY, ErrorText.GET_DATA);
const getService= (id) => loadById(Route.GET_SERVICES, id, ErrorText.GET_DATA);
const getServiceById= (id) => loadById(Route.GET_SERVICE_BY_ID, id, ErrorText.GET_DATA);
const getInfoById= (id) => loadById(Route.GET_INFO, id, ErrorText.GET_DATA);

const getServiceByTitle= (title) => loadById(Route.SEARCH_SERVICE_BY_TITTLE, title, ErrorText.GET_DATA);
const getSimilarService= (title) => loadById(Route.SEARCH_SIMILAR_SERVICE, title, ErrorText.GET_DATA);


const sendData = (body) => load(Route.SEND_DATA, ErrorText.SEND_DATA, Method.POST, body);


//Методы для категорий
const createCategory = (body) => fetchForm(Route.CREATE_CATEGORY, ErrorText.SEND_DATA, Method.POST, body);
const deleteCategory = (id) => loadById(Route.DELETE_CATEGORY, id, ErrorText.DELETE_DATA, Method.DELETE);
const updateCategoryMainIcon = (id, body) => loadById(Route.UPDATE_CATEGORY_MAIN_ICON + id + '/main-icon', '', ErrorText.UPDATE_DATA, Method.PUT, body);
const updateCategoryGif = (id, body) => loadById(Route.UPDATE_CATEGORY_GIF + id + '/gif', '', ErrorText.UPDATE_DATA, Method.PUT, body);
const updateCategoryGifPreview = (id, body) => loadById(Route.UPDATE_CATEGORY_GIF_PREVIEW + id + '/gif-preview', '', ErrorText.UPDATE_DATA, Method.PUT, body);
const setCategoryParent = (categoryId, parentId) => loadById(Route.SET_CATEGORY_PARENT + categoryId + '/parent/set/', parentId, ErrorText.UPDATE_DATA, Method.PUT);
const removeCategoryChild = (childId) => loadById(Route.REMOVE_CATEGORY_CHILD, childId, ErrorText.UPDATE_DATA, Method.PUT);

//Методы для услуг
const createService = (body) => fetchForm(Route.CREATE_SERVICE, ErrorText.SEND_DATA, Method.POST, body);
const deleteService = (id) => loadById(Route.DELETE_SERVICE, id, ErrorText.DELETE_DATA, Method.DELETE);
const removeServiceCategory = (itemId) => loadById(Route.REMOVE_SERVICE_CATEGORY + itemId + '/category/remove', '', ErrorText.UPDATE_DATA, Method.PUT);
const addServiceCategory = (itemId, categoryId) => loadById(Route.ADD_SERVICE_CATEGORY + itemId + '/category/add/', categoryId, ErrorText.UPDATE_DATA, Method.PUT);
const updateServiceMainIcon = (id, body) => loadById(Route.UPDATE_SERVICE_MAIN_ICON + id + '/main-icon', '', ErrorText.UPDATE_DATA, Method.PUT, body);
const removeServiceIcon = (id) => loadById(Route.REMOVE_SERVICE_ICON + id + '/icon/remove', '', ErrorText.UPDATE_DATA, Method.PUT);
const addServiceIcon = (id, body) => loadById(Route.ADD_SERVICE_ICON + id + '/icon/add', '', ErrorText.UPDATE_DATA, Method.PUT, body);
const updateServiceGif = (id, body) => loadById(Route.UPDATE_SERVICE_GIF + id + '/gif', '', ErrorText.UPDATE_DATA, Method.PUT, body);
const updateServiceGifPreview = (id, body) => loadById(Route.UPDATE_SERVICE_GIF_PREVIEW + id + '/gif-preview', '', ErrorText.UPDATE_DATA, Method.PUT, body);
const updateServiceDescription = (id, body) => loadById(Route.UPDATE_SERVICE_DESCRIPTION + id + '/description', '', ErrorText.UPDATE_DATA, Method.PUT, body);

//Методы для доп инфы
const createAddition = (body) => load(Route.CREATE_ADDITION, ErrorText.SEND_DATA, Method.POST, body);
const deleteAddition = (id) => loadById(Route.DELETE_ADDITION, id, ErrorText.DELETE_DATA, Method.DELETE);
const removeAdditionIcon = (id) => loadById(Route.REMOVE_ADDITION_ICON + id + '/icon/remove', '', ErrorText.UPDATE_DATA, Method.PUT);
const updateAdditionTitle = (id, body) => loadById(Route.UPDATE_ADDITION_TITLE + id + '/title', '', ErrorText.UPDATE_DATA, Method.PUT, body);
const updateAdditionMainIcon = (id, body) => loadById(Route.UPDATE_ADDITION_MAIN_ICON + id + '/main-icon', '', ErrorText.UPDATE_DATA, Method.PUT, body);
const addAdditionIcon = (id, body) => loadById(Route.ADD_ADDITION_ICON + id + '/icon/add', '', ErrorText.UPDATE_DATA, Method.PUT, body);
const updateAdditionGif = (id, body) => loadById(Route.UPDATE_ADDITION_GIF + id + '/gif', '', ErrorText.UPDATE_DATA, Method.PUT, body);
const updateAdditionDescription = (id, body) => loadById(Route.UPDATE_ADDITION_DESCRIPTION + id + '/description', '', ErrorText.UPDATE_DATA, Method.PUT, body);
const updateAdditionGifPreview = (id, body) => loadById(Route.UPDATE_ADDITION_GIF_PREVIEW + id + '/gif-preview', '', ErrorText.UPDATE_DATA, Method.PUT, body);


export { getCategories, getService, getInfoById, getServiceById, getServiceByTitle, getSimilarService, sendData,
  createCategory, deleteCategory, updateCategoryMainIcon, updateCategoryGif, updateCategoryGifPreview, setCategoryParent, removeCategoryChild,
  createService, deleteService, addServiceCategory
};
