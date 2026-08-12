(function() {
    const examples = [
        { title: "공원에서 뛰어요", sentence: "강아지가 공원에서 뛰어요.", emoji: "🐶🌳", label: "어디서 뛰는지 찾아요", question: "강아지가 어디서 뛰나요?", answer: "공원", choices: [{ text: "강아지", emoji: "🐶" }, { text: "공원", emoji: "🌳" }, { text: "집", emoji: "🏠" }, { text: "뛰어요", emoji: "🏃" }] },
        { title: "학교에서 공부해요", sentence: "민수가 학교에서 공부해요.", emoji: "👦🏫", label: "어디서 공부하는지 찾아요", question: "민수가 어디서 공부하나요?", answer: "학교", choices: [{ text: "민수", emoji: "👦" }, { text: "학교", emoji: "🏫" }, { text: "시장", emoji: "🛒" }, { text: "공부해요", emoji: "📖" }] },
        { title: "도서관에서 읽어요", sentence: "지우가 도서관에서 책을 읽어요.", emoji: "👧📚", label: "어디서 책을 읽는지 찾아요", question: "지우가 어디서 책을 읽나요?", answer: "도서관", choices: [{ text: "지우", emoji: "👧" }, { text: "도서관", emoji: "📚" }, { text: "놀이터", emoji: "🛝" }, { text: "책", emoji: "📘" }] },
        { title: "부엌에서 요리해요", sentence: "엄마가 부엌에서 요리해요.", emoji: "👩🍳", label: "어디서 요리하는지 찾아요", question: "엄마가 어디서 요리하나요?", answer: "부엌", choices: [{ text: "엄마", emoji: "👩" }, { text: "부엌", emoji: "🍳" }, { text: "학교", emoji: "🏫" }, { text: "요리해요", emoji: "🥘" }] },
        { title: "놀이터에서 타요", sentence: "아이가 놀이터에서 그네를 타요.", emoji: "🧒🛝", label: "어디서 그네를 타는지 찾아요", question: "아이가 어디서 그네를 타나요?", answer: "놀이터", choices: [{ text: "아이", emoji: "🧒" }, { text: "놀이터", emoji: "🛝" }, { text: "방", emoji: "🛏️" }, { text: "그네", emoji: "🌈" }] },
        { title: "시장에서 사요", sentence: "할머니가 시장에서 과일을 사요.", emoji: "👵🛒", label: "어디서 과일을 사는지 찾아요", question: "할머니가 어디서 과일을 사나요?", answer: "시장", choices: [{ text: "할머니", emoji: "👵" }, { text: "시장", emoji: "🛒" }, { text: "공원", emoji: "🌳" }, { text: "과일", emoji: "🍊" }] }
    ];

    setupSentencePractice(examples, "장소를 잘 찾았어요.");
})();
