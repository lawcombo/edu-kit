window.createPhonemicPractice({
    mode: "same",
    examples: [
        { word: "가방", options: [{ text: "고기", correct: true }, { text: "나무" }, { text: "바다" }], answer: "고기", speak: "가방과 같은 첫소리, 고기" },
        { word: "나비", options: [{ text: "모자" }, { text: "노래", correct: true }, { text: "사과" }], answer: "노래", speak: "나비와 같은 첫소리, 노래" },
        { word: "다리", options: [{ text: "도토리", correct: true }, { text: "코끼리" }, { text: "라면" }], answer: "도토리", speak: "다리와 같은 첫소리, 도토리" },
        { word: "바다", options: [{ text: "사탕" }, { text: "버스", correct: true }, { text: "하마" }], answer: "버스", speak: "바다와 같은 첫소리, 버스" },
        { word: "사과", options: [{ text: "소나무", correct: true }, { text: "고래" }, { text: "다람쥐" }], answer: "소나무", speak: "사과와 같은 첫소리, 소나무" },
        { word: "코끼리", options: [{ text: "토마토" }, { text: "카메라", correct: true }, { text: "나비" }], answer: "카메라", speak: "코끼리와 같은 첫소리, 카메라" }
    ]
});
