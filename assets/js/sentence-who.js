(function() {
    const examples = [
        { title: "민수가 먹어요", sentence: "민수가 사과를 먹어요.", emoji: "👦🍎", label: "누가 먹는지 찾아요", question: "누가 사과를 먹나요?", answer: "민수", choices: [{ text: "민수", emoji: "👦" }, { text: "사과", emoji: "🍎" }, { text: "학교", emoji: "🏫" }, { text: "먹어요", emoji: "🍽️" }] },
        { title: "지우가 읽어요", sentence: "지우가 책을 읽어요.", emoji: "👧📚", label: "누가 책을 읽는지 찾아요", question: "누가 책을 읽나요?", answer: "지우", choices: [{ text: "지우", emoji: "👧" }, { text: "책", emoji: "📚" }, { text: "도서관", emoji: "🏫" }, { text: "읽어요", emoji: "👀" }] },
        { title: "강아지가 뛰어요", sentence: "강아지가 공원에서 뛰어요.", emoji: "🐶🌳", label: "누가 뛰는지 찾아요", question: "누가 공원에서 뛰나요?", answer: "강아지", choices: [{ text: "강아지", emoji: "🐶" }, { text: "공원", emoji: "🌳" }, { text: "공", emoji: "⚽" }, { text: "뛰어요", emoji: "🏃" }] },
        { title: "엄마가 마셔요", sentence: "엄마가 우유를 마셔요.", emoji: "👩🥛", label: "누가 우유를 마시는지 찾아요", question: "누가 우유를 마시나요?", answer: "엄마", choices: [{ text: "엄마", emoji: "👩" }, { text: "우유", emoji: "🥛" }, { text: "컵", emoji: "🥤" }, { text: "마셔요", emoji: "🙂" }] },
        { title: "선생님이 써요", sentence: "선생님이 칠판에 글씨를 써요.", emoji: "🧑‍🏫✏️", label: "누가 글씨를 쓰는지 찾아요", question: "누가 글씨를 쓰나요?", answer: "선생님", choices: [{ text: "선생님", emoji: "🧑‍🏫" }, { text: "칠판", emoji: "🟩" }, { text: "글씨", emoji: "✏️" }, { text: "써요", emoji: "📝" }] },
        { title: "토끼가 먹어요", sentence: "토끼가 당근을 먹어요.", emoji: "🐰🥕", label: "누가 당근을 먹는지 찾아요", question: "누가 당근을 먹나요?", answer: "토끼", choices: [{ text: "토끼", emoji: "🐰" }, { text: "당근", emoji: "🥕" }, { text: "밭", emoji: "🌱" }, { text: "먹어요", emoji: "🍽️" }] }
    ];

    setupSentencePractice(examples, "누가 했는지 잘 찾았어요.");
})();
