

const showHideInputs = ()=>{
    const types = document.getElementById('type');

    const parentIdLabel = document.getElementById('parent-id-label');
    const parentIdSelect = document.getElementById('parent-id');

    if (types.value === 'service') {
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
    event.stopPropagation();
    console.log("show form")
    document.getElementById('card-form-container').classList.remove('hidden');
    document.addEventListener('click', closeFormOnExitBorders);
}

const closeFormOnExitBorders = (event)=> {
    //const form = document.getElementById('card-form');
    //event.stopPropagation();
    const overlay = document.getElementById('card-form-container');
    const form = document.getElementById('card-form');
    if (event.target !== overlay && event.target !== form && !form.contains(event.target)) {
        hideForm();
        //document.removeEventListener('click', closeFormWeb);
    }
};


const createForm = ()=>{
    document.getElementById('type').addEventListener('change', showHideInputs);

    document.getElementById('card-form').addEventListener('submit', (event)=> submitCardAdd(event));

    document.querySelector('.close-form').addEventListener('click', hideForm);

    
    document.querySelectorAll(".edit-button").forEach((card)=>{
        card.removeEventListener('click', showForm);
        card.addEventListener('click', showForm);
    })
    document.querySelectorAll('.card-to-add').forEach((card)=>{
        card.removeEventListener('click', showForm);
        card.addEventListener('click', showForm);
    })
}

const showEditForm = ()=>{
    event.stopPropagation();
    const editForm = document.getElementById("edit-form");
    editForm.classList.remove("hidden");
    document.querySelector(".close-edit-form").addEventListener("click", hideEditForm);
    document.addEventListener('click', closeEditOnBorders);
}

const hideEditForm = ()=>{
    const editForm = document.getElementById("edit-form");
    editForm.classList.add("hidden");
}

const closeEditOnBorders = (event)=> {
    const form = document.getElementById('edit-form');
    const isntContain = !form.contains(event.target);
    const instEquals = event.target !== form;
    if (instEquals && isntContain) {
        hideEditForm();
        document.removeEventListener("click",closeEditOnBorders)
    }
};



export {createForm, showForm, showEditForm}