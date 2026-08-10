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

const tensingExamples = [
    { written: "국밥", left: "국", right: "밥", changed: "빱" },
    { written: "책상", left: "책", right: "상", changed: "쌍" },
    { written: "약국", left: "약", right: "국", changed: "꾹" },
    { written: "식당", left: "식", right: "당", changed: "땅" },
    { written: "입고", left: "입", right: "고", changed: "꼬" },
    { written: "잡다", left: "잡", right: "다", changed: "따" },
    { written: "먹다", left: "먹", right: "다", changed: "따" },
    { written: "닫고", left: "닫", right: "고", changed: "꼬" },
    { written: "믿고", left: "믿", right: "고", changed: "꼬" },
    { written: "웃고", left: "웃", right: "고", changed: "꼬" },
    { written: "꽃다발", left: "꽃", right: "다발", changed: "따발" },
    { written: "낮잠", left: "낮", right: "잠", changed: "짬" },
    { written: "옷장", left: "옷", right: "장", changed: "짱" },
    { written: "밥상", left: "밥", right: "상", changed: "쌍" },
    { written: "앞집", left: "앞", right: "집", changed: "찝" },
    { written: "옆집", left: "옆", right: "집", changed: "찝" },
    { written: "덮개", left: "덮", right: "개", changed: "깨" },
    { written: "넓다", left: "넓", right: "다", changed: "따" },
    { written: "읽고", left: "읽", right: "고", changed: "꼬" },
    { written: "밟다", left: "밟", right: "다", changed: "따" },
    { written: "앉다", left: "앉", right: "다", changed: "따" },
    { written: "없다", left: "없", right: "다", changed: "따" },
    { written: "값도", left: "값", right: "도", changed: "또" },
    { written: "닭장", left: "닭", right: "장", changed: "짱" },
    { written: "흙길", left: "흙", right: "길", changed: "낄" },
    { written: "밭갈이", left: "밭", right: "갈이", changed: "까리" },
    { written: "꽃길", left: "꽃", right: "길", changed: "낄" },
    { written: "젖병", left: "젖", right: "병", changed: "뼝" },
    { written: "끝점", left: "끝", right: "점", changed: "쩜" },
    { written: "몫도", left: "몫", right: "도", changed: "또" }
];

const $ = (selector) => document.querySelector(selector);

const infoScreen = $("#infoScreen");
const practiceScreen = $("#practiceScreen");
const exampleList = $("#exampleList");
const writtenWord = $("#writtenWord");
const leftSyllable = $("#leftSyllable");
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
    rightSyllable.classList.remove("hidden");
    rightChanged.classList.remove("revealed");
}

function renderExampleList() {
    exampleList.innerHTML = tensingExamples.map((example, index) => (
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
    currentIndex = (index + tensingExamples.length) % tensingExamples.length;
    const example = tensingExamples[currentIndex];

    writtenWord.textContent = example.written;
    leftSyllable.textContent = example.left;
    rightSyllable.textContent = example.right;
    rightChanged.textContent = example.changed;

    setLongTextClass(rightSyllable, example.right);
    setLongTextClass(rightChanged, example.changed);
    resetAnimation();
    updateActiveExample();
}

function playExample() {
    resetAnimation();
    if (window.eduKitPrimeSpeechSynthesis) window.eduKitPrimeSpeechSynthesis();

    animationTimers.push(setTimeout(() => {
        rightSyllable.classList.add("hidden");
    }, 140));

    animationTimers.push(setTimeout(() => {
        const example = tensingExamples[currentIndex];
        rightChanged.classList.add("revealed");
        if (window.eduKitSpeakText) window.eduKitSpeakText(example.left + example.changed);
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

$("#btnToggleTensingList").addEventListener("click", (event) => {
    const practiceLayout = $("#tensingPracticeLayout");
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
