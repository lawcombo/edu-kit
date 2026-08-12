function redirectRefreshToLearningType() {
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

redirectRefreshToLearningType();

(function() {
    const examples = [
        { word: "사과", emoji: "🍎", label: "빨갛고 달콤한 과일", question: "사과는 어느 무리일까요?", answer: "과일", choices: ["과일", "동물", "탈것", "옷"], speak: "사과. 사과는 어느 무리일까요?" },
        { word: "강아지", emoji: "🐶", label: "멍멍 짖는 동물", question: "강아지는 어느 무리일까요?", answer: "동물", choices: ["과일", "동물", "가구", "악기"], speak: "강아지. 강아지는 어느 무리일까요?" },
        { word: "버스", emoji: "🚌", label: "사람을 태우고 가는 차", question: "버스는 어느 무리일까요?", answer: "탈것", choices: ["음식", "탈것", "동물", "옷"], speak: "버스. 버스는 어느 무리일까요?" },
        { word: "의자", emoji: "🪑", label: "앉을 때 쓰는 물건", question: "의자는 어느 무리일까요?", answer: "가구", choices: ["과일", "가구", "탈것", "동물"], speak: "의자. 의자는 어느 무리일까요?" },
        { word: "우유", emoji: "🥛", label: "마시는 음식", question: "우유는 어느 무리일까요?", answer: "음식", choices: ["음식", "옷", "동물", "탈것"], speak: "우유. 우유는 어느 무리일까요?" },
        { word: "양말", emoji: "🧦", label: "발에 신는 옷", question: "양말은 어느 무리일까요?", answer: "옷", choices: ["가구", "음식", "옷", "동물"], speak: "양말. 양말은 어느 무리일까요?" }
    ];

    setupVocabularyPractice(examples, "범주를 잘 찾았어요.");
})();

function setupVocabularyPractice(examples, successMessage) {
    const $ = (selector) => document.querySelector(selector);
    const infoScreen = $("#infoScreen");
    const practiceScreen = $("#practiceScreen");
    const practiceLayout = $("#practiceLayout");
    const exampleList = $("#exampleList");
    const writtenWord = $("#writtenWord");
    const pictureEmoji = $("#pictureEmoji");
    const pictureLabel = $("#pictureLabel");
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

    function resetFeedback() {
        feedbackText.className = "feedback";
        feedbackText.textContent = "실행을 누르거나 알맞은 보기를 골라요";
        choiceGrid.querySelectorAll(".choice-card").forEach((button) => {
            button.classList.remove("correct", "wrong");
        });
    }

    function renderList() {
        exampleList.innerHTML = examples.map((item, index) => (
            `<button class="word-item" type="button" data-index="${index}">${item.word}</button>`
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
            speak("참 잘했어요.");
            return;
        }

        if (button) button.classList.add("wrong");
        feedbackText.className = "feedback try";
        feedbackText.textContent = "다시 한번 선택해보세요.";
        speak("다시 한번 선택해보세요.");
    }

    function setExample(index) {
        currentIndex = (index + examples.length) % examples.length;
        const item = examples[currentIndex];
        writtenWord.textContent = item.word;
        pictureEmoji.textContent = item.emoji;
        pictureLabel.textContent = item.label;
        questionText.textContent = item.question;
        choiceGrid.innerHTML = item.choices.map((choice) => (
            `<button class="choice-card" type="button" data-value="${choice}">${choice}</button>`
        )).join("");
        resetFeedback();
        updateList();
    }

    $("#btnBackHome").addEventListener("click", () => {
        sessionStorage.setItem("eduKitReturnToVocabulary", "1");
        window.location.href = "index.html";
    });
    $("#btnStartPractice").addEventListener("click", () => setActiveScreen("practice"));
    $("#btnBackInfo").addEventListener("click", () => setActiveScreen("info"));
    $("#btnToggleList").addEventListener("click", (event) => {
        const isOpen = practiceLayout.classList.toggle("list-open");
        event.currentTarget.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
    $("#btnPlay").addEventListener("click", () => speak(examples[currentIndex].speak));
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
    installVocabularyGuard();
}

function installVocabularyGuard() {
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
