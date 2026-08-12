function redirectSentenceRefreshToLearningType() {
    const navigationEntry = window.performance &&
        window.performance.getEntriesByType &&
        window.performance.getEntriesByType("navigation")[0];
    const isReload = navigationEntry ?
        navigationEntry.type === "reload" :
        window.performance && window.performance.navigation && window.performance.navigation.type === 1;

    if (!isReload) return;
    sessionStorage.setItem("eduKitRefreshToLearningType", "1");
    window.location.replace("index.html");
}

redirectSentenceRefreshToLearningType();

function setupSentencePractice(examples, successMessage) {
    const $ = (selector) => document.querySelector(selector);
    const infoScreen = $("#infoScreen");
    const practiceScreen = $("#practiceScreen");
    const practiceLayout = $("#practiceLayout");
    const exampleList = $("#exampleList");
    const sentenceText = $("#sentenceText");
    const sceneEmoji = $("#sceneEmoji");
    const sceneLabel = $("#sceneLabel");
    const questionText = $("#questionText");
    const choiceGrid = $("#choiceGrid");
    const feedbackText = $("#feedbackText");
    let currentIndex = 0;

    function setActiveScreen(screenName) {
        infoScreen.classList.toggle("active", screenName === "info");
        practiceScreen.classList.toggle("active", screenName === "practice");
    }

    function speak(text) {
        if (window.eduKitPrimeSpeechSynthesis) window.eduKitPrimeSpeechSynthesis();
        if (window.eduKitSpeakText) window.eduKitSpeakText(text);
    }

    function getChoiceValue(choice) {
        return typeof choice === "string" ? choice : choice.text;
    }

    function renderChoice(choice) {
        const text = getChoiceValue(choice);
        const emoji = typeof choice === "object" && choice.emoji ?
            `<span class="choice-emoji">${choice.emoji}</span>` :
            "";
        return `<button class="choice-card" type="button" data-value="${text}">${emoji}<span>${text}</span></button>`;
    }

    function resetFeedback() {
        feedbackText.className = "feedback";
        feedbackText.textContent = "실행을 누르거나 알맞은 보기를 골라요";
        choiceGrid.querySelectorAll(".choice-card").forEach((button) => {
            button.classList.remove("correct", "wrong");
        });
    }

    function renderList() {
        exampleList.innerHTML = examples.map((item, index) => (
            `<button class="word-item" type="button" data-index="${index}">${item.title || item.sentence}</button>`
        )).join("");
    }

    function updateList() {
        exampleList.querySelectorAll(".word-item").forEach((button, index) => {
            button.classList.toggle("active", index === currentIndex);
        });
    }

    function choose(value, button) {
        const item = examples[currentIndex];
        choiceGrid.querySelectorAll(".choice-card").forEach((choice) => {
            choice.classList.remove("correct", "wrong");
            if (choice.dataset.value === item.answer) choice.classList.add("correct");
        });

        if (value === item.answer) {
            feedbackText.className = "feedback good";
            feedbackText.textContent = successMessage;
            speak("정답입니다.");
            return;
        }

        if (button) button.classList.add("wrong");
        feedbackText.className = "feedback try";
        feedbackText.textContent = "틀렸습니다.";
        speak("틀렸습니다.");
    }

    function setExample(index) {
        currentIndex = (index + examples.length) % examples.length;
        const item = examples[currentIndex];
        sentenceText.textContent = item.sentence;
        sceneEmoji.textContent = item.emoji;
        sceneLabel.textContent = item.label;
        questionText.textContent = item.question;
        choiceGrid.innerHTML = item.choices.map(renderChoice).join("");
        resetFeedback();
        updateList();
    }

    $("#btnBackHome").addEventListener("click", () => {
        sessionStorage.setItem("eduKitReturnToSentenceComprehension", "1");
        window.location.href = "index.html";
    });
    $("#btnStartPractice").addEventListener("click", () => setActiveScreen("practice"));
    $("#btnBackInfo").addEventListener("click", () => setActiveScreen("info"));
    $("#btnToggleList").addEventListener("click", (event) => {
        const isOpen = practiceLayout.classList.toggle("list-open");
        event.currentTarget.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    $("#btnPlay").addEventListener("click", () => {
        const item = examples[currentIndex];
        speak(item.speak || `${item.sentence} ${item.question}`);
    });
    $("#btnPrev").addEventListener("click", () => setExample(currentIndex - 1));
    $("#btnNext").addEventListener("click", () => setExample(currentIndex + 1));
    exampleList.addEventListener("click", (event) => {
        const button = event.target.closest(".word-item");
        if (!button) return;
        setExample(Number(button.dataset.index));
    });
    choiceGrid.addEventListener("click", (event) => {
        const button = event.target.closest(".choice-card");
        if (!button) return;
        choose(button.dataset.value, button);
    });

    renderList();
    setExample(0);
    installSentenceGuard();
}

function installSentenceGuard() {
    const GUARD_MESSAGE = "화면 캡처가 감지되어 화면을 보호합니다.";
    let guardActive = false;

    function ensureGuardElements() {
        if (document.getElementById("captureGuardOverlay")) return;
        const overlay = document.createElement("div");
        overlay.id = "captureGuardOverlay";
        overlay.setAttribute("aria-hidden", "true");
        overlay.innerHTML = '<div class="capture-guard-box"><div class="capture-guard-title">화면 보호 중</div><p class="capture-guard-text">' + GUARD_MESSAGE + '<br>다시 화면을 클릭하면 보호가 해제됩니다.</p></div>';
        document.body.appendChild(overlay);
    }

    function showGuard() {
        ensureGuardElements();
        const overlay = document.getElementById("captureGuardOverlay");
        if (!overlay) return;
        guardActive = true;
        document.documentElement.classList.add("capture-guard-active");
        document.body.classList.add("capture-guard-active");
        overlay.classList.add("active");
    }

    function hideGuard() {
        const overlay = document.getElementById("captureGuardOverlay");
        if (!overlay || !guardActive) return;
        guardActive = false;
        overlay.classList.remove("active");
        document.documentElement.classList.remove("capture-guard-active");
        document.body.classList.remove("capture-guard-active");
    }

    ensureGuardElements();
    window.addEventListener("blur", showGuard);
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) showGuard();
    });
    document.addEventListener("keyup", (event) => {
        const key = (event.key || "").toLowerCase();
        const code = (event.code || "").toLowerCase();
        if (key === "printscreen" || code === "printscreen") showGuard();
    });
    document.addEventListener("pointerdown", hideGuard, true);
}
