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

const doubleFinalExamples = [
    { written: "앉다", left: "앉", leftChanged: "안", right: "다", rightChanged: "따" },
    { written: "앉고", left: "앉", leftChanged: "안", right: "고", rightChanged: "꼬" },
    { written: "앉지", left: "앉", leftChanged: "안", right: "지", rightChanged: "찌" },
    { written: "얹다", left: "얹", leftChanged: "언", right: "다", rightChanged: "따" },
    { written: "얹고", left: "얹", leftChanged: "언", right: "고", rightChanged: "꼬" },
    { written: "얹지", left: "얹", leftChanged: "언", right: "지", rightChanged: "찌" },
    { written: "읽다", left: "읽", leftChanged: "익", right: "다", rightChanged: "따" },
    { written: "읽지", left: "읽", leftChanged: "익", right: "지", rightChanged: "찌" },
    { written: "읽더니", left: "읽", leftChanged: "익", right: "더니", rightChanged: "떠니" },
    { written: "밟다", left: "밟", leftChanged: "밥", right: "다", rightChanged: "따" },
    { written: "밟고", left: "밟", leftChanged: "밥", right: "고", rightChanged: "꼬" },
    { written: "밟지", left: "밟", leftChanged: "밥", right: "지", rightChanged: "찌" },
    { written: "넓다", left: "넓", leftChanged: "널", right: "다", rightChanged: "따" },
    { written: "넓고", left: "넓", leftChanged: "널", right: "고", rightChanged: "꼬" },
    { written: "넓지", left: "넓", leftChanged: "널", right: "지", rightChanged: "찌" },
    { written: "없다", left: "없", leftChanged: "업", right: "다", rightChanged: "따" },
    { written: "없고", left: "없", leftChanged: "업", right: "고", rightChanged: "꼬" },
    { written: "없지", left: "없", leftChanged: "업", right: "지", rightChanged: "찌" },
    { written: "값도", left: "값", leftChanged: "갑", right: "도", rightChanged: "또" },
    { written: "값과", left: "값", leftChanged: "갑", right: "과", rightChanged: "꽈" },
    { written: "값진", left: "값", leftChanged: "갑", right: "진", rightChanged: "찐" },
    { written: "닭도", left: "닭", leftChanged: "닥", right: "도", rightChanged: "또" },
    { written: "닭과", left: "닭", leftChanged: "닥", right: "과", rightChanged: "꽈" },
    { written: "닭장", left: "닭", leftChanged: "닥", right: "장", rightChanged: "짱" },
    { written: "흙도", left: "흙", leftChanged: "흑", right: "도", rightChanged: "또" },
    { written: "흙과", left: "흙", leftChanged: "흑", right: "과", rightChanged: "꽈" },
    { written: "흙집", left: "흙", leftChanged: "흑", right: "집", rightChanged: "찝" },
    { written: "몫도", left: "몫", leftChanged: "목", right: "도", rightChanged: "또" },
    { written: "몫과", left: "몫", leftChanged: "목", right: "과", rightChanged: "꽈" },
    { written: "넋도", left: "넋", leftChanged: "넉", right: "도", rightChanged: "또" },
    { written: "넋과", left: "넋", leftChanged: "넉", right: "과", rightChanged: "꽈" },
    { written: "삯도", left: "삯", leftChanged: "삭", right: "도", rightChanged: "또" },
    { written: "삯과", left: "삯", leftChanged: "삭", right: "과", rightChanged: "꽈" },
    { written: "읊다", left: "읊", leftChanged: "읍", right: "다", rightChanged: "따" },
    { written: "읊고", left: "읊", leftChanged: "읍", right: "고", rightChanged: "꼬" }
];

const $ = (selector) => document.querySelector(selector);

const infoScreen = $("#infoScreen");
const practiceScreen = $("#practiceScreen");
const exampleList = $("#exampleList");
const writtenWord = $("#writtenWord");
const leftSyllable = $("#leftSyllable");
const leftChanged = $("#leftChanged");
const rightSyllable = $("#rightSyllable");
const rightChanged = $("#rightChanged");

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
    if (window.eduKitCancelSpeech) window.eduKitCancelSpeech();
    leftSyllable.classList.remove("hidden");
    leftChanged.classList.remove("revealed");
    rightSyllable.classList.remove("hidden");
    rightChanged.classList.remove("revealed");
}

function renderExampleList() {
    exampleList.innerHTML = doubleFinalExamples.map((example, index) => (
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
    currentIndex = (index + doubleFinalExamples.length) % doubleFinalExamples.length;
    const example = doubleFinalExamples[currentIndex];

    writtenWord.textContent = example.written;
    leftSyllable.textContent = example.left;
    leftChanged.textContent = example.leftChanged;
    rightSyllable.textContent = example.right;
    rightChanged.textContent = example.rightChanged;

    setLongTextClass(leftSyllable, example.left);
    setLongTextClass(leftChanged, example.leftChanged);
    setLongTextClass(rightSyllable, example.right);
    setLongTextClass(rightChanged, example.rightChanged);
    resetAnimation();
    updateActiveExample();
}

function playExample() {
    resetAnimation();
    if (window.eduKitPrimeSpeechSynthesis) window.eduKitPrimeSpeechSynthesis();

    animationTimers.push(setTimeout(() => {
        leftSyllable.classList.add("hidden");
        rightSyllable.classList.add("hidden");
    }, 140));

    animationTimers.push(setTimeout(() => {
        const example = doubleFinalExamples[currentIndex];
        leftChanged.classList.add("revealed");
        rightChanged.classList.add("revealed");
        if (window.eduKitSpeakText) window.eduKitSpeakText(example.leftChanged + example.rightChanged);
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

$("#btnToggleDoubleFinalList").addEventListener("click", (event) => {
    const practiceLayout = $("#doubleFinalPracticeLayout");
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
