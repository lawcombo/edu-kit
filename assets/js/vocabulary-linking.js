(function() {
    const examples = [
        { word: "칫솔", emoji: "🪥", label: "이를 닦을 때 써요", question: "칫솔과 잘 어울리는 낱말은 무엇일까요?", answer: "치약", choices: ["치약", "우산", "공책", "양말"], speak: "칫솔. 잘 어울리는 낱말을 골라요." },
        { word: "신발", emoji: "👟", label: "발에 신어요", question: "신발과 잘 어울리는 낱말은 무엇일까요?", answer: "양말", choices: ["양말", "냉장고", "연필", "숟가락"], speak: "신발. 잘 어울리는 낱말을 골라요." },
        { word: "숟가락", emoji: "🥄", label: "음식을 떠먹어요", question: "숟가락과 잘 어울리는 낱말은 무엇일까요?", answer: "젓가락", choices: ["젓가락", "버스", "모자", "비누"], speak: "숟가락. 잘 어울리는 낱말을 골라요." },
        { word: "책", emoji: "📘", label: "읽는 물건이에요", question: "책과 잘 어울리는 낱말은 무엇일까요?", answer: "책가방", choices: ["책가방", "치약", "우유", "문"], speak: "책. 잘 어울리는 낱말을 골라요." },
        { word: "비누", emoji: "🧼", label: "손을 씻을 때 써요", question: "비누와 잘 어울리는 낱말은 무엇일까요?", answer: "수건", choices: ["수건", "사과", "기차", "연필"], speak: "비누. 잘 어울리는 낱말을 골라요." },
        { word: "우산", emoji: "☂️", label: "비 오는 날 써요", question: "우산과 잘 어울리는 낱말은 무엇일까요?", answer: "비", choices: ["비", "불", "책상", "강아지"], speak: "우산. 잘 어울리는 낱말을 골라요." }
    ];

    setupVocabularyPractice(examples, "관련 낱말을 잘 연결했어요.");
})();
