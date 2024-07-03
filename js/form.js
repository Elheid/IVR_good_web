

const showHideInputs = ()=>{
    const parentIdLabel = document.getElementById('parent-id-label');
    const parentIdSelect = document.getElementById('parent-id');

    if (this.value === 'Услуга') {
        parentIdLabel.classList.remove('hidden');
        parentIdSelect.classList.remove('hidden');
    } else {
        parentIdLabel.classList.add('hidden');
        parentIdSelect.classList.add('hidden');
    }
}

const submitCardAdd = (event)=>{
    event.preventDefault();
    
    const type = document.getElementById('type').value;
    const title = document.getElementById('title').value;
    const image = document.getElementById('image').files[0];
    const video = document.getElementById('video').files[0];

    // Создаем новую карточку
    const newCard = document.createElement('div');
    newCard.classList.add('card');
    
    const cardTitle = document.createElement('h2');
    cardTitle.textContent = title;
    newCard.appendChild(cardTitle);

    if (image) {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(image);
        img.style.width = '100%';
        newCard.appendChild(img);
    }

    if (video) {
        const videoElement = document.createElement('video');
        videoElement.src = URL.createObjectURL(video);
        videoElement.controls = true;
        videoElement.style.width = '100%';
        newCard.appendChild(videoElement);
    }

    //document.querySelector('.card-container').appendChild(newCard);
    console.log("should added: ", newCard)

    // Скрываем форму
    document.getElementById('card-form-container').classList.add('hidden');
    document.getElementById('card-form').reset();
}

const hideForm = ()=>{
    document.getElementById('card-form-container').classList.add('hidden');
}

const showForm = ()=>{
    console.log("show form")
    document.getElementById('card-form-container').classList.remove('hidden');
}

/*const closeFormWeb = (event)=> {
    //const form = document.getElementById('card-form');
    const overlay = document.getElementById('card-form-container');
    if (event.target !== (overlay)) {
        hideForm();
        //document.removeEventListener('click', closeFormWeb);
    }
};*/


const createForm = ()=>{
    document.getElementById('type').addEventListener('change', showHideInputs);

    document.getElementById('card-form').addEventListener('submit', (event)=> submitCardAdd(event));

    document.querySelector('.close-form').addEventListener('click', hideForm);

    //document.addEventListener('click', closeFormWeb);
    document.querySelectorAll(".edit-button").forEach((card)=>{
        card.removeEventListener('click', showForm);
        card.addEventListener('click', showForm);
    })
    document.querySelectorAll('.card-to-add').forEach((card)=>{
        card.removeEventListener('click', showForm);
        card.addEventListener('click', showForm);
    })
}

export {createForm, showForm}