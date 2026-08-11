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

(function() {
    const $ = (selector) => document.querySelector(selector);

    function escapeHtml(value) {
        return String(value).replace(/[&<>"']/g, (char) => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        })[char]);
    }

    function setActiveScreen(screenName) {
        $("#infoScreen").classList.toggle("active", screenName === "info");
        $("#practiceScreen").classList.toggle("active", screenName === "practice");
    }

    function renderChips(parts, highlightIndexes) {
        return parts.map((part, index) => {
            const className = highlightIndexes && highlightIndexes.includes(index) ?
                "sound-chip choice-card correct" :
                "sound-chip";
            return `<span class="${className}">${escapeHtml(part)}</span>`;
        }).join("");
    }

    function renderChoices(options) {
        return `<div class="choice-grid">${options.map((option) => (
            `<div class="choice-card" data-correct="${option.correct ? "true" : "false"}">${escapeHtml(option.text)}</div>`
        )).join("")}</div>`;
    }

    function renderPhonemeWord(word, mode) {
        const letters = Array.from(word);
        const targetIndex = mode === "initial" ? 0 : letters.length - 1;

        return letters.map((letter, index) => {
            const className = index === targetIndex ?
                "phoneme-word-letter phoneme-source-letter" :
                "phoneme-word-letter";
            return `<span class="${className}">${escapeHtml(letter)}</span>`;
        }).join("");
    }

    function animatePhonemeExtraction(stageBody, answer) {
        const source = stageBody.querySelector(".phoneme-source-letter");
        const target = stageBody.querySelector(".phoneme-answer-chip");
        if (!source || !target) return;

        document.querySelectorAll(".phoneme-flying-copy").forEach((element) => element.remove());
        target.classList.add("phoneme-pending");

        const sourceRect = source.getBoundingClientRect();
        const targetRect = target.getBoundingClientRect();
        const startX = sourceRect.left + (sourceRect.width / 2);
        const startY = sourceRect.top + (sourceRect.height / 2);
        const endX = targetRect.left + (targetRect.width / 2);
        const endY = targetRect.top + (targetRect.height / 2);

        const flyer = document.createElement("span");
        flyer.className = "phoneme-flying-copy";
        flyer.textContent = answer;
        flyer.style.left = startX + "px";
        flyer.style.top = startY + "px";
        document.body.appendChild(flyer);

        window.requestAnimationFrame(() => {
            flyer.classList.add("ready");
        });

        window.setTimeout(() => {
            flyer.style.left = endX + "px";
            flyer.style.top = endY + "px";
            flyer.classList.add("moving");
        }, 460);

        window.setTimeout(() => {
            target.classList.remove("phoneme-pending");
            flyer.classList.add("arrived");
        }, 1480);

        window.setTimeout(() => {
            flyer.remove();
        }, 1640);
    }

    function createStage(example, mode, reveal) {
        if (mode === "count") {
            return `
                <div class="phonemic-guide">소리 덩어리를 하나씩 나누어 세어요</div>
                <div class="phonemic-stage-row">${renderChips(example.parts)}</div>
                <div class="count-display ${reveal ? "revealed" : ""}">${escapeHtml(example.answer)}</div>
            `;
        }

        if (mode === "initial" || mode === "final") {
            return `
                <div class="phonemic-guide">${mode === "initial" ? "맨 앞에서 들리는 소리를 찾아요" : "마지막에 들리는 소리를 찾아요"}</div>
                <div class="phonemic-stage-row phoneme-extract-row ${reveal ? "is-revealed" : ""}">
                    <div class="phoneme-panel phoneme-source-panel">
                        <span class="phoneme-panel-label">&#45231;&#47568;</span>
                        <span class="sound-chip phoneme-word-chip">${renderPhonemeWord(example.word, mode)}</span>
                    </div>
                    <span class="arrow phoneme-arrow">&rarr;</span>
                    <div class="phoneme-panel phoneme-target-panel">
                        <span class="phoneme-panel-label">${mode === "initial" ? "&#52395;&#49548;&#47532;" : "&#45149;&#49548;&#47532;"}</span>
                        <span class="answer-chip phoneme-answer-chip ${reveal ? "revealed" : ""}">${escapeHtml(example.answer)}</span>
                    </div>
                </div>
            `;
        }

        if (mode === "same") {
            return `
                <div class="phonemic-guide">기준 낱말과 같은 첫소리 낱말을 찾아요</div>
                <div class="phonemic-stage-row">
                    <span class="sound-chip">${escapeHtml(example.word)}</span>
                    <span class="arrow">&rarr;</span>
                    ${renderChoices(example.options)}
                </div>
            `;
        }

        if (mode === "blend") {
            return `
                <div class="phonemic-guide">나뉜 소리를 이어서 한 낱말로 말해요</div>
                <div class="phonemic-stage-row">${renderChips(example.parts)}<span class="arrow">&rarr;</span><span class="answer-chip ${reveal ? "revealed" : ""}">${escapeHtml(example.answer)}</span></div>
            `;
        }

        return `
            <div class="phonemic-guide">낱말을 소리 덩어리로 또박또박 나누어요</div>
            <div class="phonemic-stage-row">
                <span class="sound-chip">${escapeHtml(example.word)}</span>
                <span class="arrow">&rarr;</span>
                <span class="${reveal ? "" : "answer-chip"} ${reveal ? "" : ""}">${reveal ? renderChips(example.parts) : escapeHtml(example.parts.join(" / "))}</span>
            </div>
        `;
    }

    window.createPhonemicPractice = function(config) {
        const exampleList = $("#exampleList");
        const writtenWord = $("#writtenWord");
        const stageBody = $("#stageBody");
        let currentIndex = 0;

        function resetResult() {
            if (window.eduKitCancelSpeech) window.eduKitCancelSpeech();
            document.querySelectorAll(".phoneme-flying-copy").forEach((element) => element.remove());
            stageBody.innerHTML = createStage(config.examples[currentIndex], config.mode, false);
        }

        function updateActiveExample() {
            document.querySelectorAll(".word-item").forEach((button, index) => {
                button.classList.toggle("active", index === currentIndex);
            });
        }

        function setExample(index) {
            currentIndex = (index + config.examples.length) % config.examples.length;
            const example = config.examples[currentIndex];
            writtenWord.textContent = example.word || example.answer;
            writtenWord.classList.toggle("small", (example.word || example.answer).length > 3);
            resetResult();
            updateActiveExample();
        }

        function playExample() {
            resetResult();
            if (window.eduKitPrimeSpeechSynthesis) window.eduKitPrimeSpeechSynthesis();

            setTimeout(() => {
                const example = config.examples[currentIndex];
                stageBody.innerHTML = createStage(example, config.mode, true);

                if (config.mode === "same") {
                    stageBody.querySelectorAll(".choice-card").forEach((card) => {
                        const isCorrect = card.dataset.correct === "true";
                        card.classList.toggle("correct", isCorrect);
                        card.classList.toggle("dimmed", !isCorrect);
                    });
                }

                if (config.mode === "initial" || config.mode === "final") {
                    animatePhonemeExtraction(stageBody, example.answer);
                }

                if (window.eduKitSpeakText) window.eduKitSpeakText(example.speak || example.answer || example.word);
            }, 180);
        }

        function renderExampleList() {
            exampleList.innerHTML = config.examples.map((example, index) => (
                `<button class="word-item" type="button" data-index="${index}">${escapeHtml(example.word || example.answer)}</button>`
            )).join("");

            exampleList.addEventListener("click", (event) => {
                const button = event.target.closest(".word-item");
                if (!button) return;
                setExample(Number(button.dataset.index));
            });
        }

        $("#btnBackHome").addEventListener("click", () => {
            sessionStorage.setItem("eduKitReturnToPhonemic", "1");
            window.location.href = "index.html";
        });

        $("#btnStartPractice").addEventListener("click", () => {
            setActiveScreen("practice");
            setExample(currentIndex);
        });

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
        $("#btnPrev").addEventListener("click", () => setExample(currentIndex - 1));
        $("#btnNext").addEventListener("click", () => setExample(currentIndex + 1));

        renderExampleList();
        setExample(0);
    };

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
})();
