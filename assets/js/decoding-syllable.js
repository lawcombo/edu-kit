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
    { written: "가", left: "ㄱ", middle: "ㅏ", result: "가", speak: "가" },
    { written: "나", left: "ㄴ", middle: "ㅏ", result: "나", speak: "나" },
    { written: "다", left: "ㄷ", middle: "ㅏ", result: "다", speak: "다" },
    { written: "라", left: "ㄹ", middle: "ㅏ", result: "라", speak: "라" },
    { written: "마", left: "ㅁ", middle: "ㅏ", result: "마", speak: "마" },
    { written: "바", left: "ㅂ", middle: "ㅏ", result: "바", speak: "바" },
    { written: "사", left: "ㅅ", middle: "ㅏ", result: "사", speak: "사" },
    { written: "아", left: "ㅇ", middle: "ㅏ", result: "아", speak: "아" },
    { written: "고", left: "ㄱ", middle: "ㅗ", result: "고", speak: "고" },
    { written: "누", left: "ㄴ", middle: "ㅜ", result: "누", speak: "누" },
    { written: "므", left: "ㅁ", middle: "ㅡ", result: "므", speak: "므" },
    { written: "비", left: "ㅂ", middle: "ㅣ", result: "비", speak: "비" },
    { written: "저", left: "ㅈ", middle: "ㅓ", result: "저", speak: "저" },
    { written: "초", left: "ㅊ", middle: "ㅗ", result: "초", speak: "초" },
    { written: "푸", left: "ㅍ", middle: "ㅜ", result: "푸", speak: "푸" }
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
$("#btnStartPractice").addEventListener("click", () => setActiveScreen("practice"));
$("#btnBackInfo").addEventListener("click", () => {
    setActiveScreen("info");
    resetResult();
});
$("#btnToggleList").addEventListener("click", (event) => {
    const isOpen = $("#practiceLayout").classList.toggle("list-open");
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
