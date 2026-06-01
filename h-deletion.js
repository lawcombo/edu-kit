const hDeletionExamples = [
    { written: "좋아", type: "좋 + 아", left: "좋", base: "조", right: "아", result: "조아" },
    { written: "좋아요", type: "좋 + 아요", left: "좋", base: "조", right: "아요", result: "조아요" },
    { written: "좋아서", type: "좋 + 아서", left: "좋", base: "조", right: "아서", result: "조아서" },
    { written: "좋으니", type: "좋 + 으니", left: "좋", base: "조", right: "으니", result: "조으니" },
    { written: "놓아", type: "놓 + 아", left: "놓", base: "노", right: "아", result: "노아" },
    { written: "놓아요", type: "놓 + 아요", left: "놓", base: "노", right: "아요", result: "노아요" },
    { written: "놓아서", type: "놓 + 아서", left: "놓", base: "노", right: "아서", result: "노아서" },
    { written: "놓으니", type: "놓 + 으니", left: "놓", base: "노", right: "으니", result: "노으니" },
    { written: "쌓아", type: "쌓 + 아", left: "쌓", base: "싸", right: "아", result: "싸아" },
    { written: "쌓아요", type: "쌓 + 아요", left: "쌓", base: "싸", right: "아요", result: "싸아요" },
    { written: "쌓아서", type: "쌓 + 아서", left: "쌓", base: "싸", right: "아서", result: "싸아서" },
    { written: "쌓으니", type: "쌓 + 으니", left: "쌓", base: "싸", right: "으니", result: "싸으니" },
    { written: "낳아", type: "낳 + 아", left: "낳", base: "나", right: "아", result: "나아" },
    { written: "낳아요", type: "낳 + 아요", left: "낳", base: "나", right: "아요", result: "나아요" },
    { written: "낳아서", type: "낳 + 아서", left: "낳", base: "나", right: "아서", result: "나아서" },
    { written: "낳으니", type: "낳 + 으니", left: "낳", base: "나", right: "으니", result: "나으니" },
    { written: "넣어", type: "넣 + 어", left: "넣", base: "너", right: "어", result: "너어" },
    { written: "넣어요", type: "넣 + 어요", left: "넣", base: "너", right: "어요", result: "너어요" },
    { written: "넣어서", type: "넣 + 어서", left: "넣", base: "너", right: "어서", result: "너어서" },
    { written: "넣으니", type: "넣 + 으니", left: "넣", base: "너", right: "으니", result: "너으니" },
    { written: "닿아", type: "닿 + 아", left: "닿", base: "다", right: "아", result: "다아" },
    { written: "닿아요", type: "닿 + 아요", left: "닿", base: "다", right: "아요", result: "다아요" },
    { written: "닿아서", type: "닿 + 아서", left: "닿", base: "다", right: "아서", result: "다아서" },
    { written: "찧어", type: "찧 + 어", left: "찧", base: "찌", right: "어", result: "찌어" },
    { written: "찧어요", type: "찧 + 어요", left: "찧", base: "찌", right: "어요", result: "찌어요" },
    { written: "찧어서", type: "찧 + 어서", left: "찧", base: "찌", right: "어서", result: "찌어서" },
    { written: "빻아", type: "빻 + 아", left: "빻", base: "빠", right: "아", result: "빠아" },
    { written: "빻아요", type: "빻 + 아요", left: "빻", base: "빠", right: "아요", result: "빠아요" },
    { written: "빻아서", type: "빻 + 아서", left: "빻", base: "빠", right: "아서", result: "빠아서" },
    { written: "많아", type: "많 + 아", left: "많", base: "마", right: "아", result: "마나" },
    { written: "많아요", type: "많 + 아요", left: "많", base: "마", right: "아요", result: "마나요" },
    { written: "많아서", type: "많 + 아서", left: "많", base: "마", right: "아서", result: "마나서" },
    { written: "않아", type: "않 + 아", left: "않", base: "아", right: "아", result: "아나" },
    { written: "않아요", type: "않 + 아요", left: "않", base: "아", right: "아요", result: "아나요" },
    { written: "않아서", type: "않 + 아서", left: "않", base: "아", right: "아서", result: "아나서" },
    { written: "싫어", type: "싫 + 어", left: "싫", base: "시", right: "어", result: "시러" },
    { written: "싫어요", type: "싫 + 어요", left: "싫", base: "시", right: "어요", result: "시러요" },
    { written: "싫어서", type: "싫 + 어서", left: "싫", base: "시", right: "어서", result: "시러서" },
    { written: "끓어", type: "끓 + 어", left: "끓", base: "끄", right: "어", result: "끄러" },
    { written: "끓어요", type: "끓 + 어요", left: "끓", base: "끄", right: "어요", result: "끄러요" },
    { written: "끓어서", type: "끓 + 어서", left: "끓", base: "끄", right: "어서", result: "끄러서" },
    { written: "앓아", type: "앓 + 아", left: "앓", base: "아", right: "아", result: "아라" },
    { written: "앓아요", type: "앓 + 아요", left: "앓", base: "아", right: "아요", result: "아라요" },
    { written: "앓아서", type: "앓 + 아서", left: "앓", base: "아", right: "아서", result: "아라서" }
];

const $ = (selector) => document.querySelector(selector);

const infoScreen = $("#infoScreen");
const practiceScreen = $("#practiceScreen");
const exampleList = $("#exampleList");
const exampleType = $("#exampleType");
const writtenWord = $("#writtenWord");
const leftSyllable = $("#leftSyllable");
const leftBase = $("#leftBase");
const rightSyllable = $("#rightSyllable");
const spokenResult = $("#spokenResult");

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
    leftSyllable.classList.remove("hidden");
    leftBase.classList.remove("revealed");
    spokenResult.classList.remove("ready");
    spokenResult.textContent = "?";
}

function renderExampleList() {
    exampleList.innerHTML = hDeletionExamples.map((example, index) => (
        `<button class="example-item" type="button" data-index="${index}">${example.written}</button>`
    )).join("");

    exampleList.addEventListener("click", (event) => {
        const button = event.target.closest(".example-item");
        if (!button) return;
        setExample(Number(button.dataset.index));
    });
}

function updateActiveExample() {
    document.querySelectorAll(".example-item").forEach((button, index) => {
        button.classList.toggle("active", index === currentIndex);
    });
}

function setExample(index) {
    currentIndex = (index + hDeletionExamples.length) % hDeletionExamples.length;
    const example = hDeletionExamples[currentIndex];

    exampleType.textContent = example.type;
    writtenWord.textContent = example.written;
    leftSyllable.textContent = example.left;
    leftBase.textContent = example.base;
    rightSyllable.textContent = example.right;

    setLongTextClass(rightSyllable, example.right);
    resetAnimation();
    updateActiveExample();
}

function playExample() {
    const example = hDeletionExamples[currentIndex];

    resetAnimation();

    animationTimers.push(setTimeout(() => {
        leftSyllable.classList.add("hidden");
    }, 140));

    animationTimers.push(setTimeout(() => {
        leftBase.classList.add("revealed");
    }, 360));

    animationTimers.push(setTimeout(() => {
        spokenResult.textContent = example.result;
        spokenResult.classList.add("ready");
    }, 600));
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
