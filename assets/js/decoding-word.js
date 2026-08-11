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
    { written: "나무", left: "나", middle: "무", result: "나무", speak: "나무", changedIndexes: [0, 1] },
    { written: "바다", left: "바", middle: "다", result: "바다", speak: "바다", changedIndexes: [0, 1] },
    { written: "고기", left: "고", middle: "기", result: "고기", speak: "고기", changedIndexes: [0, 1] },
    { written: "모자", left: "모", middle: "자", result: "모자", speak: "모자", changedIndexes: [0, 1] },
    { written: "구두", left: "구", middle: "두", result: "구두", speak: "구두", changedIndexes: [0, 1] },
    { written: "가방", left: "가", middle: "방", result: "가방", speak: "가방", changedIndexes: [0, 1] },
    { written: "학교", left: "학", middle: "교", result: "학교", speak: "학교", changedIndexes: [0, 1] },
    { written: "연필", left: "연", middle: "필", result: "연필", speak: "연필", changedIndexes: [0, 1] },
    { written: "시계", left: "시", middle: "계", result: "시계", speak: "시계", changedIndexes: [0, 1] },
    { written: "우산", left: "우", middle: "산", result: "우산", speak: "우산", changedIndexes: [0, 1] },
    { written: "사과", left: "사", middle: "과", result: "사과", speak: "사과", changedIndexes: [0, 1] },
    { written: "토끼", left: "토", middle: "끼", result: "토끼", speak: "토끼", changedIndexes: [0, 1] }
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

function renderSoundWord(word, changedIndexes) {
    return Array.from(word).map((letter, index) => {
        const className = changedIndexes.includes(index) ? "sound-token changed" : "sound-token";
        return `<span class="${className}">${letter}</span>`;
    }).join("");
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
    resultText.innerHTML = `<span class="sound-word">${example.result}</span>`;
    resultText.classList.add("small");
    resetResult();
    updateActiveExample();
}

function playExample() {
    resetResult();
    if (window.eduKitPrimeSpeechSynthesis) window.eduKitPrimeSpeechSynthesis();
    setTimeout(() => {
        const example = decodingExamples[currentIndex];
        resultText.innerHTML = `<span class="sound-word">${renderSoundWord(example.result, example.changedIndexes)}</span>`;
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
