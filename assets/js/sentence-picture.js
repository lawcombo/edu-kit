(function() {
    const examples = [
        { title: "사과 먹는 장면", sentence: "민수가 사과를 먹어요.", emoji: "👦🍎", label: "문장과 같은 장면을 골라요", question: "알맞은 그림은 무엇일까요?", answer: "사과 먹기", choices: [{ text: "사과 먹기", emoji: "👦🍎" }, { text: "책 읽기", emoji: "👧📚" }, { text: "공 던지기", emoji: "👨⚽" }, { text: "우유 마시기", emoji: "👩🥛" }] },
        { title: "책 읽는 장면", sentence: "지우가 책을 읽어요.", emoji: "👧📚", label: "문장과 같은 장면을 골라요", question: "알맞은 그림은 무엇일까요?", answer: "책 읽기", choices: [{ text: "공원 뛰기", emoji: "🐶🌳" }, { text: "책 읽기", emoji: "👧📚" }, { text: "그림 그리기", emoji: "🧒🎨" }, { text: "노래 부르기", emoji: "👩🎵" }] },
        { title: "공원에서 뛰는 장면", sentence: "강아지가 공원에서 뛰어요.", emoji: "🐶🏃", label: "문장과 같은 장면을 골라요", question: "알맞은 그림은 무엇일까요?", answer: "공원 뛰기", choices: [{ text: "공원 뛰기", emoji: "🐶🏃" }, { text: "시장 가기", emoji: "👵🛒" }, { text: "우산 들기", emoji: "☂️🌧️" }, { text: "물 마시기", emoji: "🧒💧" }] },
        { title: "우산 드는 장면", sentence: "엄마가 우산을 들어요.", emoji: "👩☂️", label: "문장과 같은 장면을 골라요", question: "알맞은 그림은 무엇일까요?", answer: "우산 들기", choices: [{ text: "우산 들기", emoji: "👩☂️" }, { text: "요리하기", emoji: "👩🍳" }, { text: "공 던지기", emoji: "👨⚽" }, { text: "글씨 쓰기", emoji: "🧑‍🏫✏️" }] },
        { title: "그림 그리는 장면", sentence: "아이가 그림을 그려요.", emoji: "🧒🎨", label: "문장과 같은 장면을 골라요", question: "알맞은 그림은 무엇일까요?", answer: "그림 그리기", choices: [{ text: "노래 부르기", emoji: "🎤🎵" }, { text: "그림 그리기", emoji: "🧒🎨" }, { text: "책 읽기", emoji: "📚👀" }, { text: "사과 먹기", emoji: "🍎🍽️" }] },
        { title: "시장에서 사는 장면", sentence: "할머니가 시장에서 과일을 사요.", emoji: "👵🛒", label: "문장과 같은 장면을 골라요", question: "알맞은 그림은 무엇일까요?", answer: "과일 사기", choices: [{ text: "그네 타기", emoji: "🛝🌈" }, { text: "공부하기", emoji: "🏫📖" }, { text: "과일 사기", emoji: "👵🍊" }, { text: "물 마시기", emoji: "💧🙂" }] }
    ];

    setupSentencePractice(examples, "문장과 맞는 장면을 잘 골랐어요.");
})();
