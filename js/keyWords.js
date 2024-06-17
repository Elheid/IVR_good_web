

const createTag = (name)=>{
    const tagTemplate = document.getElementById("tag");
    const newTag = document.importNode(tagTemplate.content.querySelector("li"), true);
    const title = newTag.querySelector(".tag-name");
    title.textContent = name;
    return newTag;
}

const addDeleteTagButton = ()=>{
    const input = document.querySelector('.search-input');
    const deliteTags = document.querySelectorAll(".delete-tag");

    deliteTags.forEach((deleteButton)=>{
      deleteButton.addEventListener("click", (evt)=>{
        const tag = evt.target.parentNode;
        const tagList = document.querySelector(".tag-list");
        const name = tag.querySelector(".tag-name").textContent;
        const newValue = input.value.replace(name, "");
        input.value = newValue;
        tagList.removeChild(tag);
      })
    })
}

const addNewTags =  (keyWords)=>{
    const input = document.querySelector('.search-input');
    const tagList = document.querySelector(".tag-list");
    keyWords.forEach((name) => {
        const tag =createTag(name);
        tagList.appendChild(tag);
        input.value += name + " ";
    })
    addDeleteTagButton();
};

const removeAllTags =  (keyWords)=>{
    const tagList = document.querySelector(".tag-list");
    tagList.value = "";
};

const removeGastrualSearch = ()=>{
    document.removeEventListener('click', addNewTags);
}

export {addNewTags, removeAllTags, removeGastrualSearch}