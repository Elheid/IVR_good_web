var flag = "";
const destination = "instruction.html";
const createButtons = ()=>{
    const gesturalButton = document.querySelector(".gestural-language .transition-icon");
    const clearButton = document.querySelector(".clear-language .transition-icon");
    gesturalButton.addEventListener("click", function() {
        flag = "gestural-language";
        window.location.href = destination;
        saveData();
    });

    clearButton.addEventListener("click", function() {
        flag = "clear-language";
        window.location.href = destination;
        saveData();
    });
}
const saveData = ()=>{
    localStorage.setItem("language", flag);
}

const loadSavedData = () => {
    const savedData = localStorage.getItem("language");
    if (savedData != null){
        return savedData;
    }
}


if (!window.location.href.includes("services") || window.location.href.includes("result")){
    createButtons();
}


export{loadSavedData};