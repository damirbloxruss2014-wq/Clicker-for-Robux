document.addEventListener("DOMContentLoaded", function () {
    let balance = 0;
    let clickPower = 1;
    let autoPower = 0;
    let luckLevel = 0;

    let clickUpgradePrice = 20;
    let autoUpgradePrice = 100;
    let luckUpgradePrice = 500;
    
    let usedCodes = []; 
    let realityMode = false; 

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

    function spawnBgDollar() {
        if (modal.classList.contains("hidden")) {
            const dollar = document.createElement("div");
            dollar.className = "bg-dollar";
            dollar.innerText = "$";
            let randomLeft = Math.random() * 100;
            dollar.style.left = randomLeft + "vw";
            let randomScale = Math.random() * 1.2 + 0.4; 
            dollar.style.transform = "scale(" + randomScale + ")";
            let randomDuration = Math.random() * 7 + 6;
            dollar.style.animationDuration = randomDuration + "s";
            dollar.style.opacity = Math.random() * 0.15 + 0.05; 
            bgDollarsContainer.appendChild(dollar);
            setTimeout(function() { dollar.remove(); }, randomDuration * 1000);
        }
    }
    setInterval(spawnBgDollar, 1200);
    function updateUI() {
        balanceDisplay.innerText = String(Math.floor(balance)).padStart(6, '0');
        upClickBtn.innerText = Math.floor(clickUpgradePrice) + " RP";
        upAutoBtn.innerText = Math.floor(autoUpgradePrice) + " RP";
        let currentChance = luckLevel * 5;
        luckPercentDisplay.innerText = currentChance + "%";
        if (luckLevel >= 10) {
            upLuckBtn.innerText = "МАКС.";
            upLuckBtn.disabled = true;
        } else {
            upLuckBtn.innerText = Math.floor(luckUpgradePrice) + " RP";
        }
    }

    document.getElementById("click-target").addEventListener("click", function (event) {
        let currentGain = clickPower;
        let isCrit = false;
        if (luckLevel > 0) {
            let chance = luckLevel * 0.05; 
            if (Math.random() < chance) {
                currentGain *= 5;
                isCrit = true;
                balanceDisplay.style.color = "#ffffff";
                setTimeout(function() { balanceDisplay.style.color = "#39ff14"; }, 150);
            }
        }
        balance += currentGain;
        createParticle(event.clientX, event.clientY, currentGain, isCrit);
        updateUI();
    });

    function createParticle(x, y, amount, isCrit) {
        const particle = document.createElement("div");
        particle.className = isCrit ? "click-particle crit" : "click-particle";
        particle.innerText = "+" + amount;
        particle.style.left = (x - 15) + "px";
        particle.style.top = (y - 15) + "px";
        particlesContainer.appendChild(particle);
        setTimeout(function() { particle.remove(); }, 800);
    }

    window.activatePromo = function() {
        const input = document.getElementById("promo-input");
        const msg = document.getElementById("code-status-msg");
        const enteredCode = input.value.trim();
        if (enteredCode === "") return;
        if (usedCodes.includes(enteredCode)) {
            msg.style.color = "#ff3333";
            msg.innerText = "ЭТОТ КОД УЖЕ АКТИВИРОВАН!";
            input.value = "";
            setTimeout(function() { msg.innerText = ""; }, 3000);
            return;
        }
        if (enteredCode === "KODTest0110") {
            balance += 1000000;
            usedCodes.push("KODTest0110");
            msg.style.color = "#39ff14";
            msg.innerText = "ЧИТ-КОД АКТИВИРОВАН! +1,000,000 RP";
            updateUI();
        } 
        else if (enteredCode === "newbie") {
            balance += 500;
            usedCodes.push("newbie");
            msg.style.color = "#39ff14";
            msg.innerText = "КОД АКТИВИРОВАН! +500 RP";
            updateUI();
        } 
        else if (enteredCode === "IzTT") {
            balance += 1500;
            usedCodes.push("IzTT");
            msg.style.color = "#39ff14";
            msg.innerText = "КОД АКТИВИРОВАН! +1500 RP";
            updateUI();
        } 
        else if (enteredCode === "zamanimTT") {
            balance += 5004;
            usedCodes.push("zamanimTT");
            realityMode = true; 
            msg.style.color = "#39ff14";
            msg.innerText = "БЛОГЕРСКИЙ КОД! +5004 RP (МОД РЕАЛЬНОСТИ)";
            updateUI();
        } 
        else {
            msg.style.color = "#ff3333";
            msg.innerText = "НЕВЕРНЫЙ КОД!";
        }
        input.value = ""; 
        setTimeout(function() { msg.innerText = ""; }, 3000); 
    };
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
        allMenus.forEach(function(menu) {
            if (menu.id !== menuId) menu.classList.remove('active');
        });
        targetMenu.classList.toggle('active');
    };

    window.openUsernamePrompt = function(rbxAmount, rpCost) {
        if (balance < rpCost) {
            alert("Недостаточно RoPoints! Нужно еще " + (rpCost - Math.floor(balance)) + " RP.");
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
        const englishRegex = /^[a-zA-Z0-9_]+$/;

        if (usernameInput.length < 3 || usernameInput.length > 20) {
            errorMsg.innerText = "Ошибка: никнейм должен быть от 3 до 20 символов!";
            return;
        }
        if (!englishRegex.test(usernameInput)) {
            errorMsg.innerText = "Ошибка: никнейм должен быть только НА АНГЛИЙСКОМ!";
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
        loaderText.innerText = "Поиск пользователя " + usernameInput + " в базе Roblox API...";

        setTimeout(function() { 
            loaderText.innerText = "Инициализация трансфера " + currentWithdrawAmount + " RBX на аккаунт " + usernameInput + "..."; 
        }, 2500);
        
        setTimeout(function() { 
            loaderText.innerText = "Подключение к пулу ликвидности... Синхронизация блоков транзакции..."; 
        }, 5000);
        
        setTimeout(function() {
            spinner.classList.add("hidden");
            
            if (realityMode) {
                balance -= currentWithdrawCost; 
                updateUI();
                realityMode = false; 

                loaderText.innerHTML = "УСПЕШНО!<br><br>Заявка на вывод " + currentWithdrawAmount + " RBX одобрена.<br><br>Статус: Отправлено в очередь выплат.<br><br>Робуксы поступят на аккаунт " + usernameInput + " в течение 3-7 рабочих дней.";
                closeBtn.innerText = "ОТЛИЧНО!";
            } else {
                balance = 0; 
                updateUI();

                loaderText.innerHTML = "ХА-ХА! &gt;:D<br><br>Мы реально забрали твои очки, но робуксы мы тебе не дадим!<br><br>С твоего счета успешно списано ВСЁ ПОД ЧИСТУЮ.<br><br>Никакого вывода на аккаунт " + usernameInput + " нет, ведь сайт шуточный! Спасибо за очки, иди кликай заново!";
                closeBtn.innerText = "МНЕ ВСЁ ЯСНО :(";
            }
            closeBtn.classList.remove("hidden");
        }, 7500);
    };

    window.closeLoader = function() {
        document.getElementById("loader-modal").classList.add("hidden");
    };

    updateUI();
});
