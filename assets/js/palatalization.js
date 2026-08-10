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

const palatalizationExamples = [
    { written: "굳히다", writtenSound: "굳히다", ruleBefore: "ㄷ + 히", ruleAfter: "치", sound: "구치다" },
    { written: "닫히다", writtenSound: "닫히다", ruleBefore: "ㄷ + 히", ruleAfter: "치", sound: "다치다" },
    { written: "묻히다", writtenSound: "묻히다", ruleBefore: "ㄷ + 히", ruleAfter: "치", sound: "무치다" },
    { written: "받히다", writtenSound: "받히다", ruleBefore: "ㄷ + 히", ruleAfter: "치", sound: "바치다" },
    { written: "굳이", writtenSound: "굳이", ruleBefore: "ㄷ + 이", ruleAfter: "지", sound: "구지" },
    { written: "곧이", writtenSound: "곧이", ruleBefore: "ㄷ + 이", ruleAfter: "지", sound: "고지" },
    { written: "해돋이", writtenSound: "해돋이", ruleBefore: "ㄷ + 이", ruleAfter: "지", sound: "해도지" },
    { written: "미닫이", writtenSound: "미닫이", ruleBefore: "ㄷ + 이", ruleAfter: "지", sound: "미다지" },
    { written: "같이", writtenSound: "같이", ruleBefore: "ㅌ + 이", ruleAfter: "치", sound: "가치" },
    { written: "붙이다", writtenSound: "붙이다", ruleBefore: "ㅌ + 이", ruleAfter: "치", sound: "부치다" },
    { written: "끝이", writtenSound: "끝이", ruleBefore: "ㅌ + 이", ruleAfter: "치", sound: "끄치" },
    { written: "밭이", writtenSound: "밭이", ruleBefore: "ㅌ + 이", ruleAfter: "치", sound: "바치" }
];

const $ = (selector) => document.querySelector(selector);

const infoScreen = $("#infoScreen");
const practiceScreen = $("#practiceScreen");
const exampleList = $("#exampleList");
const writtenWord = $("#writtenWord");
const writtenSound = $("#writtenSound");
const ruleBefore = $("#ruleBefore");
const ruleAfter = $("#ruleAfter");
const soundBefore = $("#soundBefore");
const soundAfter = $("#soundAfter");

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

function setLongTextClass(element, text) {
    element.classList.toggle("long-part", text.length > 2);
}

function resetAnimation() {
    clearAnimationTimers();
    if (window.eduKitCancelSpeech) window.eduKitCancelSpeech();
    soundBefore.classList.remove("hidden");
    soundAfter.classList.remove("revealed");
}

function renderExampleList() {
    exampleList.innerHTML = palatalizationExamples.map((example, index) => (
        `<button class="word-item" type="button" data-index="${index}">${example.written}</button>`
    )).join("");
}

function updateActiveExample() {
    document.querySelectorAll(".word-item").forEach((button, index) => {
        button.classList.toggle("active", index === currentIndex);
    });
}

function setExample(index) {
    currentIndex = (index + palatalizationExamples.length) % palatalizationExamples.length;
    const example = palatalizationExamples[currentIndex];

    writtenWord.textContent = example.written;
    writtenSound.textContent = example.writtenSound;
    ruleBefore.textContent = example.ruleBefore;
    ruleAfter.textContent = example.ruleAfter;
    soundBefore.textContent = "?";
    soundAfter.textContent = example.sound;

    setLongTextClass(writtenSound, example.writtenSound);
    setLongTextClass(soundAfter, example.sound);
    resetAnimation();
    updateActiveExample();
}

function playExample() {
    resetAnimation();
    if (window.eduKitPrimeSpeechSynthesis) window.eduKitPrimeSpeechSynthesis();

    animationTimers.push(setTimeout(() => {
        soundBefore.classList.add("hidden");
    }, 140));

    animationTimers.push(setTimeout(() => {
        const example = palatalizationExamples[currentIndex];
        soundAfter.classList.add("revealed");
        if (window.eduKitSpeakText) window.eduKitSpeakText(example.sound);
    }, 360));
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

exampleList.addEventListener("click", (event) => {
    const button = event.target.closest(".word-item");
    if (!button) return;
    setExample(Number(button.dataset.index));
});

$("#btnTogglePalatalizationList").addEventListener("click", (event) => {
    const practiceLayout = $("#palatalizationPracticeLayout");
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
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText("화면 캡처는 허용되지 않습니다.").catch(() => {});
            }
            return blockEvent(event);
        }
    }, true);

    window.addEventListener("blur", showGuard);

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) showGuard();
    });

    document.addEventListener("pointerdown", (event) => {
        if (!guardActive) return;
        hideGuard();
        return blockEvent(event);
    });
})();
