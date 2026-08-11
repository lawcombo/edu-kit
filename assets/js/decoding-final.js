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
    { written: "각", left: "가", middle: "ㄱ", result: "각", speak: "각" },
    { written: "간", left: "가", middle: "ㄴ", result: "간", speak: "간" },
    { written: "갈", left: "가", middle: "ㄹ", result: "갈", speak: "갈" },
    { written: "감", left: "가", middle: "ㅁ", result: "감", speak: "감" },
    { written: "갑", left: "가", middle: "ㅂ", result: "갑", speak: "갑" },
    { written: "강", left: "가", middle: "ㅇ", result: "강", speak: "강" },
    { written: "목", left: "모", middle: "ㄱ", result: "목", speak: "목" },
    { written: "문", left: "무", middle: "ㄴ", result: "문", speak: "문" },
    { written: "달", left: "다", middle: "ㄹ", result: "달", speak: "달" },
    { written: "밤", left: "바", middle: "ㅁ", result: "밤", speak: "밤" },
    { written: "밥", left: "바", middle: "ㅂ", result: "밥", speak: "밥" },
    { written: "공", left: "고", middle: "ㅇ", result: "공", speak: "공" }
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
