(function() {
    const examples = [
        { title: "먹어요", sentence: "민수가 사과를 먹어요.", emoji: "👦🍎", label: "무엇을 하는지 찾아요", question: "민수가 무엇을 하나요?", answer: "먹어요", choices: [{ text: "민수", emoji: "👦" }, { text: "사과", emoji: "🍎" }, { text: "먹어요", emoji: "🍽️" }, { text: "자요", emoji: "😴" }] },
        { title: "읽어요", sentence: "지우가 책을 읽어요.", emoji: "👧📚", label: "무엇을 하는지 찾아요", question: "지우가 무엇을 하나요?", answer: "읽어요", choices: [{ text: "책", emoji: "📚" }, { text: "읽어요", emoji: "👀" }, { text: "던져요", emoji: "🙌" }, { text: "마셔요", emoji: "🥛" }] },
        { title: "뛰어요", sentence: "강아지가 공원에서 뛰어요.", emoji: "🐶🏃", label: "무엇을 하는지 찾아요", question: "강아지가 무엇을 하나요?", answer: "뛰어요", choices: [{ text: "공원", emoji: "🌳" }, { text: "뛰어요", emoji: "🏃" }, { text: "써요", emoji: "✏️" }, { text: "먹어요", emoji: "🍽️" }] },
        { title: "던져요", sentence: "아빠가 공을 던져요.", emoji: "👨⚽", label: "무엇을 하는지 찾아요", question: "아빠가 무엇을 하나요?", answer: "던져요", choices: [{ text: "아빠", emoji: "👨" }, { text: "공", emoji: "⚽" }, { text: "던져요", emoji: "🙌" }, { text: "읽어요", emoji: "📖" }] },
        { title: "그려요", sentence: "아이가 그림을 그려요.", emoji: "🧒🎨", label: "무엇을 하는지 찾아요", question: "아이가 무엇을 하나요?", answer: "그려요", choices: [{ text: "그림", emoji: "🎨" }, { text: "그려요", emoji: "🖍️" }, { text: "마셔요", emoji: "🥛" }, { text: "뛰어요", emoji: "🏃" }] },
        { title: "불러요", sentence: "엄마가 노래를 불러요.", emoji: "👩🎵", label: "무엇을 하는지 찾아요", question: "엄마가 무엇을 하나요?", answer: "불러요", choices: [{ text: "엄마", emoji: "👩" }, { text: "노래", emoji: "🎵" }, { text: "불러요", emoji: "🎤" }, { text: "써요", emoji: "✏️" }] }
    ];

    setupSentencePractice(examples, "행동을 잘 찾았어요.");
})();
