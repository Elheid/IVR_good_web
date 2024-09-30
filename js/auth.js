
import { config } from "../../config.js";
const BASE_URL = config.apiBackEndUrl

const authUrl = `${BASE_URL}auth/sign-in`;
const refreshTokenUrl = `${BASE_URL}auth/refresh-token`;

const refreshToken = (methodName = "POST") => {
    fetch(`https://ivr-back.ds-hub.ru/auth/refresh-token`, {
        method: methodName,
        body: JSON.stringify({token: localStorage.getItem("token"), refreshToken:localStorage.getItem("refresh-token")}),
        headers: {
            'Content-Type': 'application/json',
            'accept': '*/*',
            'Authorization': localStorage.getItem("token") ? `Bearer ${localStorage.getItem("token")}` : undefined, // Добавляем Authorization, если есть токен
        },
    })
        .then((response) => {
            if (!response.ok) {
                return response.text().then((text) => {
                    throw new Error(text);
                });
            }
            return response.json();
        })
        .catch((error) => {
            console.error('Error details:', error);
            throw new Error(error);
        });
}

const login = (username, password) => {
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);

    /*fetch(authUrl, {
        method: 'POST',
        headers: {
            //'Content-Type': 'application/json'
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        //body: JSON.stringify({ username, password })
        body: params.toString()
    })*/
    fetch(authUrl, {
        method: 'POST',
        headers: {
            'Accept': '*/*',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username: username,
            password: password,
        }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            console.log(response)
            return response.json()
        })
        .then(data => {
            localStorage.setItem('token', data.token);
            localStorage.setItem('refresh-token', data.refreshToken);
            //checkAdmin();
            closeModal();
        })
        .catch((error) => {
            alert('Login failed ' + error);
            throw new Error(error);
        });
};
/*
const checkAdmin = () => {
    const token = localStorage.getItem('token');
    if (token) {
        fetch(checkAdminUrl, {
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
};*/

const showAdminFunctions = () => {
    const adminPanel = document.createElement('div');
    document.body.appendChild(adminPanel);
};

const openModal = () => {
    document.getElementById('authModal').style.display = 'block';
};

const closeModal = () => {
    document.getElementById('authModal').style.display = 'none';
};

const addAuth = () => {
    const params = new URLSearchParams(window.location.search);
    const authModal = document.querySelector("#authModal");
    if (authModal) {
        if (params.has('username') && params.has('password')) {
            const username = authModal.querySelector("#username");//params.get('username');
            const password = authModal.querySelector("#password"); //params.get('password');
            login(username, password);
        } else {
            const token = localStorage.getItem('token');
            try {
                refreshToken()
                if (window.location.href.indexOf("authorize") > 0 && (!token || token === "1")) {
                    openModal();
                }
            }
            catch (err){
                localStorage.removeItem('token');
                localStorage.removeItem('refresh-token');
                alert("Время истекло, перезайдите в аккаунт");
                console.log(err)
            }

        }
        //checkAdmin();
    }
};
//

if (document.querySelector("#authModal")) {
    // Обработчики событий для модального окна
    document.getElementById('loginButton').addEventListener("click", () => {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        if (username && password) {
            login(username, password);
        }
    });

    document.getElementById('forgotPasswordButton').onclick = () => {
        alert('Функция "Забыл пароль" пока не реализована.');
    };

    document.querySelector('.close').onclick = closeModal;

    window.onclick = (event) => {
        if (event.target == document.getElementById('authModal')) {
            closeModal();
        }
    };

}


export { addAuth };
