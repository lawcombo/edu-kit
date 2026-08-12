(function() {
    const examples = [{"question":"다른 글자 하나를 골라요.","label":"보기 글자","guide":"다른 글자를 찾아요","target":"가 가 가 카","answer":"카","choices":["가","가","카","가","가","가"],"title":"가 가 가 카"},{"question":"다른 글자 하나를 골라요.","label":"보기 글자","guide":"다른 글자를 찾아요","target":"다 다 타 다","answer":"타","choices":["다","다","다","타","다","다"],"title":"다 다 타 다"},{"question":"다른 글자 하나를 골라요.","label":"보기 글자","guide":"다른 글자를 찾아요","target":"바 파 바 바","answer":"파","choices":["바","바","파","바","바","바"],"title":"바 파 바 바"},{"question":"다른 글자 하나를 골라요.","label":"보기 글자","guide":"다른 글자를 찾아요","target":"노 노 누 노","answer":"누","choices":["노","누","노","노","노","노"],"title":"노 노 누 노"},{"question":"다른 글자 하나를 골라요.","label":"보기 글자","guide":"다른 글자를 찾아요","target":"라 나 라 라","answer":"나","choices":["라","라","라","나","라","라"],"title":"라 나 라 라"},{"question":"다른 글자 하나를 골라요.","label":"보기 글자","guide":"다른 글자를 찾아요","target":"오 우 오 오","answer":"우","choices":["오","오","우","오","오","오"],"title":"오 우 오 오"}];
    let currentIndex = 0;
    const infoScreen = document.getElementById("infoScreen");
    const practiceScreen = document.getElementById("practiceScreen");
    const practiceLayout = document.getElementById("practiceLayout");
    const exampleList = document.getElementById("exampleList");
    const targetLabel = document.getElementById("targetLabel");
    const targetLetter = document.getElementById("targetLetter");
    const targetGuide = document.getElementById("targetGuide");
    const questionText = document.getElementById("questionText");
    const letterGrid = document.getElementById("letterGrid");
    const feedbackText = document.getElementById("feedbackText");

    function redirectRefreshToLearningType() {
        const entry = window.performance && window.performance.getEntriesByType && window.performance.getEntriesByType("navigation")[0];
        const isReload = entry ? entry.type === "reload" : window.performance && window.performance.navigation && window.performance.navigation.type === 1;
        if (!isReload) return;
        sessionStorage.setItem("eduKitRefreshToLearningType", "1");
        window.location.replace("index.html");
    }
    function setActiveScreen(name) { infoScreen.classList.toggle("active", name === "info"); practiceScreen.classList.toggle("active", name === "practice"); }
    function speak(text) { if (window.eduKitPrimeSpeechSynthesis) window.eduKitPrimeSpeechSynthesis(); if (window.eduKitSpeakText) window.eduKitSpeakText(text); }
    function resetFeedback() { feedbackText.className = "feedback"; feedbackText.textContent = "실행을 누르거나 알맞은 글자를 골라요"; letterGrid.querySelectorAll(".letter-choice").forEach((button) => button.classList.remove("correct", "wrong")); }
    function renderList() { exampleList.innerHTML = examples.map((item, index) => `<button class="word-item" type="button" data-index="${index}">${item.title}</button>`).join(""); }
    function updateList() { exampleList.querySelectorAll(".word-item").forEach((button, index) => button.classList.toggle("active", index === currentIndex)); }
    function choose(value, button) {
        const item = examples[currentIndex];
        letterGrid.querySelectorAll(".letter-choice").forEach((choice) => { choice.classList.remove("correct", "wrong"); if (choice.dataset.value === item.answer) choice.classList.add("correct"); });
        if (value === item.answer) { feedbackText.className = "feedback good"; feedbackText.textContent = "잘 찾았어요."; speak("참 잘했어요."); return; }
        button.classList.add("wrong"); feedbackText.className = "feedback try"; feedbackText.textContent = "다시 한번 선택해보세요."; speak("다시 한번 선택해보세요.");
    }
    function setExample(index) {
        currentIndex = (index + examples.length) % examples.length;
        const item = examples[currentIndex];
        targetLabel.textContent = item.label; targetLetter.textContent = item.target; targetGuide.textContent = item.guide; questionText.textContent = item.question;
        letterGrid.innerHTML = item.choices.map((choice, choiceIndex) => `<button class="letter-choice" type="button" data-value="${choice}" aria-label="보기 ${choiceIndex + 1}: ${choice}">${choice}</button>`).join("");
        resetFeedback(); updateList();
    }
    function installGuard() {
        const message = "화면 캡처가 감지되어 화면을 보호합니다."; let guardActive = false;
        function ensureGuardElements() { if (document.getElementById("captureGuardOverlay")) return; const overlay = document.createElement("div"); overlay.id = "captureGuardOverlay"; overlay.setAttribute("aria-hidden", "true"); overlay.innerHTML = '<div class="capture-guard-box"><div class="capture-guard-title">화면 보호 중</div><p class="capture-guard-text">' + message + '<br>다시 화면을 클릭하면 보호가 해제됩니다.</p></div>'; document.body.appendChild(overlay); }
        function showGuard() { ensureGuardElements(); const overlay = document.getElementById("captureGuardOverlay"); if (!overlay) return; guardActive = true; document.body.classList.add("capture-guard-active"); overlay.classList.add("active"); }
        function hideGuard() { const overlay = document.getElementById("captureGuardOverlay"); if (!overlay || !guardActive) return; guardActive = false; overlay.classList.remove("active"); document.body.classList.remove("capture-guard-active"); }
        ensureGuardElements(); window.addEventListener("blur", showGuard); document.addEventListener("visibilitychange", () => { if (document.hidden) showGuard(); }); document.addEventListener("keyup", (event) => { const key = (event.key || "").toLowerCase(); const code = (event.code || "").toLowerCase(); if (key === "printscreen" || code === "printscreen") showGuard(); }); document.addEventListener("pointerdown", hideGuard, true);
    }
    redirectRefreshToLearningType();
    document.getElementById("btnBackHome").addEventListener("click", () => { sessionStorage.setItem("eduKitReturnToLetterDiscrimination", "1"); window.location.href = "index.html"; });
    document.getElementById("btnStartPractice").addEventListener("click", () => setActiveScreen("practice"));
    document.getElementById("btnBackInfo").addEventListener("click", () => setActiveScreen("info"));
    document.getElementById("btnToggleList").addEventListener("click", (event) => { const isOpen = practiceLayout.classList.toggle("list-open"); event.currentTarget.setAttribute("aria-expanded", isOpen ? "true" : "false"); });
    document.getElementById("btnPlay").addEventListener("click", () => { const item = examples[currentIndex]; speak(`${item.target}. ${item.question}`); });
    document.getElementById("btnPrev").addEventListener("click", () => setExample(currentIndex - 1));
    document.getElementById("btnNext").addEventListener("click", () => setExample(currentIndex + 1));
    exampleList.addEventListener("click", (event) => { const button = event.target.closest(".word-item"); if (button) setExample(Number(button.dataset.index)); });
    letterGrid.addEventListener("click", (event) => { const button = event.target.closest(".letter-choice"); if (button) choose(button.dataset.value, button); });
    renderList(); setExample(0); installGuard();
})();