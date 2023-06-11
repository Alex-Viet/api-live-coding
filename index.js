import { format } from "date-fns";
import { addTodo, deleteTodo, getTodo } from "./api.js";
import { renderLoginComponent } from "./components/login-component.js";
import { formatDateToRu, formatDateToUs } from "./lib/formatDate/formatDate.js";

const country = "ru";

let tasks = [];
let token = null;

const fetchTodosAndRender = () => {
    return getTodo({ token })
        .then((responseData) => {
            tasks = responseData.todos;
            renderApp();
        });
};

const renderApp = () => {
    const appEl = document.getElementById("app");

    if (!token) {
        renderLoginComponent({
            appEl,
            setToken: (newToken) => { token = newToken },
            fetchTodosAndRender,
        });

        return;
    };

    const tasksHtml = tasks
        .map((task) => {
            const createDate = format(new Date(task.created_at), 'dd/MM/yyyy hh:mm');
            return `
          <li class="task">
            <p class="task-text">
              ${task.text} (Создал: ${task.user?.name ?? "Автор неизвестен"})
              <button data-id="${task.id}" class="button delete-button">Удалить</button>
            </p>
            <p> <i>Задача создана: ${createDate} </i> </p>
          </li>`;
        })
        .join("");

    const appHtml = `<h1>Список задач</h1>
                        <ul class="tasks" id="list">
                            <!— Список рендерится из JS —>
                            ${tasksHtml}
                        </ul>
                        <br />
                        <div class="form">
                            <h3 class="form-title">Форма добавления</h3>
                            <div class="form-row">
                                Что нужно сделать:
                                <input type="text" id="text-input" class="input" placeholder="Выпить кофе" />
                            </div>
                            <br />
                            <button class="button" id="add-button">Добавить</button>
                        </div>`;

    appEl.innerHTML = appHtml;

    const buttonElement = document.getElementById("add-button");
    const textInputElement = document.getElementById("text-input");
    const deleteButtons = document.querySelectorAll(".delete-button");

    for (const deleteButton of deleteButtons) {
        deleteButton.addEventListener("click", (event) => {
            event.stopPropagation();

            const id = deleteButton.dataset.id;

            // Подписываемся на успешное завершение запроса с помощью then
            deleteTodo({ token, id })
                .then((responseData) => {
                    // Получили данные и рендерим их в приложении
                    tasks = responseData.todos;
                    renderApp();
                });

            renderApp();
        });
    }

    buttonElement.addEventListener("click", () => {
        if (textInputElement.value === "") {
            return;
        };

        buttonElement.disabled = true;
        buttonElement.textContent = "Задача добавляется...";

        // Подписываемся на успешное завершение запроса с помощью then
        addTodo({
            token,
            text: textInputElement.value
        })
            .then(() => {
                textInputElement.value = "";
            })
            .then(() => {
                return fetchTodosAndRender();
            })
            .then(() => {
                buttonElement.disabled = false;
                buttonElement.textContent = "Добавить";
            })
            .catch((error) => {
                console.error(error);
                alert("Кажется, у вас проблемы с интернетом, попробуйте позже");
                buttonElement.disabled = false;
                buttonElement.textContent = "Добавить";
            });

        renderApp();
    });
};

renderApp();