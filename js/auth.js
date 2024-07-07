// auth.js
/*document.addEventListener('DOMContentLoaded', ()=> {
    const form = document.getElementById('loginForm');
    const params = new URLSearchParams(window.location.search);
    
    if (params.has('username') && params.has('password')) {
        const username = params.get('username');
        const password = params.get('password');
        login(username, password);
    }

    form.addEventListener('submit', (event)=> {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        login(username, password);
    });

    const login = (username, password)=> {
        fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                localStorage.setItem('token', data.token);
                checkAdmin();
            } else {
                alert('Login failed');
            }
        });
    }

    const checkAdmin =()=> {
        const token = localStorage.getItem('token');
        if (token) {
            fetch('/api/check-admin', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.isAdmin) {
                    showAdminFunctions();
                }
            });
        }
    }

    const showAdminFunctions = ()=> {
        // Покажите функции для администратора
        const adminPanel = document.createElement('div');
        adminPanel.innerHTML = '<h1>Admin Panel</h1><p>Welcome, admin!</p>';
        document.body.appendChild(adminPanel);
    }

    // Проверка на админство при загрузке страницы
    checkAdmin();
});*/
// Функция для авторизации
const login = (username, password)=> {
    fetch('URL_ВАШЕГО_БЭКЕНДА/api/login', { // замените на URL вашего бэкенда
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            localStorage.setItem('token', data.token);
            checkAdmin();
        } else {
            alert('Login failed');
        }
    });
}

// Функция для проверки прав администратора
const checkAdmin = ()=> {
    const token = localStorage.getItem('token');
    if (token) {
        fetch('URL_ВАШЕГО_БЭКЕНДА/api/check-admin', { // замените на URL вашего бэкенда
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.isAdmin) {
                showAdminFunctions();
            }
        });
    }
}

// Функция для отображения функций администратора
const showAdminFunctions = ()=> {
    const adminPanel = document.createElement('div');
    adminPanel.innerHTML = '<h1>Admin Panel</h1><p>Welcome, admin!</p>';
    document.body.appendChild(adminPanel);
}

const addAuth = ()=>
{
    //document.addEventListener('DOMContentLoaded', ()=> {
        const params = new URLSearchParams(window.location.href);
    
        // Проверяем, есть ли параметры в URL
        if (params.has('username') && params.has('password')) {
            const username = params.get('username');
            const password = params.get('password');
            login(username, password);
        } else {
            // Если нет параметров в URL, запрашиваем их с помощью confirm()
            if (window.location.href.indexOf("/authorize") > 0){
                const username = prompt('Enter username:');
                const password = prompt('Enter password:');
                if (username && password) {
                    login(username, password);
                }
            }
        }
        // Проверка прав администратора при загрузке страницы
        checkAdmin();
    //});
}
export {addAuth}