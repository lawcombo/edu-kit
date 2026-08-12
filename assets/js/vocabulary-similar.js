(function() {
    const examples = [
        { word: "기쁘다", emoji: "😊", label: "마음이 좋아요", question: "기쁘다와 비슷한 말은 무엇일까요?", answer: "즐겁다", choices: ["즐겁다", "무겁다", "차갑다", "느리다"], speak: "기쁘다. 비슷한 말은 무엇일까요?" },
        { word: "빠르다", emoji: "🚄", label: "빨리 움직여요", question: "빠르다와 비슷한 말은 무엇일까요?", answer: "신속하다", choices: ["신속하다", "조용하다", "어둡다", "작다"], speak: "빠르다. 비슷한 말은 무엇일까요?" },
        { word: "깨끗하다", emoji: "✨", label: "반짝반짝해요", question: "깨끗하다와 비슷한 말은 무엇일까요?", answer: "말끔하다", choices: ["말끔하다", "시끄럽다", "무겁다", "춥다"], speak: "깨끗하다. 비슷한 말은 무엇일까요?" },
        { word: "조용하다", emoji: "🤫", label: "소리가 작아요", question: "조용하다와 비슷한 말은 무엇일까요?", answer: "고요하다", choices: ["고요하다", "뜨겁다", "넓다", "빠르다"], speak: "조용하다. 비슷한 말은 무엇일까요?" },
        { word: "맛있다", emoji: "😋", label: "먹으면 좋아요", question: "맛있다와 비슷한 말은 무엇일까요?", answer: "맛나다", choices: ["맛나다", "무섭다", "느리다", "어둡다"], speak: "맛있다. 비슷한 말은 무엇일까요?" },
        { word: "무섭다", emoji: "😨", label: "겁이 나요", question: "무섭다와 비슷한 말은 무엇일까요?", answer: "두렵다", choices: ["두렵다", "가볍다", "깨끗하다", "즐겁다"], speak: "무섭다. 비슷한 말은 무엇일까요?" }
    ];

    setupVocabularyPractice(examples, "비슷한 말을 잘 찾았어요.");
})();
