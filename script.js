document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("agreement-modal");
    const checkbox = document.getElementById("agreement-checkbox");
    const button = document.getElementById("agreement-btn");
    const mainContent = document.getElementById("main-content");

    // Если соглашение уже принимали, сразу убираем окно и размытие
    if (localStorage.getItem("robux_clicker_agreement") === "true") {
        modal.classList.add("hidden");
        mainContent.classList.remove("blurred");
    }

    // Включение/выключение кнопки по галочке
    checkbox.addEventListener("change", function () {
        button.disabled = !this.checked;
    });

    // Клик на ОК
    button.addEventListener("click", function () {
        if (checkbox.checked) {
            modal.classList.add("hidden");
            mainContent.classList.remove("blurred"); // Убираем размытие сайта
            localStorage.setItem("robux_clicker_agreement", "true"); // Запоминаем выбор
        }
    });
});
