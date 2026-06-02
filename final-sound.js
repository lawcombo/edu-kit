const finalSoundGroups = [
    {
        key: "g",
        final: "ㄱ",
        title: "ㄱ 소리",
        desc: "ㄱ, ㄲ, ㅋ 받침",
        examples: [
            { written: "밖", writtenSound: "밖", sound: "박" },
            { written: "부엌", writtenSound: "부엌", sound: "부억" },
            { written: "깎", writtenSound: "깎", sound: "깍" },
            { written: "낚", writtenSound: "낚", sound: "낙" },
            { written: "볶", writtenSound: "볶", sound: "복" },
            { written: "녹", writtenSound: "녹", sound: "녹" }
        ]
    },
    {
        key: "n",
        final: "ㄴ",
        title: "ㄴ 소리",
        desc: "ㄴ 받침",
        examples: [
            { written: "산", writtenSound: "산", sound: "산" },
            { written: "눈", writtenSound: "눈", sound: "눈" },
            { written: "문", writtenSound: "문", sound: "문" },
            { written: "손", writtenSound: "손", sound: "손" },
            { written: "돈", writtenSound: "돈", sound: "돈" },
            { written: "반", writtenSound: "반", sound: "반" }
        ]
    },
    {
        key: "d",
        final: "ㄷ",
        title: "ㄷ 소리",
        desc: "ㄷ, ㅌ, ㅅ, ㅆ, ㅈ, ㅊ, ㅎ 받침",
        examples: [
            { written: "꽃", writtenSound: "꽃", sound: "꼳" },
            { written: "낮", writtenSound: "낮", sound: "낟" },
            { written: "옷", writtenSound: "옷", sound: "옫" },
            { written: "있", writtenSound: "있", sound: "읻" },
            { written: "밭", writtenSound: "밭", sound: "받" },
            { written: "빛", writtenSound: "빛", sound: "빋" },
            { written: "히읗", writtenSound: "히읗", sound: "히읃" },
            { written: "닫", writtenSound: "닫", sound: "닫" }
        ]
    },
    {
        key: "r",
        final: "ㄹ",
        title: "ㄹ 소리",
        desc: "ㄹ 받침",
        examples: [
            { written: "달", writtenSound: "달", sound: "달" },
            { written: "길", writtenSound: "길", sound: "길" },
            { written: "물", writtenSound: "물", sound: "물" },
            { written: "별", writtenSound: "별", sound: "별" },
            { written: "발", writtenSound: "발", sound: "발" },
            { written: "솔", writtenSound: "솔", sound: "솔" }
        ]
    },
    {
        key: "m",
        final: "ㅁ",
        title: "ㅁ 소리",
        desc: "ㅁ 받침",
        examples: [
            { written: "밤", writtenSound: "밤", sound: "밤" },
            { written: "곰", writtenSound: "곰", sound: "곰" },
            { written: "섬", writtenSound: "섬", sound: "섬" },
            { written: "잠", writtenSound: "잠", sound: "잠" },
            { written: "봄", writtenSound: "봄", sound: "봄" },
            { written: "몸", writtenSound: "몸", sound: "몸" }
        ]
    },
    {
        key: "b",
        final: "ㅂ",
        title: "ㅂ 소리",
        desc: "ㅂ, ㅍ 받침",
        examples: [
            { written: "앞", writtenSound: "앞", sound: "압" },
            { written: "잎", writtenSound: "잎", sound: "입" },
            { written: "덮", writtenSound: "덮", sound: "덥" },
            { written: "높", writtenSound: "높", sound: "놉" },
            { written: "밥", writtenSound: "밥", sound: "밥" },
            { written: "입", writtenSound: "입", sound: "입" }
        ]
    },
    {
        key: "ng",
        final: "ㅇ",
        title: "ㅇ 소리",
        desc: "ㅇ 받침",
        examples: [
            { written: "강", writtenSound: "강", sound: "강" },
            { written: "방", writtenSound: "방", sound: "방" },
            { written: "공", writtenSound: "공", sound: "공" },
            { written: "종", writtenSound: "종", sound: "종" },
            { written: "왕", writtenSound: "왕", sound: "왕" },
            { written: "상", writtenSound: "상", sound: "상" }
        ]
    }
];

const $ = (selector) => document.querySelector(selector);

const infoScreen = $("#infoScreen");
const selectScreen = $("#selectScreen");
const practiceScreen = $("#practiceScreen");
const finalGroupList = $("#finalGroupList");
const exampleList = $("#exampleList");
const practiceHeading = $("#practiceHeading");
const wordListTitle = $("#wordListTitle");
const writtenWord = $("#writtenWord");
const writtenSound = $("#writtenSound");
const soundBefore = $("#soundBefore");
const soundAfter = $("#soundAfter");

let currentGroupIndex = 0;
let currentExampleIndex = 0;
let animationTimers = [];

function clearAnimationTimers() {
    animationTimers.forEach((timerId) => clearTimeout(timerId));
    animationTimers = [];
}

function setActiveScreen(screenName) {
    infoScreen.classList.toggle("active", screenName === "info");
    selectScreen.classList.toggle("active", screenName === "select");
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

function getCurrentGroup() {
    return finalSoundGroups[currentGroupIndex];
}

function renderFinalGroups() {
    finalGroupList.innerHTML = finalSoundGroups.map((group, index) => (
        `<button class="final-choice-card" type="button" data-index="${index}">
            <span class="final-choice-letter">${group.final}</span>
            <span class="final-choice-title">${group.title}</span>
            <span class="final-choice-desc">${group.desc}</span>
        </button>`
    )).join("");

    finalGroupList.addEventListener("click", (event) => {
        const button = event.target.closest(".final-choice-card");
        if (!button) return;
        setGroup(Number(button.dataset.index));
        setActiveScreen("practice");
    });
}

function renderExampleList() {
    const group = getCurrentGroup();
    exampleList.innerHTML = group.examples.map((example, index) => (
        `<button class="word-item" type="button" data-index="${index}">${example.written}</button>`
    )).join("");
}

function updateActiveExample() {
    document.querySelectorAll(".word-item").forEach((button, index) => {
        button.classList.toggle("active", index === currentExampleIndex);
    });
}

function setGroup(index) {
    currentGroupIndex = (index + finalSoundGroups.length) % finalSoundGroups.length;
    currentExampleIndex = 0;

    const group = getCurrentGroup();
    practiceHeading.textContent = `${group.final} 받침 연습하기`;
    wordListTitle.textContent = `${group.final} 받침 연습 목록`;
    $("#finalSoundPracticeLayout").classList.remove("list-open");
    $("#btnToggleFinalSoundList").setAttribute("aria-expanded", "false");
    $("#btnToggleFinalSoundList .toggle-label").textContent = "연습목록";

    renderExampleList();
    setExample(0);
}

function setExample(index) {
    const group = getCurrentGroup();
    currentExampleIndex = (index + group.examples.length) % group.examples.length;
    const example = group.examples[currentExampleIndex];

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
    const group = getCurrentGroup();
    setExample((currentExampleIndex + 1) % group.examples.length);
}

$("#btnBackHome").addEventListener("click", () => {
    sessionStorage.setItem("eduKitReturnToPhonology", "1");
    window.location.href = "index.html";
});

$("#btnStartPractice").addEventListener("click", () => {
    setActiveScreen("select");
});

$("#btnBackInfo").addEventListener("click", () => {
    setActiveScreen("info");
});

$("#btnBackSelect").addEventListener("click", () => {
    setActiveScreen("select");
    resetAnimation();
});

exampleList.addEventListener("click", (event) => {
    const button = event.target.closest(".word-item");
    if (!button) return;
    setExample(Number(button.dataset.index));
});

$("#btnToggleFinalSoundList").addEventListener("click", (event) => {
    const practiceLayout = $("#finalSoundPracticeLayout");
    const isOpen = practiceLayout.classList.toggle("list-open");
    event.currentTarget.setAttribute("aria-expanded", isOpen ? "true" : "false");
    event.currentTarget.querySelector(".toggle-label").textContent = isOpen ? "목록닫기" : "연습목록";
});

$("#btnPlay").addEventListener("click", playExample);
$("#btnNext").addEventListener("click", goNextExample);

renderFinalGroups();
setGroup(0);

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
