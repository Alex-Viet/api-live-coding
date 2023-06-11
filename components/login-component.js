import { loginUser, registerUser } from "../api.js";
import _ from 'lodash';

export function renderLoginComponent({ appEl, setToken, fetchTodosAndRender }) {
    let isLoginMode = true;

    const renderForm = () => {
        const appHtml = `<h1>Список задач</h1>
        <div class="form">
            <h3 class="form-title">Форма ${isLoginMode ? "входа" : "регистрации"}</h3>
            <div class="form-row">
                ${isLoginMode ? "" :
                `Имя:
                <input type="text" id="name-input" class="input" />
                <br/>`}
                Логин:
                <input type="text" id="login-input" class="input" />
                <br/>
                Пароль:
                <input type="password" id="password-input" class="input" />
            </div>
            <br />
            <button class="button" id="login-button">${isLoginMode ? "Войти" : "Зарегистрироваться"}</button>
            <br/><br/><br/>
            <button class="button" id="toggle-button">Перейти ${isLoginMode ? "к регистрации" : "ко входу"}</button>
        </div>`;

        appEl.innerHTML = appHtml;

        const loginButtonElem = document.getElementById("login-button");
        const toggleButtonElem = document.getElementById("toggle-button");

        loginButtonElem.addEventListener("click", () => {
            if (isLoginMode) {
                const login = document.getElementById("login-input").value;
                const password = document.getElementById("password-input").value;

                if (!login) {
                    alert("Введите логин!");
                    return;
                };

                if (!password) {
                    alert("Введите пароль!");
                    return;
                };

                loginUser({
                    login: login,
                    password: password,
                }).then((user) => {
                    setToken(`Bearer ${user.user.token}`);
                    fetchTodosAndRender();
                }).catch(error => alert(error.message)); // Поменять alert на что-то красивее!
            } else {
                const name = document.getElementById("name-input").value;
                const login = document.getElementById("login-input").value;
                const password = document.getElementById("password-input").value;

                if (!name) {
                    alert("Введите имя!");
                    return;
                };

                if (!login) {
                    alert("Введите логин!");
                    return;
                };

                if (!password) {
                    alert("Введите пароль!");
                    return;
                };

                registerUser({
                    login: login,
                    name: _.capitalize(name),
                    password: password,
                }).then((user) => {
                    setToken(`Bearer ${user.user.token}`);
                    fetchTodosAndRender();
                }).catch(error => alert(error.message)); // Поменять alert на что-то красивее!
            }

        });

        toggleButtonElem.addEventListener("click", () => {
            isLoginMode = !isLoginMode;
            renderForm();
        });
    };

    renderForm();
};