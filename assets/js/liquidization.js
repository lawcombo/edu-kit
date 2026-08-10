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

const liquidizationExamples = [
    { written: "신라", changed: "실라", changedIndexes: [0] },
    { written: "난로", changed: "날로", changedIndexes: [0] },
    { written: "천리", changed: "철리", changedIndexes: [0] },
    { written: "분리", changed: "불리", changedIndexes: [0] },
    { written: "논리", changed: "놀리", changedIndexes: [0] },
    { written: "권력", changed: "궐력", changedIndexes: [0] },
    { written: "연락", changed: "열락", changedIndexes: [0] },
    { written: "전라도", changed: "절라도", changedIndexes: [0] },
    { written: "물난리", changed: "물랄리", changedIndexes: [1] },
    { written: "칼날", changed: "칼랄", changedIndexes: [1] },
    { written: "달나라", changed: "달라라", changedIndexes: [1] },
    { written: "실내", changed: "실래", changedIndexes: [1] }
];

const $ = (selector) => document.querySelector(selector);

const infoScreen = $("#infoScreen");
const practiceScreen = $("#practiceScreen");
const exampleList = $("#exampleList");
const writtenWord = $("#writtenWord");
const resultWord = $("#resultWord");

let currentIndex = 0;
let animationTimers = [];

function clearAnimationTimers() {
    animationTimers.forEach((timerId) => clearTimeout(timerId));
    animationTimers = [];
}

function setActiveScreen(screenName) {
    infoScreen.classList.toggle("active", screenName === "info");
    practiceScreen.classList.toggle("active", screenName === "practice");
}

function resetAnimation() {
    clearAnimationTimers();
    if (window.eduKitCancelSpeech) window.eduKitCancelSpeech();
    resultWord.classList.remove("revealed");
    resultWord.innerHTML = "";
}

function renderExampleList() {
    exampleList.innerHTML = liquidizationExamples.map((example, index) => (
        `<button class="word-item" type="button" data-index="${index}">${example.written}</button>`
    )).join("");

    exampleList.addEventListener("click", (event) => {
        const button = event.target.closest(".word-item");
        if (!button) return;
        setExample(Number(button.dataset.index));
    });
}

function updateActiveExample() {
    document.querySelectorAll(".word-item").forEach((button, index) => {
        button.classList.toggle("active", index === currentIndex);
    });
}

function setExample(index) {
    currentIndex = (index + liquidizationExamples.length) % liquidizationExamples.length;
    const example = liquidizationExamples[currentIndex];

    writtenWord.textContent = example.written;

    resetAnimation();
    updateActiveExample();
}

function playExample() {
    resetAnimation();
    if (window.eduKitPrimeSpeechSynthesis) window.eduKitPrimeSpeechSynthesis();

    animationTimers.push(setTimeout(() => {
        const example = liquidizationExamples[currentIndex];
        const changedIndexes = new Set(example.changedIndexes || []);
        resultWord.innerHTML = Array.from(example.changed).map((char, index) => {
            const className = changedIndexes.has(index) ? " class=\"changed-letter\"" : "";
            return `<span${className}>${char}</span>`;
        }).join("");
        resultWord.classList.add("revealed");
        if (window.eduKitSpeakText) window.eduKitSpeakText(example.changed);
    }, 180));
}

function goNextExample() {
    setExample(currentIndex + 1);
}

function goPrevExample() {
    setExample(currentIndex - 1);
}

$("#btnBackHome").addEventListener("click", () => {
    sessionStorage.setItem("eduKitReturnToPhonology", "1");
    window.location.href = "index.html";
});

$("#btnStartPractice").addEventListener("click", () => {
    setActiveScreen("practice");
    setExample(currentIndex);
});

$("#btnBackInfo").addEventListener("click", () => {
    setActiveScreen("info");
    resetAnimation();
});

$("#btnToggleLiquidizationList").addEventListener("click", (event) => {
    const practiceLayout = $("#liquidizationPracticeLayout");
    const isOpen = practiceLayout.classList.toggle("list-open");
    event.currentTarget.setAttribute("aria-expanded", isOpen ? "true" : "false");
    event.currentTarget.querySelector(".toggle-label").textContent = isOpen ? "목록닫기" : "연습목록";
});

$("#btnPlay").addEventListener("click", playExample);
$("#btnPrev").addEventListener("click", goPrevExample);
$("#btnNext").addEventListener("click", goNextExample);

renderExampleList();
setExample(0);

(function() {
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

    function blockEvent(event) {
        if (!event) return false;
        event.preventDefault();
        event.stopPropagation();
        return false;
    }

    ensureGuardElements();

    document.addEventListener("contextmenu", blockEvent, true);
    document.addEventListener("selectstart", blockEvent, true);
    document.addEventListener("dragstart", blockEvent, true);

    document.addEventListener("copy", (event) => {
        showGuard();
        return blockEvent(event);
    }, true);

    document.addEventListener("cut", (event) => {
        showGuard();
        return blockEvent(event);
    }, true);

    document.addEventListener("keydown", (event) => {
        const key = (event.key || "").toLowerCase();
        const code = (event.code || "").toLowerCase();

        const isPrintScreen = key === "printscreen" || code === "printscreen";
        const isSave = (event.ctrlKey || event.metaKey) && key === "s";
        const isPrint = (event.ctrlKey || event.metaKey) && key === "p";
        const isDevTool = key === "f12" || ((event.ctrlKey || event.metaKey) && event.shiftKey && ["i", "j", "c"].includes(key));

        if (isPrintScreen || isSave || isPrint || isDevTool) {
            showGuard();
            return blockEvent(event);
        }
    }, true);

    document.addEventListener("keyup", (event) => {
        const key = (event.key || "").toLowerCase();
        const code = (event.code || "").toLowerCase();
        if (key === "printscreen" || code === "printscreen") {
            showGuard();
        }
    }, true);

    window.addEventListener("blur", showGuard);
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) showGuard();
    });

    window.addEventListener("focus", () => {});
    document.addEventListener("pointerdown", hideGuard, true);
    document.addEventListener("keydown", (event) => {
        if (guardActive && (event.key === "Enter" || event.key === "Escape" || event.key === " ")) {
            hideGuard();
        }
    }, true);
})();
