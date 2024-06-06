const createHomeReturner = (idleTime = 5000)=>{
    //const idleTime = 5000;

    const redirectToHome = ()=> {
        window.location.href = 'index.html';
    }
    let idleTimer;
    idleTimer = setTimeout(redirectToHome, idleTime);
    
    const resetIdleTimer= ()=> {
        clearTimeout(idleTimer);
        idleTimer = setTimeout(redirectToHome, idleTime);
    }
    
    window.onload = resetIdleTimer;
    window.onmousemove = resetIdleTimer;
    window.onkeypress = resetIdleTimer;
    window.ontouchstart = resetIdleTimer;
}

export {createHomeReturner}