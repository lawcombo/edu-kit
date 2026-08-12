(function() {
    const examples = [{"question":"보기에서 다를 골라요.","label":"목표 글자","guide":"다를 모두 찾아요","target":"다","answer":"다","choices":["나","라","다","가","타","다"],"title":"목표 다"},{"question":"보기에서 바를 골라요.","label":"목표 글자","guide":"바를 모두 찾아요","target":"바","answer":"바","choices":["파","바","마","바","사","빠"],"title":"목표 바"},{"question":"보기에서 ㅏ를 골라요.","label":"목표 모음","guide":"ㅏ를 모두 찾아요","target":"ㅏ","answer":"ㅏ","choices":["ㅓ","ㅏ","ㅗ","ㅜ","ㅏ","ㅣ"],"title":"목표 ㅏ"},{"question":"보기에서 ㄱ을 골라요.","label":"목표 자음","guide":"ㄱ을 모두 찾아요","target":"ㄱ","answer":"ㄱ","choices":["ㅋ","ㄱ","ㄲ","ㄴ","ㄱ","ㄷ"],"title":"목표 ㄱ"},{"question":"보기에서 로를 골라요.","label":"목표 음절","guide":"로를 모두 찾아요","target":"로","answer":"로","choices":["노","로","도","로","모","고"],"title":"목표 로"},{"question":"보기에서 수를 골라요.","label":"목표 음절","guide":"수를 모두 찾아요","target":"수","answer":"수","choices":["주","수","추","누","수","무"],"title":"목표 수"}];
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