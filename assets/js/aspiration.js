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

const aspirationExamples = [
    { written: "좋고", writtenSound: "좋고", sound: "조코" },
    { written: "좋다", writtenSound: "좋다", sound: "조타" },
    { written: "좋지", writtenSound: "좋지", sound: "조치" },
    { written: "놓고", writtenSound: "놓고", sound: "노코" },
    { written: "놓다", writtenSound: "놓다", sound: "노타" },
    { written: "놓지", writtenSound: "놓지", sound: "노치" },
    { written: "쌓고", writtenSound: "쌓고", sound: "싸코" },
    { written: "쌓다", writtenSound: "쌓다", sound: "싸타" },
    { written: "쌓지", writtenSound: "쌓지", sound: "싸치" },
    { written: "닿고", writtenSound: "닿고", sound: "다코" },
    { written: "닿다", writtenSound: "닿다", sound: "다타" },
    { written: "닿지", writtenSound: "닿지", sound: "다치" },
    { written: "많고", writtenSound: "많고", sound: "만코" },
    { written: "많다", writtenSound: "많다", sound: "만타" },
    { written: "많지", writtenSound: "많지", sound: "만치" },
    { written: "않고", writtenSound: "않고", sound: "안코" },
    { written: "않다", writtenSound: "않다", sound: "안타" },
    { written: "않지", writtenSound: "않지", sound: "안치" },
    { written: "앓고", writtenSound: "앓고", sound: "알코" },
    { written: "앓다", writtenSound: "앓다", sound: "알타" },
    { written: "앓지", writtenSound: "앓지", sound: "알치" },
    { written: "입학", writtenSound: "입학", sound: "이팍" },
    { written: "박하", writtenSound: "박하", sound: "바카" },
    { written: "맏형", writtenSound: "맏형", sound: "마텽" }
];

const $ = (selector) => document.querySelector(selector);

const infoScreen = $("#infoScreen");
const practiceScreen = $("#practiceScreen");
const exampleList = $("#exampleList");
const writtenWord = $("#writtenWord");
const writtenSound = $("#writtenSound");
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
    element.classList.toggle("long-part", text.length > 1);
}

function resetAnimation() {
    clearAnimationTimers();
    soundBefore.classList.remove("hidden");
    soundAfter.classList.remove("revealed");
}

function renderExampleList() {
    exampleList.innerHTML = aspirationExamples.map((example, index) => (
        `<button class="word-item" type="button" data-index="${index}">${example.written}</button>`
    )).join("");
}

function updateActiveExample() {
    document.querySelectorAll(".word-item").forEach((button, index) => {
        button.classList.toggle("active", index === currentIndex);
    });
}

function setExample(index) {
    currentIndex = (index + aspirationExamples.length) % aspirationExamples.length;
    const example = aspirationExamples[currentIndex];

    writtenWord.textContent = example.written;
    writtenSound.textContent = example.writtenSound;
    soundBefore.textContent = "?";
    soundAfter.textContent = example.sound;

    setLongTextClass(writtenSound, example.writtenSound);
    setLongTextClass(soundAfter, example.sound);
    resetAnimation();
    updateActiveExample();
}

function playExample() {
    resetAnimation();

    animationTimers.push(setTimeout(() => {
        soundBefore.classList.add("hidden");
    }, 140));

    animationTimers.push(setTimeout(() => {
        soundAfter.classList.add("revealed");
    }, 360));
}

function goNextExample() {
    setExample(currentIndex + 1);
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

$("#btnToggleAspirationList").addEventListener("click", (event) => {
    const practiceLayout = $("#aspirationPracticeLayout");
    const isOpen = practiceLayout.classList.toggle("list-open");
    event.currentTarget.setAttribute("aria-expanded", isOpen ? "true" : "false");
    event.currentTarget.querySelector(".toggle-label").textContent = isOpen ? "목록닫기" : "연습목록";
});

$("#btnPlay").addEventListener("click", playExample);
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
