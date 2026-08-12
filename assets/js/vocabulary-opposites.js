(function() {
    const examples = [
        { word: "크다", emoji: "🐘", label: "아주 큰 코끼리", question: "크다의 반대말은 무엇일까요?", answer: "작다", choices: ["작다", "높다", "넓다", "많다"], speak: "크다. 반대말은 무엇일까요?" },
        { word: "덥다", emoji: "☀️", label: "햇볕이 뜨거워요", question: "덥다의 반대말은 무엇일까요?", answer: "춥다", choices: ["춥다", "밝다", "빠르다", "무겁다"], speak: "덥다. 반대말은 무엇일까요?" },
        { word: "열다", emoji: "🚪", label: "문을 열어요", question: "열다의 반대말은 무엇일까요?", answer: "닫다", choices: ["닫다", "걷다", "잡다", "먹다"], speak: "열다. 반대말은 무엇일까요?" },
        { word: "빠르다", emoji: "🏃", label: "빨리 달려요", question: "빠르다의 반대말은 무엇일까요?", answer: "느리다", choices: ["느리다", "작다", "높다", "짧다"], speak: "빠르다. 반대말은 무엇일까요?" },
        { word: "무겁다", emoji: "🏋️", label: "들기 힘들어요", question: "무겁다의 반대말은 무엇일까요?", answer: "가볍다", choices: ["가볍다", "차갑다", "어둡다", "길다"], speak: "무겁다. 반대말은 무엇일까요?" },
        { word: "밝다", emoji: "💡", label: "불빛이 환해요", question: "밝다의 반대말은 무엇일까요?", answer: "어둡다", choices: ["어둡다", "느리다", "작다", "닫다"], speak: "밝다. 반대말은 무엇일까요?" }
    ];

    setupVocabularyPractice(examples, "반대말을 잘 찾았어요.");
})();
