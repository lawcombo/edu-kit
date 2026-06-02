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

const nasalizationExamples = [
    { written: "국물", left: "국", changed: "궁", right: "물" },
    { written: "먹는", left: "먹", changed: "멍", right: "는" },
    { written: "깎는", left: "깎", changed: "깡", right: "는" },
    { written: "부엌문", left: "부엌", changed: "부엉", right: "문" },
    { written: "책문", left: "책", changed: "챙", right: "문" },
    { written: "밖문", left: "밖", changed: "방", right: "문" },
    { written: "닫는", left: "닫", changed: "단", right: "는" },
    { written: "받는", left: "받", changed: "반", right: "는" },
    { written: "짓는", left: "짓", changed: "진", right: "는" },
    { written: "웃는", left: "웃", changed: "운", right: "는" },
    { written: "있는", left: "있", changed: "인", right: "는" },
    { written: "꽃말", left: "꽃", changed: "꼰", right: "말" },
    { written: "낮말", left: "낮", changed: "난", right: "말" },
    { written: "밭머리", left: "밭", changed: "반", right: "머리" },
    { written: "끝말", left: "끝", changed: "끈", right: "말" },
    { written: "옷맵시", left: "옷", changed: "온", right: "맵시" },
    { written: "밥물", left: "밥", changed: "밤", right: "물" },
    { written: "입는", left: "입", changed: "임", right: "는" },
    { written: "잡는", left: "잡", changed: "잠", right: "는" },
    { written: "앞문", left: "앞", changed: "암", right: "문" },
    { written: "덮는", left: "덮", changed: "덤", right: "는" },
    { written: "값만", left: "값", changed: "감", right: "만" },
    { written: "없는", left: "없", changed: "엄", right: "는" },
    { written: "젖먹이", left: "젖", changed: "전", right: "먹이" },
    { written: "겉모양", left: "겉", changed: "건", right: "모양" },
    { written: "부엌날", left: "부엌", changed: "부엉", right: "날" },
    { written: "닦는", left: "닦", changed: "당", right: "는" },
    { written: "묻는", left: "묻", changed: "문", right: "는" },
    { written: "빚는", left: "빚", changed: "빈", right: "는" },
    { written: "앞마당", left: "앞", changed: "암", right: "마당" }
];

const $ = (selector) => document.querySelector(selector);

const infoScreen = $("#infoScreen");
const practiceScreen = $("#practiceScreen");
const exampleList = $("#exampleList");
const writtenWord = $("#writtenWord");
const leftSyllable = $("#leftSyllable");
const leftChanged = $("#leftChanged");
const rightSyllable = $("#rightSyllable");

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
    leftChanged.classList.remove("revealed");
}

function renderExampleList() {
    exampleList.innerHTML = nasalizationExamples.map((example, index) => (
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
    currentIndex = (index + nasalizationExamples.length) % nasalizationExamples.length;
    const example = nasalizationExamples[currentIndex];

    writtenWord.textContent = example.written;
    leftSyllable.textContent = example.left;
    leftChanged.textContent = example.changed;
    rightSyllable.textContent = example.right;

    setLongTextClass(leftSyllable, example.left);
    setLongTextClass(leftChanged, example.changed);
    setLongTextClass(rightSyllable, example.right);
    resetAnimation();
    updateActiveExample();
}

function playExample() {
    resetAnimation();

    animationTimers.push(setTimeout(() => {
        leftSyllable.classList.add("hidden");
    }, 140));

    animationTimers.push(setTimeout(() => {
        leftChanged.classList.add("revealed");
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

$("#btnToggleNasalizationList").addEventListener("click", (event) => {
    const practiceLayout = $("#nasalizationPracticeLayout");
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
