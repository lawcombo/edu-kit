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
    { written: "가노", left: "가", middle: "노", result: "가노", speak: "가노", changedIndexes: [0, 1] },
    { written: "미두", left: "미", middle: "두", result: "미두", speak: "미두", changedIndexes: [0, 1] },
    { written: "버감", left: "버", middle: "감", result: "버감", speak: "버감", changedIndexes: [0, 1] },
    { written: "소핀", left: "소", middle: "핀", result: "소핀", speak: "소핀", changedIndexes: [0, 1] },
    { written: "누밥", left: "누", middle: "밥", result: "누밥", speak: "누밥", changedIndexes: [0, 1] },
    { written: "라곤", left: "라", middle: "곤", result: "라곤", speak: "라곤", changedIndexes: [0, 1] },
    { written: "치물", left: "치", middle: "물", result: "치물", speak: "치물", changedIndexes: [0, 1] },
    { written: "하덴", left: "하", middle: "덴", result: "하덴", speak: "하덴", changedIndexes: [0, 1] },
    { written: "도펠", left: "도", middle: "펠", result: "도펠", speak: "도펠", changedIndexes: [0, 1] },
    { written: "구심", left: "구", middle: "심", result: "구심", speak: "구심", changedIndexes: [0, 1] },
    { written: "패론", left: "패", middle: "론", result: "패론", speak: "패론", changedIndexes: [0, 1] },
    { written: "자눔", left: "자", middle: "눔", result: "자눔", speak: "자눔", changedIndexes: [0, 1] }
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
