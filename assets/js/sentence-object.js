(function() {
    const examples = [
        { title: "사과를 먹어요", sentence: "민수가 사과를 먹어요.", emoji: "👦🍎", label: "무엇을 먹는지 찾아요", question: "민수가 무엇을 먹나요?", answer: "사과", choices: [{ text: "민수", emoji: "👦" }, { text: "사과", emoji: "🍎" }, { text: "공원", emoji: "🌳" }, { text: "먹어요", emoji: "🍽️" }] },
        { title: "책을 읽어요", sentence: "지우가 책을 읽어요.", emoji: "👧📚", label: "무엇을 읽는지 찾아요", question: "지우가 무엇을 읽나요?", answer: "책", choices: [{ text: "지우", emoji: "👧" }, { text: "책", emoji: "📚" }, { text: "연필", emoji: "✏️" }, { text: "읽어요", emoji: "👀" }] },
        { title: "공을 던져요", sentence: "아빠가 공을 던져요.", emoji: "👨⚽", label: "무엇을 던지는지 찾아요", question: "아빠가 무엇을 던지나요?", answer: "공", choices: [{ text: "아빠", emoji: "👨" }, { text: "공", emoji: "⚽" }, { text: "학교", emoji: "🏫" }, { text: "던져요", emoji: "🙌" }] },
        { title: "물을 마셔요", sentence: "아이가 물을 마셔요.", emoji: "🧒💧", label: "무엇을 마시는지 찾아요", question: "아이가 무엇을 마시나요?", answer: "물", choices: [{ text: "아이", emoji: "🧒" }, { text: "물", emoji: "💧" }, { text: "우산", emoji: "☂️" }, { text: "마셔요", emoji: "🙂" }] },
        { title: "우산을 들어요", sentence: "엄마가 우산을 들어요.", emoji: "👩☂️", label: "무엇을 드는지 찾아요", question: "엄마가 무엇을 드나요?", answer: "우산", choices: [{ text: "엄마", emoji: "👩" }, { text: "우산", emoji: "☂️" }, { text: "비", emoji: "🌧️" }, { text: "들어요", emoji: "🙋" }] },
        { title: "당근을 먹어요", sentence: "토끼가 당근을 먹어요.", emoji: "🐰🥕", label: "무엇을 먹는지 찾아요", question: "토끼가 무엇을 먹나요?", answer: "당근", choices: [{ text: "토끼", emoji: "🐰" }, { text: "당근", emoji: "🥕" }, { text: "공원", emoji: "🌳" }, { text: "먹어요", emoji: "🍽️" }] }
    ];

    setupSentencePractice(examples, "무엇을 했는지 잘 골랐어요.");
})();
