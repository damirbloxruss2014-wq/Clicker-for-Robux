document.addEventListener("DOMContentLoaded", function () {
    let balance = 0;
    let clickPower = 1;
    let autoPower = 0;
    let luckLevel = 0;

    let clickUpgradePrice = 20;
    let autoUpgradePrice = 100;
    let luckUpgradePrice = 500;
    
    let usedCodes = []; 

    const modal = document.getElementById("agreement-modal");
    const checkbox = document.getElementById("agreement-checkbox");
    const button = document.getElementById("agreement-btn");
    const checkboxWrapper = document.getElementById("checkbox-zone-wrapper");
    const mainContent = document.getElementById("main-content");
    const balanceDisplay = document.getElementById("balance-display");
    const luckPercentDisplay = document.getElementById("luck-percent");
    const particlesContainer = document.getElementById("click-particles-container");

    const upClickBtn = document.getElementById("up-click-btn");
    const upAutoBtn = document.getElementById("up-auto-btn");
    const upLuckBtn = document.getElementById("up-luck-btn");

    // ИЗМЕНЕНО: Окно ТЕПЕРЬ ВСЕГДА открыто при перезагрузке страницы, без исключений
    modal.classList.remove("hidden");
    mainContent.classList.add("blurred");
    checkbox.checked = false; // Сбрасываем галочку, чтобы она не оставалась нажатой
    button.disabled = true;

    // Включение кнопки только по галочке
    checkbox.addEventListener("change", function () {
        button.disabled = !this.checked;
    });

    // Нажатие ОК просто пускает в игру на эту сессию
    button.addEventListener("click", function () {
        if (checkbox.checked) {
            modal.classList.add("hidden");
            mainContent.classList.remove("blurred");
        }
    });

    // Повторное открытие соглашения из футера (вкладку чекбокса прячем, кнопка ОК сразу активна)
    window.openAgreementAgain = function() {
        checkboxWrapper.style.display = "none"; 
        button.disabled = false; 
        mainContent.classList.add("blurred");
        modal.classList.remove("hidden");
    };

    function updateUI() {
        balanceDisplay.innerText = String(Math.floor(balance)).padStart(6, '0');
        upClickBtn.innerText = `${Math.floor(clickUpgradePrice)} RP`;
        upAutoBtn.innerText = `${Math.floor(autoUpgradePrice)} RP`;
        
        let currentChance = luckLevel * 5;
        luckPercentDisplay.innerText = `${currentChance}%`;
        
        if (luckLevel >= 10) {
            upLuckBtn.innerText = "МАКС.";
            upLuckBtn.disabled = true;
        } else {
            upLuckBtn.innerText = `${Math.floor(luckUpgradePrice)} RP`;
        }
    }

    // КЛИК И ЧИСЛА
    document.getElementById("click-target").addEventListener("click", function (event) {
        let currentGain = clickPower;
        let isCrit = false;
        
        if (luckLevel > 0) {
            let chance = luckLevel * 0.05; 
            if (Math.random() < chance) {
                currentGain *= 5;
                isCrit = true;
                balanceDisplay.style.color = "#ffffff";
                setTimeout(() => balanceDisplay.style.color = "#39ff14", 150);
            }
        }
        
        balance += currentGain;
        createParticle(event.clientX, event.clientY, currentGain, isCrit);
        updateUI();
    });

    function createParticle(x, y, amount, isCrit) {
        const particle = document.createElement("div");
        particle.className = isCrit ? "click-particle crit" : "click-particle";
        particle.innerText = `+${amount}`;
        particle.style.left = `${x - 15}px`;
        particle.style.top = `${y - 15}px`;
        particlesContainer.appendChild(particle);
        setTimeout(() => { particle.remove(); }, 800);
    }

    // ЛОГИКА ПРОМОКОДОВ
    window.activatePromo = function() {
        const input = document.getElementById("promo-input");
        const msg = document.getElementById("code-status-msg");
        const enteredCode = input.value.trim();

        if (enteredCode === "") return;

        if (enteredCode === "KODTest0110") {
            if (usedCodes.includes("KODTest0110")) {
                msg.style.color = "#ff3333";
                msg.innerText = "ЭТОТ КОД УЖЕ АКТИВИРОВАН!";
            } else {
                balance += 1000000;
                usedCodes.push("KODTest0110");
                msg.style.color = "#39ff14";
                msg.innerText = "ЧИТ-КОД АКТИВИРОВАН! +1,000,000 RP";
                updateUI();
            }
        } else {
            msg.style.color = "#ff3333";
            msg.innerText = "НЕВЕРНЫЙ КОД!";
        }

        input.value = ""; 
        setTimeout(() => { msg.innerText = ""; }, 3000); 
    };

    // АПГРЕЙДЫ
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

    // ВЫВОД СРЕДСТВ И ТРОЛЛИНГ
    window.startWithdraw = function(rbxAmount, rpCost) {
        if (balance < rpCost) {
            alert(`Недостаточно RoPoints! Нужно еще ${rpCost - Math.floor(balance)} RP.`);
            return;
        }

        document.getElementById("withdraw-menu").classList.remove('active');

        const loader = document.getElementById("loader-modal");
        const loaderText = document.getElementById("loader-text");
        const closeBtn = document.getElementById("loader-close-btn");
        const spinner = document.querySelector(".spinner");

        loader.classList.remove("hidden");
        spinner.classList.remove("hidden");
        closeBtn.classList.add("hidden");
        loaderText.innerText = `Инициализация вывода ${rbxAmount} RBX через сервера Roblox API...`;

        setTimeout(() => { loaderText.innerText = "Авторизация сессии... Проверка хэша транзакции..."; }, 2000);
        setTimeout(() => { loaderText.innerText = "Подключение к пулу ликвидности... Синхронизация блоков..."; }, 4500);
        
        setTimeout(() => {
            spinner.classList.add("hidden");
            
            balance = 0;
            updateUI();

            loaderText.innerHTML = `
                <span style="color:#39ff14; font-size: 26px; font-weight:bold; text-shadow: 0 0 10px #39ff14;">ХА-ХА! >:D</span><br><br>
                <span style="color:#ffffff; font-size:15px;">Мы реально <strong>забрали твои очки</strong>, но робуксы мы тебе не дадим!</span><br><br>
                <span style="color:#ff3333; font-weight:bold;">Твой баланс успешно обнулен.</span><br><br>
                Никакого вывода не существует, ведь сайт шуточный! Спасибо за RoPoints, иди кликай заново!
            `;
            closeBtn.classList.remove("hidden");
        }, 7000);
    };

    window.closeLoader = function() {
        document.getElementById("loader-modal").classList.add("hidden");
    };

    updateUI();
});
