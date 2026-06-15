(function() {
    let cachedKoreanVoice = null;

    function getKoreanVoice() {
        if (!window.speechSynthesis) return null;

        const voices = window.speechSynthesis.getVoices();
        cachedKoreanVoice = voices.find((voice) => (
            voice.lang === "ko-KR" || (voice.lang && voice.lang.indexOf("ko") === 0)
        )) || cachedKoreanVoice || null;

        return cachedKoreanVoice;
    }

    function speakText(text) {
        if (!text || !window.speechSynthesis || !window.SpeechSynthesisUtterance) return false;

        window.speechSynthesis.cancel();

        const utterance = new window.SpeechSynthesisUtterance(String(text));
        utterance.lang = "ko-KR";
        utterance.rate = 0.88;
        utterance.pitch = 1;
        utterance.volume = 1;

        const voice = getKoreanVoice();
        if (voice) utterance.voice = voice;

        window.speechSynthesis.speak(utterance);
        if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
        }

        return true;
    }

    function primeSpeechSynthesis() {
        if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) return false;

        getKoreanVoice();

        const utterance = new window.SpeechSynthesisUtterance(".");
        utterance.lang = "ko-KR";
        utterance.volume = 0;
        window.speechSynthesis.speak(utterance);

        return true;
    }

    function cancelSpeech() {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
    }

    window.eduKitSpeakText = speakText;
    window.eduKitPrimeSpeechSynthesis = primeSpeechSynthesis;
    window.eduKitCancelSpeech = cancelSpeech;

    if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = getKoreanVoice;
    }
})();
