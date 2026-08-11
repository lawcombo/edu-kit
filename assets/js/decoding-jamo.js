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

const decodingExamples = [
    { written: "ㄱ", left: "ㄱ", middle: "기역", result: "그", speak: "그" },
    { written: "ㄴ", left: "ㄴ", middle: "니은", result: "느", speak: "느" },
    { written: "ㄷ", left: "ㄷ", middle: "디귿", result: "드", speak: "드" },
    { written: "ㄹ", left: "ㄹ", middle: "리을", result: "르", speak: "르" },
    { written: "ㅁ", left: "ㅁ", middle: "미음", result: "므", speak: "므" },
    { written: "ㅂ", left: "ㅂ", middle: "비읍", result: "브", speak: "브" },
    { written: "ㅅ", left: "ㅅ", middle: "시옷", result: "스", speak: "스" },
    { written: "ㅇ", left: "ㅇ", middle: "이응", result: "응", speak: "응" },
    { written: "ㅈ", left: "ㅈ", middle: "지읒", result: "즈", speak: "즈" },
    { written: "ㅊ", left: "ㅊ", middle: "치읓", result: "츠", speak: "츠" },
    { written: "ㅋ", left: "ㅋ", middle: "키읔", result: "크", speak: "크" },
    { written: "ㅌ", left: "ㅌ", middle: "티읕", result: "트", speak: "트" },
    { written: "ㅍ", left: "ㅍ", middle: "피읖", result: "프", speak: "프" },
    { written: "ㅎ", left: "ㅎ", middle: "히읗", result: "흐", speak: "흐" },
    { written: "ㅏ", left: "ㅏ", middle: "모음", result: "아", speak: "아" },
    { written: "ㅓ", left: "ㅓ", middle: "모음", result: "어", speak: "어" },
    { written: "ㅗ", left: "ㅗ", middle: "모음", result: "오", speak: "오" },
    { written: "ㅜ", left: "ㅜ", middle: "모음", result: "우", speak: "우" },
    { written: "ㅡ", left: "ㅡ", middle: "모음", result: "으", speak: "으" },
    { written: "ㅣ", left: "ㅣ", middle: "모음", result: "이", speak: "이" }
];

const $ = (selector) => document.querySelector(selector);
const infoScreen = $("#infoScreen");
const practiceScreen = $("#practiceScreen");
const exampleList = $("#exampleList");
const writtenWord = $("#writtenWord");
const leftText = $("#leftText");
const middleText = $("#middleText");
const resultText = $("#resultText");
let currentIndex = 0;

function setActiveScreen(screenName) {
    infoScreen.classList.toggle("active", screenName === "info");
    practiceScreen.classList.toggle("active", screenName === "practice");
}

function resetResult() {
    if (window.eduKitCancelSpeech) window.eduKitCancelSpeech();
    resultText.classList.remove("changed");
}

function renderExampleList() {
    exampleList.innerHTML = decodingExamples.map((example, index) => (
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
    currentIndex = (index + decodingExamples.length) % decodingExamples.length;
    const example = decodingExamples[currentIndex];

    writtenWord.textContent = example.written;
    leftText.textContent = example.left;
    middleText.textContent = example.middle;
    resultText.textContent = example.result;
    middleText.classList.toggle("small", example.middle.length > 1);
    resultText.classList.toggle("small", example.result.length > 1);
    resetResult();
    updateActiveExample();
}

function playExample() {
    resetResult();
    if (window.eduKitPrimeSpeechSynthesis) window.eduKitPrimeSpeechSynthesis();

    setTimeout(() => {
        const example = decodingExamples[currentIndex];
        resultText.classList.add("changed");
        if (window.eduKitSpeakText) window.eduKitSpeakText(example.speak);
    }, 180);
}

function goNextExample() {
    setExample(currentIndex + 1);
}

function goPrevExample() {
    setExample(currentIndex - 1);
}

$("#btnBackHome").addEventListener("click", () => {
    sessionStorage.setItem("eduKitReturnToDecoding", "1");
    window.location.href = "index.html";
});

$("#btnStartPractice").addEventListener("click", () => {
    setActiveScreen("practice");
    setExample(currentIndex);
});

$("#btnBackInfo").addEventListener("click", () => {
    setActiveScreen("info");
    resetResult();
});

$("#btnToggleList").addEventListener("click", (event) => {
    const practiceLayout = $("#practiceLayout");
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

    ensureGuardElements();
    window.addEventListener("blur", showGuard);
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) showGuard();
    });
    document.addEventListener("keyup", (event) => {
        if (event.key === "PrintScreen") showGuard();
    });
    document.addEventListener("click", hideGuard, true);
    document.addEventListener("touchstart", hideGuard, true);
})();
