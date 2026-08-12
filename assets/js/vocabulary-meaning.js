(function() {
    const examples = [
        { word: "우산", emoji: "☂️", label: "비 오는 날 써요", question: "우산의 뜻은 무엇일까요?", answer: "비를 막을 때 써요", choices: ["비를 막을 때 써요", "밥을 먹을 때 써요", "잠을 잘 때 덮어요", "글씨를 쓸 때 써요"], speak: "우산. 알맞은 뜻을 골라요." },
        { word: "냉장고", emoji: "🧊", label: "음식을 차갑게 보관해요", question: "냉장고의 뜻은 무엇일까요?", answer: "음식을 차갑게 보관해요", choices: ["음식을 차갑게 보관해요", "머리를 빗어요", "길을 걸어요", "그림을 그려요"], speak: "냉장고. 알맞은 뜻을 골라요." },
        { word: "연필", emoji: "✏️", label: "글씨를 써요", question: "연필의 뜻은 무엇일까요?", answer: "글씨나 그림을 그려요", choices: ["글씨나 그림을 그려요", "발에 신어요", "물을 마셔요", "불을 꺼요"], speak: "연필. 알맞은 뜻을 골라요." },
        { word: "숟가락", emoji: "🥄", label: "밥이나 국을 먹어요", question: "숟가락의 뜻은 무엇일까요?", answer: "음식을 떠먹을 때 써요", choices: ["음식을 떠먹을 때 써요", "문을 열 때 써요", "머리에 써요", "비를 막아요"], speak: "숟가락. 알맞은 뜻을 골라요." },
        { word: "신발", emoji: "👟", label: "발에 신어요", question: "신발의 뜻은 무엇일까요?", answer: "발에 신고 걸어요", choices: ["발에 신고 걸어요", "손을 씻어요", "책을 읽어요", "불을 켜요"], speak: "신발. 알맞은 뜻을 골라요." },
        { word: "시계", emoji: "⏰", label: "시간을 알려줘요", question: "시계의 뜻은 무엇일까요?", answer: "시간을 알려줘요", choices: ["시간을 알려줘요", "음식을 데워요", "옷을 입어요", "공을 차요"], speak: "시계. 알맞은 뜻을 골라요." }
    ];

    setupVocabularyPractice(examples, "뜻을 잘 골랐어요.");
})();
