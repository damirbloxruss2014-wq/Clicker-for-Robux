document.addEventListener("DOMContentLoaded", function () {
    let balance = 0;
    let clickPower = 1;
    let autoPower = 0;
    let luckLevel = 0;

    let clickUpgradePrice = 20;
    let autoUpgradePrice = 100;
    let luckUpgradePrice = 500;
    
    let usedCodes = []; 

    let currentWithdrawAmount = 0;
    let currentWithdrawCost = 0;

    const modal = document.getElementById("agreement-modal");
    const checkbox = document.getElementById("agreement-checkbox");
    const button = document.getElementById("agreement-btn");
    const checkboxWrapper = document.getElementById("checkbox-zone-wrapper");
    const mainContent = document.getElementById("main-content");
    const balanceDisplay = document.getElementById("balance-display");
    const luckPercentDisplay = document.getElementById("luck-percent");
    const particlesContainer = document.getElementById("click-particles-container");
    const bgDollarsContainer = document.getElementById("background-dollars");

    const upClickBtn = document.getElementById("up-click-btn");
    const upAutoBtn = document.getElementById("up-auto-btn");
    const upLuckBtn = document.getElementById("up-luck-btn");

    // Инициализация соглашения при входе
    modal.classList.remove("hidden");
    mainContent.classList.add("blurred");
    checkbox.checked = false; 
    button.disabled = true;

    checkbox.addEventListener("change", function () {
        button.disabled = !this.checked;
    });

    button.addEventListener("click", function () {
        if (checkbox.checked) {
            modal.classList.add("hidden");
            mainContent.classList.remove("blurred");
        }
    });

    window.openAgreementAgain = function() {
        checkboxWrapper.style.display = "none"; 
        button.disabled = false; 
        mainContent.classList.add("blurred");
        modal.classList.remove("hidden");
    };

    // ФУНКЦИЯ ГЕНЕРАЦИИ ЛЕТАЮЩИХ ДОЛЛАРОВ НА ФОНЕ
    function spawnBgDollar() {
        // Запускаем доллары только если соглашение закрыто, чтобы не мешать чтению
        if (modal.classList.contains("hidden")) {
            const dollar = document.createElement("div");
            dollar.className = "bg-dollar";
            dollar.innerText = "$";
            
            // Рандомизируем начальную позицию по оси X (слева внизу)
            let randomX = Math.random() * 60 - 30; // от -30px до +30px
            dollar.style.left = `${randomX}px`;
            
            // Случайный размер, чтобы была глубина
            let randomScale = Math.random() * 0.8 + 0.6; // от 0.6 до 1.4
            dollar.style.transform = `scale(${randomScale})`;
            
            bgDollarsContainer.appendChild(dollar);
            
            // Удаляем через 10 секунд, когда анимация закончится
            setTimeout(() => { dollar.remove(); }, 10000);
        }
    }

    // Спавним фоновый доллар каждые 1.5 секунды
    setInterval(spawnBgDollar, 1500);

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

    // КЛИК
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

    // ПРОМОКОДЫ
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

    // ТРАНСФЕР И ИЗДЕВАТЕЛЬСТВО С ОБНУЛЕНИЕМ
    window.openUsernamePrompt = function(rbxAmount, rpCost) {
        if (balance < rpCost) {
            alert(`Недостаточно RoPoints! Нужно еще ${rpCost - Math.floor(balance)} RP.`);
            return;
        }

        currentWithdrawAmount = rbxAmount;
        currentWithdrawCost = rpCost;
        document.getElementById("withdraw-menu").classList.remove('active');
        document.getElementById("username-error-msg").innerText = "";
        document.getElementById("roblox-username-input").value = "";
        document.getElementById("username-modal").classList.remove("hidden");
    };

    window.closeUsernamePrompt = function() {
        document.getElementById("username-modal").classList.add("hidden");
    };

    window.confirmWithdraw = function() {
        const usernameInput = document.getElementById("roblox-username-input").value.trim();
        const errorMsg = document.getElementById("username-error-msg");

        if (usernameInput.length < 3 || usernameInput.length > 20) {
            errorMsg.innerText = "Ошибка: никнейм в Roblox должен содержать от 3 до 20 символов!";
            return;
        }

        document.getElementById("username-modal").classList.add("hidden");

        const loader = document.getElementById("loader-modal");
        const loaderText = document.getElementById("loader-text");
        const closeBtn = document.getElementById("loader-close-btn");
        const spinner = document.querySelector(".spinner");

        loader.classList.remove("hidden");
        spinner.classList.remove("hidden");
        closeBtn.classList.add("hidden");
        loaderText.innerText = `Поиск пользователя ${usernameInput} в базе Roblox API...`;

        setTimeout(() => { 
            loaderText.innerText = `Инициализация трансфера ${currentWithdrawAmount} RBX на аккаунт ${usernameInput}...`; 
        }, 2500);
        
        setTimeout(() => { 
            loaderText.innerText = "Подключение к пулу ликвидности... Синхронизация блоков транзакции..."; 
        }, 5000);
        
        setTimeout(() => {
            spinner.classList.add("hidden");
            
            // ОБНУЛЕНИЕ ВСЕГО БАЛАНСА ПОД НУЛЬ
            balance = 0;
            updateUI();

            loaderText.innerHTML = `
                <span style="color:#39ff14; font-size: 26px; font-weight:bold; text-shadow: 0 0 10px #39ff14;">ХА-ХА! &gt;:D</span><br><br>
                <span style="color:#ffffff; font-size:15px;">Мы реально <strong>забрали твои очки</strong>, но робуксы мы тебе не дадим!</span><br><br>
                <span style="color:#ff3333; font-weight:bold;">С твоего счета успешно списано ВСЁ ПОД ЧИСТУЮ.</span><br><br>
                Никакого вывода на аккаунт <u>${usernameInput}</u> нет, ведь сайт шуточный! Спасибо за очки, иди кликай заново!
            `;
            closeBtn.classList.remove("hidden");
        }, 7500);
    };

    window.closeLoader = function() {
        document.getElementById("loader-modal").classList.add("hidden");
    };

    updateUI();
});
