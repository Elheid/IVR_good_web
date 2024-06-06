const defaultTimer = 12000;
let idleTimer;
const createHomeReturner = (idleTime = defaultTimer)=>{
    //const idleTime = 5000;

    const redirectToHome = ()=> {
        window.location.href = 'index.html';
    }
    idleTimer = setTimeout(redirectToHome, idleTime);
    
    /*const resetIdleTimer= ()=> {
        clearTimeout(idleTimer);
        idleTimer = setTimeout(redirectToHome, idleTime);
    }*/
    
    window.addEventListener("DOMContentLoaded", ()=>{
        resetIdleTimer(idleTime)
    });
    window.addEventListener("mousemove", ()=>{
        resetIdleTimer(idleTime)
    });
    window.addEventListener("keypress", ()=>{
        resetIdleTimer(idleTime)
    });
    window.addEventListener("touchend", ()=>{
        resetIdleTimer(idleTime)
    });
    /*window.onmousemove = resetIdleTimer(idleTime);
    window.onkeypress = resetIdleTimer(idleTime);
    window.ontouchstart = resetIdleTimer(idleTime);*/
}
const redirectToHome = ()=> {
    window.location.href = 'index.html';
}

const resetIdleTimer= (idleTime)=> {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(redirectToHome, idleTime);
}

/*const redirectToHome = ()=> {
    window.location.href = 'index.html';
}

const resetIdleTimer= (idleTime = 5000)=> {
    clearTimeout(idleTimer);
    idleTimer = setTimeout(redirectToHome, idleTime);
}

let idleTimer = setTimeout(redirectToHome, idleTime);*/


export {createHomeReturner, resetIdleTimer}