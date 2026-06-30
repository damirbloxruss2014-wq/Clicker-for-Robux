document.addEventListener("DOMContentLoaded", function () {
    let balance = 0;
    let clickPower = 1;
    let autoPower = 0;
    let luckLevel = 0;

    let clickUpgradePrice = 20;
    let autoUpgradePrice = 100;
    let luckUpgradePrice = 500;

    const modal = document.getElementById("agreement-modal");
    const checkbox = document.getElementById("agreement-checkbox");
    const button = document.getElementById("agreement-btn");
    const mainContent = document.getElementById("main-content");
    const balanceDisplay = document.getElementById("balance-display");
    const luckPercentDisplay = document.getElementById("luck-percent");

    const upClickBtn = document.getElementById("up-click-btn");
    const upAutoBtn = document.getElementById("up-auto-btn");
    const upLuckBtn = document.getElementById("up-luck-btn");

    if (localStorage.getItem("robux_clicker_agreement") === "true") {
        modal.classList.add("hidden");
        mainContent.classList.remove("blurred");
    }
    checkbox.addEventListener("change", function () {
        button.disabled = !this.checked;
    });
    button.addEventListener("click", function () {
        if (checkbox.checked) {
            modal.classList.add("hidden");
            mainContent.classList.remove("blurred");
            localStorage.setItem("robux_clicker_agreement", "true");
        }
    });

    function updateUI() {
        balanceDisplay.innerText = String(Math.floor(balance)).padStart(6, '0');
        
        upClickBtn.innerText = `${Math.floor(clickUpgradePrice)} RP`;
        upAutoBtn.innerText = `${Math.floor(autoUpgradePrice)} RP`;
        
        // Показываем шанс крита. Максимум 10 уровней (50%)
        let currentChance = luckLevel * 5;
        luckPercentDisplay.innerText = `${currentChance}%`;
        
        if (luckLevel >= 10) {
            upLuckBtn.innerText = "МАКС.";
            upLuckBtn.disabled = true;
        } else {
            upLuckBtn.innerText = `${Math.floor(luckUpgradePrice)} RP`;
        }
    }

    document.getElementById("click-target").addEventListener("click", function () {
        let currentGain = clickPower;
        
        if (luckLevel > 0) {
            let chance = luckLevel * 0.05; 
            if (Math.random() < chance) {
                currentGain *= 5;
                balanceDisplay.style.color = "#ffffff";
                setTimeout(() => balanceDisplay.style.color = "#39ff14", 150);
            }
        }
        
        balance += currentGain;
        updateUI();
    });

    window.buyClickUpgrade = function() {
        if (balance >= clickUpgradePrice) {
            balance -= clickUpgradePrice;
            clickPower += 1;
            clickUpgradePrice = clickUpgradePrice * 1.4;
            updateUI();
        }
    };

    window.buyAutoUpgrade = function() {
        if (balance >= autoUpgradePrice) {
            balance -= autoUpgradePrice;
            autoPower += 1;
            autoUpgradePrice = autoUpgradePrice * 1.4;
            updateUI();
        }
    };

    window.buyLuckUpgrade = function() {
        if (balance >= luckUpgradePrice && luckLevel < 10) {
            balance -= luckUpgradePrice;
            luckLevel += 1;
            luckUpgradePrice = luckUpgradePrice * 1.8;
            updateUI();
        }
    };

    setInterval(function() {
        if (autoPower > 0) {
            balance += autoPower;
            updateUI();
        }
    }, 1000);

    window.toggleMenu = function(menuId) {
        const targetMenu = document.getElementById(menuId);
        const allMenus = document.querySelectorAll('.dropdown-panel');
        
        allMenus.forEach(menu => {
            if (menu.id !== menuId) menu.classList.remove('active');
        });
        
        targetMenu.classList.toggle('active');
    };

    window.startWithdraw = function(rbxAmount, rpCost) {
        if (balance < rpCost) {
            alert(`Недостаточно RoPoints! Нужно еще ${rpCost - Math.floor(balance)} RP.`);
            return;
        }

        balance -= rpCost;
        updateUI();

        const loader = document.getElementById("loader-modal");
        const loaderText = document.getElementById("loader-text");
        const closeBtn = document.getElementById("loader-close-btn");
        const spinner = document.querySelector(".spinner");

        loader.classList.remove("hidden");
        spinner.classList.remove("hidden");
        closeBtn.classList.add("hidden");
        loaderText.innerText = `Инициализация вывода ${rbxAmount} RBX через сервера Roblox API...`;

        setTimeout(() => {
            loaderText.innerText = "Авторизация сессии... Проверка хэша транзакции...";
        }, 2000);

        setTimeout(() => {
            loaderText.innerText = "Подключение к пулу ликвидности... Синхронизация блоков...";
        }, 4500);

        setTimeout(() => {
            spinner.classList.add("hidden");
            loaderText.innerHTML = `<span style="color:#ff3333; font-weight:bold;">ОШИБКА 0x404: ТРАНЗАКЦИЯ ЗАБЛОКИРОВАНА.</span><br><br>Обнаружена слишком высокая активность аккаунта. В целях безопасности вывод заморожен. Попробуйте накопить больше RoPoints и повторить попытку позже.`;
            closeBtn.classList.remove("hidden");
        }, 7000);
    };

    window.closeLoader = function() {
        document.getElementById("loader-modal").classList.add("hidden");
    };

    updateUI();
});
