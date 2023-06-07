const host = "https://webdev-hw-api.vercel.app/api/v2/todos";


export function getTodo({ token }) {
    return fetch(host, {
        method: "GET",
        headers: {
            Authorization: token,
        }
    })
        .then((response) => {
            if (response.status === 401) {
                // password = prompt("Введите верный пароль");
                // fetchTodosAndRender();
                throw new Error("Нет авторизации");
            }

            return response.json();
        })
};


export function deleteTodo({ token, id }) {
    return fetch("https://webdev-hw-api.vercel.app/api/v2/todos/" + id, {
        method: "DELETE",
        headers: {
            Authorization: token,
        }
    })
        .then((response) => {
            return response.json();
        })
};


export function addTodo({ token, text }) {
    return fetch(host, {
        method: "POST",
        body: JSON.stringify({
            text,
        }),
        headers: {
            Authorization: token,
        }
    })
        .then((response) => {
            return response.json();
        })
};


export function loginUser({ login, password }) {
    return fetch("https://wedev-api.sky.pro/api/user/login", {
        method: "POST",
        body: JSON.stringify({
            login,
            password,
        }),
    })
        .then((response) => {
            if (response.status === 400) {
                throw new Error('Неверный логин или пароль');
            }
            return response.json();
        })
};


export function registerUser({ login, name, password }) {
    return fetch("https://wedev-api.sky.pro/api/user", {
        method: "POST",
        body: JSON.stringify({
            login,
            name,
            password,
        }),
    })
        .then((response) => {
            if (response.status === 400) {
                throw new Error('Такой пользователь уже существует');
            }
            return response.json();
        })
};