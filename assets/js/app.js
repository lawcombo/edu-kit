let currentIndex = 0;
    let isAnimating = false;
    let hasResult = false;
    let wordPracticeMode = "all";
    let selectedFinal = null;

    let currentGrammarIndex = 0;
    let isGrammarAnimating = false;
    let hasGrammarResult = false;
    let grammarPracticeMode = "all";
    let selectedParticle = null;
    let selectedEnding = null;

    let currentSentenceIndex = 0;
    let isSentenceAnimating = false;
    let hasSentenceResult = false;

    let currentLongTextIndex = 0;
    let longTextTimerId = null;
    let longTextElapsedMs = 0;
    let longTextStartedAt = 0;
    let longTextRunning = false;
    let longTextPaused = false;
    let longTextSelectedTokenIndex = -1;
    let longTextRangeStartIndex = -1;
    let longTextRangeActive = false;
    let longTextRangeComplete = false;
    let cachedKoreanVoice = null;

    function showPage(pageId) {
        $(".page").removeClass("active");
        $("#" + pageId).addClass("active");

        setTimeout(function() {
            syncPracticeListHeight();
            syncGrammarListHeight();
            syncSentenceListHeight();
        }, 50);
    }

    function isRefreshNavigation() {
        const navigationEntry = window.performance &&
            window.performance.getEntriesByType &&
            window.performance.getEntriesByType("navigation")[0];

        if (navigationEntry) {
            return navigationEntry.type === "reload";
        }

        return window.performance &&
            window.performance.navigation &&
            window.performance.navigation.type === 1;
    }

    function formatLongTextTime(ms) {
        return (ms / 1000).toFixed(1) + "초";
    }

    function updateLongTextTimerDisplay() {
        $("#longTextTimer").text(formatLongTextTime(longTextElapsedMs));
    }

    function setLongTextStatus(text) {
        $("#longTextStatus").text(text);
    }

    function stopLongTextTimer() {
        if (longTextTimerId) {
            clearInterval(longTextTimerId);
            longTextTimerId = null;
        }
    }

    function startLongTextTimer() {
        stopLongTextTimer();
        longTextStartedAt = Date.now() - longTextElapsedMs;
        longTextRunning = true;
        longTextPaused = false;
        setLongTextStatus("진행 중");

        longTextTimerId = setInterval(function() {
            longTextElapsedMs = Date.now() - longTextStartedAt;
            updateLongTextTimerDisplay();
        }, 100);
    }

    function resetLongTextTimer() {
        stopLongTextTimer();
        longTextElapsedMs = 0;
        longTextRunning = false;
        longTextPaused = false;
        longTextSelectedTokenIndex = -1;
        longTextRangeStartIndex = -1;
        longTextRangeActive = false;
        longTextRangeComplete = false;
        updateLongTextTimerDisplay();
        $("#longTextCheckpoint").text("-");
        setLongTextStatus("대기");
        clearLongTextHighlight();
    }

    function syncPracticeListHeight() {
        const $wordListBox = $(".word-list");
        const $practicePanel = $(".practice-panel");
        const $practiceLayout = $("#practiceLayout");

        if (!$wordListBox.length || !$practicePanel.length || !$practiceLayout.length) return;

        if (
            window.innerWidth > 820 &&
            $("#pageWordPractice").hasClass("active") &&
            $practiceLayout.hasClass("list-open")
        ) {
            const panelHeight = $practicePanel.outerHeight();
            $wordListBox.css({
                height: panelHeight + "px",
                maxHeight: panelHeight + "px",
                overflowY: "auto"
            });
        } else {
            $wordListBox.css({
                height: "",
                maxHeight: "",
                overflowY: ""
            });
        }
    }

    function getProcessMessage(item) {
		return item.leftSyllable 
			+ " + " 
			+ item.rightSyllable 
			+ " 이어 말하면 <span class='highlight-result'>" 
			+ item.result 
			+ "</span>처럼 들려요.";
	}

    function setProcessText(message) {
        const $processText = $("#processText");

        $processText
            .stop(true, true)
            .fadeTo(80, 0.35, function() {
                $(this).html(message).fadeTo(120, 1);
            });
    }

    function speakText(text) {
        if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) return false;

        window.speechSynthesis.cancel();

        const utterance = new window.SpeechSynthesisUtterance(text);
        utterance.lang = "ko-KR";
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        const koreanVoice = getKoreanVoice();

        if (koreanVoice) {
            utterance.voice = koreanVoice;
        }

        window.speechSynthesis.speak(utterance);

        if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
        }

        return true;
    }

    function getKoreanVoice() {
        if (!window.speechSynthesis) return null;

        const voices = window.speechSynthesis.getVoices();

        cachedKoreanVoice = voices.find(function(voice) {
            return voice.lang === "ko-KR" || voice.lang.indexOf("ko") === 0;
        }) || voices.find(function(voice) {
            return voice.lang && voice.lang.indexOf("ko") === 0;
        }) || cachedKoreanVoice || null;

        return cachedKoreanVoice;
    }

    function primeSpeechSynthesis() {
        if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) return;

        try {
            const utterance = new window.SpeechSynthesisUtterance(".");
            utterance.lang = "ko-KR";
            utterance.volume = 0;
            utterance.rate = 1;

            const koreanVoice = getKoreanVoice();
            if (koreanVoice) {
                utterance.voice = koreanVoice;
            }

            window.speechSynthesis.speak(utterance);
            if (window.speechSynthesis.paused) {
                window.speechSynthesis.resume();
            }
        } catch (error) {
            // TTS support differs by browser; practice screens still work without audio.
        }
    }


    function getCurrentWordData() {
        if (wordPracticeMode === "final" && selectedFinal) {
            return wordData.filter(function(item) {
                return item.final === selectedFinal;
            });
        }

        return wordData;
    }

    function getFinalInfo(finalValue) {
        return finalCategoryData.find(function(item) {
            return item.final === finalValue;
        });
    }

    function getFinalExamples(finalValue) {
        return wordData
            .filter(function(item) {
                return item.final === finalValue;
            })
            .slice(0, 3)
            .map(function(item) {
                return item.written;
            })
            .join(", ");
    }

    function renderFinalCategoryList() {
        const $list = $("#finalCategoryList");
        $list.empty();

        finalCategoryData.forEach(function(item) {
            const count = wordData.filter(function(word) {
                return word.final === item.final;
            }).length;

            if (count === 0) return;

            const examples = getFinalExamples(item.final);

            $list.append(`
                <button class="final-card" type="button" data-final="${item.final}">
                    <div class="final-symbol">${item.final}</div>
                    <div class="final-title">${item.title}</div>
                    <div class="final-desc">${item.desc}</div>
                    <div class="final-meta">
                        <span class="final-chip">${count}개 연습</span>
                        <span class="final-chip">예: ${examples}</span>
                    </div>
                </button>
            `);
        });
    }

    function setWordPracticeMode(mode, finalValue) {
        wordPracticeMode = mode || "all";
        selectedFinal = finalValue || null;
        currentIndex = 0;

        const finalInfo = selectedFinal ? getFinalInfo(selectedFinal) : null;

        if (wordPracticeMode === "final" && finalInfo) {
            $("#wordPracticeHeading").text(finalInfo.title + " 연음화 연습");
            $("#wordListTitle").text(finalInfo.title + " 목록");
            $("#practiceWordLabel").text(finalInfo.title + " 단어");
            $("#wordPracticeNote").html(
                "선택한 받침만 반복해서 보며,<br>" +
                "<strong>" + finalInfo.guide + "</strong>"
            );
        } else {
            $("#wordPracticeHeading").text("단어 연음화 연습");
            $("#wordListTitle").text("연습 목록");
            $("#practiceWordLabel").text("원래 단어");
            $("#wordPracticeNote").html(
                "치료 상황에서는 애니메이션을 본 뒤,<br>" +
                "<strong>글자 읽기 → 연결 발음 따라 말하기 → 스스로 말하기</strong> " +
                "순서로 연습할 수 있습니다."
            );
        }

        renderWordList();
        setPractice(0);
    }

    function renderWordList() {
        const list = getCurrentWordData();
        $("#wordList").empty();

        list.forEach(function(item, index) {
            const activeClass = index === currentIndex ? "active" : "";

            $("#wordList").append(`
                <button class="word-item ${activeClass}" data-index="${index}">
                    ${item.desc}
                </button>
            `);
        });
    }

    function applyTargetPosition() {
        const item = getCurrentWordData()[currentIndex] || wordData[0];

        const cardWidth = $("#rightCard").innerWidth();
        const cardHeight = $("#rightCard").innerHeight();

        const left = (item.targetLeft / 180) * cardWidth;
        const top = (item.targetTop / 185) * cardHeight;

        $("#rightTargetMarker").css({
            left: left + "px",
            top: top + "px"
        });

        $("#rightEraseCover").css({
            left: left + "px",
            top: top + "px"
        });

        $("#rightInsertMarker").css({
            left: left + "px",
            top: top + "px"
        });
    }

    function getElementCenterPoint($element) {
        const rect = $element[0].getBoundingClientRect();

        return {
            x: rect.left + rect.width / 2,
            y: rect.top + rect.height / 2
        };
    }

    function placeMovingLetterAtCenter($moving, point) {
        const movingWidth = $moving.outerWidth();
        const movingHeight = $moving.outerHeight();

        $moving.css({
            left: (point.x - movingWidth / 2) + "px",
            top: (point.y - movingHeight / 2) + "px"
        });
    }

    function resetAnimationState() {
        const item = getCurrentWordData()[currentIndex] || wordData[0];

        $(".moving-letter").remove();

        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }

        applyTargetPosition();

        $("#leftSyllableText")
            .stop(true, true)
            .text(item.leftSyllable)
            .css({
                opacity: 1,
                color: "#0f172a"
            });

        $("#leftBaseText")
            .stop(true, true)
            .text(item.leftBase)
            .css({
                opacity: 0
            });

        $("#rightSyllableText")
            .stop(true, true)
            .text(item.rightSyllable)
            .css({
                opacity: 1,
                color: "#0f172a"
            });

        $("#rightChangedText")
            .stop(true, true)
            .text(item.changedRight)
            .css({
                opacity: 0
            });

        $("#finalMarker")
            .stop(true, true)
            .text(item.final)
            .css({
                opacity: 0,
                transform: "translateX(-50%) scale(0.5)"
            });

        $("#rightEraseCover")
            .stop(true, true)
            .css({
                opacity: 0,
                transform: "translateX(-50%) scale(0.5)"
            });

        $("#rightInsertMarker")
            .stop(true, true)
            .text(item.final)
            .css({
                opacity: 0,
                transform: "translateX(-50%) scale(0.5)"
            });

        $("#writtenText").text(item.written);
        $("#pronounceText").text("?");

        setProcessText(getProcessMessage(item));

        hasResult = false;
    }

    function setPractice(index) {
        const list = getCurrentWordData();
        currentIndex = Math.max(0, Math.min(index, list.length - 1));
        const item = list[currentIndex] || wordData[0];

        $(".word-item").removeClass("active");
        $(`.word-item[data-index='${currentIndex}']`).addClass("active");

        $("#practiceTitle").text(item.written);

        resetAnimationState();
        isAnimating = false;
        syncPracticeListHeight();

        setTimeout(function() {
            const activeWord = document.querySelector(".word-item.active");
            const wordList = document.getElementById("wordList");

            if (activeWord && wordList && window.innerWidth <= 820) {
                const activeTop = activeWord.offsetTop;
                const activeBottom = activeTop + activeWord.offsetHeight;
                const visibleTop = wordList.scrollTop;
                const visibleBottom = visibleTop + wordList.clientHeight;

                if (activeTop < visibleTop || activeBottom > visibleBottom) {
                    wordList.scrollTo({
                        top: Math.max(activeTop - 12, 0),
                        behavior: "smooth"
                    });
                }
            }
        }, 50);
    }

    function playAnimation() {
        if (isAnimating) return;

        isAnimating = true;
        resetAnimationState();

        const item = getCurrentWordData()[currentIndex] || wordData[0];

        const $leftSyllableText = $("#leftSyllableText");
        const $leftBaseText = $("#leftBaseText");
        const $rightSyllableText = $("#rightSyllableText");
        const $rightChangedText = $("#rightChangedText");
        const $finalMarker = $("#finalMarker");
        const $rightTargetMarker = $("#rightTargetMarker");
        const $rightEraseCover = $("#rightEraseCover");
        const $rightInsertMarker = $("#rightInsertMarker");

        setProcessText(getProcessMessage(item));

        setTimeout(function() {
            $finalMarker.animate({
                opacity: 1
            }, {
                duration: 300,
                step: function(now) {
                    $(this).css("transform", "translateX(-50%) scale(" + (0.5 + now * 0.5) + ")");
                }
            });

            $leftSyllableText.animate({
                opacity: 0.35
            }, 300);
        }, 120);

        setTimeout(function() {
            const startPoint = getElementCenterPoint($finalMarker);
            const endPoint = getElementCenterPoint($rightTargetMarker);

            const $moving = $("<div class='moving-letter'></div>");
            $moving.text(item.final);
            $("body").append($moving);

            placeMovingLetterAtCenter($moving, startPoint);

            $finalMarker.animate({
                opacity: 0
            }, 180);

            $moving.animate({
                left: (endPoint.x - $moving.outerWidth() / 2) + "px",
                top: (endPoint.y - $moving.outerHeight() / 2) + "px"
            }, 900, "swing", function() {
                $rightEraseCover.animate({
                    opacity: 1
                }, {
                    duration: 250,
                    step: function(now) {
                        $(this).css("transform", "translateX(-50%) scale(" + (0.5 + now * 0.5) + ")");
                    }
                });

                $rightSyllableText.animate({
                    opacity: 0.35
                }, 250);

                setTimeout(function() {
                    $moving.fadeOut(120, function() {
                        $(this).remove();
                    });

                    $rightInsertMarker.animate({
                        opacity: 1
                    }, {
                        duration: 250,
                        step: function(now) {
                            $(this).css("transform", "translateX(-50%) scale(" + (0.5 + now * 0.5) + ")");
                        }
                    });
                }, 160);

                setTimeout(function() {
                    $leftSyllableText.animate({
                        opacity: 0
                    }, 160);

                    $leftBaseText.animate({
                        opacity: 1
                    }, 220);

                    $rightSyllableText.animate({
                        opacity: 0
                    }, 160);

                    $rightChangedText.animate({
                        opacity: 1
                    }, 220);

                    $rightEraseCover.animate({
                        opacity: 0
                    }, 120);

                    $rightInsertMarker.animate({
                        opacity: 0
                    }, 120);

                    $("#pronounceText")
                        .hide()
                        .text(item.result)
                        .fadeIn(250, function() {
                            speakText(item.result);
                        });

                    setProcessText(getProcessMessage(item));

                    hasResult = true;
                    isAnimating = false;
                }, 650);
            });
        }, 650);
    }



    function getCurrentGrammarData() {
        if (grammarPracticeMode === "particle" && selectedParticle) {
            return particlePracticeData.filter(function(item) {
                return item.particle === selectedParticle;
            });
        }

        if (grammarPracticeMode === "ending" && selectedEnding) {
            return endingPracticeData.filter(function(item) {
                return item.ending === selectedEnding;
            });
        }

        return grammarData;
    }

    function getParticleInfo(particleValue) {
        return particleCategoryData.find(function(item) {
            return item.particle === particleValue;
        });
    }

    function getEndingInfo(endingValue) {
        return endingCategoryData.find(function(item) {
            return item.ending === endingValue;
        });
    }

    function getParticleExamples(particleValue) {
        return particlePracticeData
            .filter(function(item) {
                return item.particle === particleValue;
            })
            .slice(0, 3)
            .map(function(item) {
                return item.written;
            })
            .join(", ");
    }

    function getEndingExamples(endingValue) {
        return endingPracticeData
            .filter(function(item) {
                return item.ending === endingValue;
            })
            .slice(0, 3)
            .map(function(item) {
                return item.written;
            })
            .join(", ");
    }

    function renderParticleCategoryList() {
        const $list = $("#particleCategoryList");
        $list.empty();

        particleCategoryData.forEach(function(item) {
            const count = particlePracticeData.filter(function(grammar) {
                return grammar.particle === item.particle;
            }).length;

            if (count === 0) return;

            const examples = getParticleExamples(item.particle);

            $list.append(`
                <button class="final-card" type="button" data-particle="${item.particle}">
                    <div class="final-symbol">${item.particle}</div>
                    <div class="final-title">${item.title}</div>
                    <div class="final-desc">${item.desc}</div>
                    <div class="final-meta">
                        <span class="final-chip">${count}개 연습</span>
                        <span class="final-chip">예: ${examples}</span>
                    </div>
                </button>
            `);
        });
    }

    function renderEndingCategoryList() {
        const $list = $("#endingCategoryList");
        $list.empty();

        endingCategoryData.forEach(function(item) {
            const count = endingPracticeData.filter(function(grammar) {
                return grammar.ending === item.ending;
            }).length;

            if (count === 0) return;

            const examples = getEndingExamples(item.ending);

            $list.append(`
                <button class="final-card" type="button" data-ending="${item.ending}">
                    <div class="final-symbol">${item.ending}</div>
                    <div class="final-title">${item.title}</div>
                    <div class="final-desc">${item.desc}</div>
                    <div class="final-meta">
                        <span class="final-chip">${count}개 연습</span>
                        <span class="final-chip">예: ${examples}</span>
                    </div>
                </button>
            `);
        });
    }

    function setGrammarPracticeMode(mode, selectedValue) {
        grammarPracticeMode = mode || "all";
        selectedParticle = grammarPracticeMode === "particle" ? (selectedValue || null) : null;
        selectedEnding = grammarPracticeMode === "ending" ? (selectedValue || null) : null;
        currentGrammarIndex = 0;

        const particleInfo = selectedParticle ? getParticleInfo(selectedParticle) : null;
        const endingInfo = selectedEnding ? getEndingInfo(selectedEnding) : null;

        if (grammarPracticeMode === "particle" && particleInfo) {
            $("#grammarPracticeHeading").text(particleInfo.title + " 연음화 연습");
            $("#grammarListTitle").text(particleInfo.title + " 목록");
            $("#grammarPracticeLabel").text(particleInfo.title + " 결합");
            $("#grammarPracticeNote").html(
                "선택한 조사만 반복해서 보며,<br>" +
                "<strong>" + particleInfo.guide + "</strong>"
            );
        } else if (grammarPracticeMode === "ending" && endingInfo) {
            $("#grammarPracticeHeading").text(endingInfo.title + " 연음화 연습");
            $("#grammarListTitle").text(endingInfo.title + " 목록");
            $("#grammarPracticeLabel").text(endingInfo.title + " 결합");
            $("#grammarPracticeNote").html(
                "선택한 어미만 반복해서 보며,<br>" +
                "<strong>" + endingInfo.guide + "</strong>"
            );
        } else {
            $("#grammarPracticeHeading").text("문법형태소 연음화 연습");
            $("#grammarListTitle").text("문법형태소 목록");
            $("#grammarPracticeLabel").text("문법형태소 결합");
            $("#grammarPracticeNote").html(
                "문법형태소 연습에서는 <strong>명사/어간 + 조사/어미</strong>가 이어질 때,<br>" +
                "받침이 뒤 형태소의 첫소리처럼 이동하는 과정을 반복해서 확인할 수 있습니다."
            );
        }

        renderGrammarList();
        setGrammarPractice(0);
    }

    function syncGrammarListHeight() {
        const $wordListBox = $("#grammarPracticeLayout .word-list");
        const $practicePanel = $("#pageGrammarPractice .practice-panel");
        const $practiceLayout = $("#grammarPracticeLayout");

        if (!$wordListBox.length || !$practicePanel.length || !$practiceLayout.length) return;

        if (
            window.innerWidth > 820 &&
            $("#pageGrammarPractice").hasClass("active") &&
            $practiceLayout.hasClass("list-open")
        ) {
            const panelHeight = $practicePanel.outerHeight();
            $wordListBox.css({
                height: panelHeight + "px",
                maxHeight: panelHeight + "px",
                overflowY: "auto"
            });
        } else {
            $wordListBox.css({
                height: "",
                maxHeight: "",
                overflowY: ""
            });
        }
    }

    function getGrammarProcessMessage(item) {
        return item.leftSyllable
            + " + "
            + item.rightSyllable
            + " 이어 말하면 <span class='highlight-result'>"
            + item.result
            + "</span>처럼 들려요.";
    }

    function setGrammarProcessText(message) {
        const $processText = $("#grammarProcessText");

        $processText
            .stop(true, true)
            .fadeTo(80, 0.35, function() {
                $(this).html(message).fadeTo(120, 1);
            });
    }

    function renderGrammarList() {
        const list = getCurrentGrammarData();
        $("#grammarList").empty();

        list.forEach(function(item, index) {
            const activeClass = index === currentGrammarIndex ? "active" : "";

            $("#grammarList").append(`
                <button class="word-item ${activeClass}" data-grammar-index="${index}">
                    ${item.desc}
                </button>
            `);
        });
    }

    function applyGrammarTargetPosition() {
        const item = getCurrentGrammarData()[currentGrammarIndex] || grammarData[0];

        const cardWidth = $("#grammarRightCard").innerWidth();
        const cardHeight = $("#grammarRightCard").innerHeight();

        const left = (item.targetLeft / 180) * cardWidth;
        const top = (item.targetTop / 185) * cardHeight;

        $("#grammarRightTargetMarker").css({
            left: left + "px",
            top: top + "px"
        });

        $("#grammarRightEraseCover").css({
            left: left + "px",
            top: top + "px"
        });

        $("#grammarRightInsertMarker").css({
            left: left + "px",
            top: top + "px"
        });
    }

    function resetGrammarAnimationState() {
        const item = getCurrentGrammarData()[currentGrammarIndex] || grammarData[0];

        $(".moving-letter").remove();

        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }

        applyGrammarTargetPosition();

        const isLongMorpheme = item.rightSyllable.length >= 2 || item.changedRight.length >= 2;

        $("#grammarRightSyllableText, #grammarRightChangedText")
            .toggleClass("long-morpheme-text", isLongMorpheme);

        $("#grammarLeftSyllableText")
            .stop(true, true)
            .text(item.leftSyllable)
            .css({
                opacity: 1,
                color: "#0f172a"
            });

        $("#grammarLeftBaseText")
            .stop(true, true)
            .text(item.leftBase)
            .css({
                opacity: 0
            });

        $("#grammarRightSyllableText")
            .stop(true, true)
            .text(item.rightSyllable)
            .css({
                opacity: 1,
                color: "#0f172a"
            });

        $("#grammarRightChangedText")
            .stop(true, true)
            .text(item.changedRight)
            .css({
                opacity: 0
            });

        $("#grammarFinalMarker")
            .stop(true, true)
            .text(item.final)
            .css({
                opacity: 0,
                transform: "translateX(-50%) scale(0.5)"
            });

        $("#grammarRightEraseCover")
            .stop(true, true)
            .css({
                opacity: 0,
                transform: "translateX(-50%) scale(0.5)"
            });

        $("#grammarRightInsertMarker")
            .stop(true, true)
            .text(item.final)
            .css({
                opacity: 0,
                transform: "translateX(-50%) scale(0.5)"
            });

        $("#grammarWrittenText").text(item.written);
        $("#grammarPronounceText").text("?");
        $("#grammarTypeBadge").text(item.type);

        setGrammarProcessText(getGrammarProcessMessage(item));

        hasGrammarResult = false;
    }

    function setGrammarPractice(index) {
        const list = getCurrentGrammarData();
        currentGrammarIndex = Math.max(0, Math.min(index, list.length - 1));
        const item = list[currentGrammarIndex] || grammarData[0];

        $("#grammarList .word-item").removeClass("active");
        $(`#grammarList .word-item[data-grammar-index='${currentGrammarIndex}']`).addClass("active");

        $("#grammarPracticeTitle").text(item.written);
        $("#grammarTypeBadge").text(item.type);

        resetGrammarAnimationState();
        isGrammarAnimating = false;
        syncGrammarListHeight();

        setTimeout(function() {
            const activeWord = document.querySelector("#grammarList .word-item.active");
            const grammarList = document.getElementById("grammarList");

            if (activeWord && grammarList && window.innerWidth <= 820) {
                const activeTop = activeWord.offsetTop;
                const activeBottom = activeTop + activeWord.offsetHeight;
                const visibleTop = grammarList.scrollTop;
                const visibleBottom = visibleTop + grammarList.clientHeight;

                if (activeTop < visibleTop || activeBottom > visibleBottom) {
                    grammarList.scrollTo({
                        top: Math.max(activeTop - 12, 0),
                        behavior: "smooth"
                    });
                }
            }
        }, 50);
    }

    function playGrammarAnimation() {
        if (isGrammarAnimating) return;

        isGrammarAnimating = true;
        resetGrammarAnimationState();

        const item = getCurrentGrammarData()[currentGrammarIndex] || grammarData[0];

        const $leftSyllableText = $("#grammarLeftSyllableText");
        const $leftBaseText = $("#grammarLeftBaseText");
        const $rightSyllableText = $("#grammarRightSyllableText");
        const $rightChangedText = $("#grammarRightChangedText");
        const $finalMarker = $("#grammarFinalMarker");
        const $rightTargetMarker = $("#grammarRightTargetMarker");
        const $rightEraseCover = $("#grammarRightEraseCover");
        const $rightInsertMarker = $("#grammarRightInsertMarker");

        setGrammarProcessText(getGrammarProcessMessage(item));

        setTimeout(function() {
            $finalMarker.animate({
                opacity: 1
            }, {
                duration: 300,
                step: function(now) {
                    $(this).css("transform", "translateX(-50%) scale(" + (0.5 + now * 0.5) + ")");
                }
            });

            $leftSyllableText.animate({
                opacity: 0.35
            }, 300);
        }, 120);

        setTimeout(function() {
            const startPoint = getElementCenterPoint($finalMarker);
            const endPoint = getElementCenterPoint($rightTargetMarker);

            const $moving = $("<div class='moving-letter'></div>");
            $moving.text(item.final);
            $("body").append($moving);

            placeMovingLetterAtCenter($moving, startPoint);

            $finalMarker.animate({
                opacity: 0
            }, 180);

            $moving.animate({
                left: (endPoint.x - $moving.outerWidth() / 2) + "px",
                top: (endPoint.y - $moving.outerHeight() / 2) + "px"
            }, 900, "swing", function() {
                $rightEraseCover.animate({
                    opacity: 1
                }, {
                    duration: 250,
                    step: function(now) {
                        $(this).css("transform", "translateX(-50%) scale(" + (0.5 + now * 0.5) + ")");
                    }
                });

                $rightSyllableText.animate({
                    opacity: 0.35
                }, 250);

                setTimeout(function() {
                    $moving.fadeOut(120, function() {
                        $(this).remove();
                    });

                    $rightInsertMarker.animate({
                        opacity: 1
                    }, {
                        duration: 250,
                        step: function(now) {
                            $(this).css("transform", "translateX(-50%) scale(" + (0.5 + now * 0.5) + ")");
                        }
                    });
                }, 160);

                setTimeout(function() {
                    $leftSyllableText.animate({
                        opacity: 0
                    }, 160);

                    $leftBaseText.animate({
                        opacity: 1
                    }, 220);

                    $rightSyllableText.animate({
                        opacity: 0
                    }, 160);

                    $rightChangedText.animate({
                        opacity: 1
                    }, 220);

                    $rightEraseCover.animate({
                        opacity: 0
                    }, 120);

                    $rightInsertMarker.animate({
                        opacity: 0
                    }, 120);

                    $("#grammarPronounceText")
                        .hide()
                        .text(item.result)
                        .fadeIn(250, function() {
                            speakText(item.result);
                        });

                    setGrammarProcessText(getGrammarProcessMessage(item));

                    hasGrammarResult = true;
                    isGrammarAnimating = false;
                }, 650);
            });
        }, 650);
    }


    function syncSentenceListHeight() {
        const $wordListBox = $("#sentencePracticeLayout .word-list");
        const $practicePanel = $("#pageSentencePractice .practice-panel");
        const $practiceLayout = $("#sentencePracticeLayout");

        if (!$wordListBox.length || !$practicePanel.length || !$practiceLayout.length) return;

        if (
            window.innerWidth > 820 &&
            $("#pageSentencePractice").hasClass("active") &&
            $practiceLayout.hasClass("list-open")
        ) {
            const panelHeight = $practicePanel.outerHeight();
            $wordListBox.css({
                height: panelHeight + "px",
                maxHeight: panelHeight + "px",
                overflowY: "auto"
            });
        } else {
            $wordListBox.css({
                height: "",
                maxHeight: "",
                overflowY: ""
            });
        }
    }

    function escapeHtml(value) {
        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    function buildSentenceHtml(item, showResult) {
        let source = item.written;
        let html = "";
        let cursor = 0;

        item.targets.forEach(function(target, index) {
            const foundIndex = source.indexOf(target.original, cursor);

            if (foundIndex === -1) return;

            html += escapeHtml(source.slice(cursor, foundIndex));
            html += "<span class='sentence-target" + (showResult ? " changed" : "") + "' data-sentence-target='" + index + "'>";
            html += escapeHtml(showResult ? target.result : target.original);
            html += "</span>";
            cursor = foundIndex + target.original.length;
        });

        html += escapeHtml(source.slice(cursor));
        return html;
    }

    function renderSentenceList() {
        $("#sentenceList").empty();

        sentenceData.forEach(function(item, index) {
            const activeClass = index === currentSentenceIndex ? "active" : "";

            $("#sentenceList").append(`
                <button class="word-item ${activeClass}" data-sentence-index="${index}">
                    ${item.title}
                </button>
            `);
        });
    }

    function renderSentenceChangeCards(item, showResult) {
        const $grid = $("#sentenceChangeGrid");
        $grid.empty();

        item.targets.forEach(function(target) {
            $grid.append(`
                <div class="sentence-change-card">
                    <div class="sentence-change-type">${target.type}</div>
                    <div class="sentence-change-main">
                        ${target.original} <span>→</span> <span class="to-sound">${showResult ? target.result : "?"}</span>
                    </div>
                    <div class="sentence-change-note">${target.note}</div>
                </div>
            `);
        });
    }

    function resetSentenceState() {
        const item = sentenceData[currentSentenceIndex];

        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }

        $("#sentenceDisplay")
            .stop(true, true)
            .html(buildSentenceHtml(item, false))
            .css({ opacity: 1 });

        $("#sentenceGuideText").text(item.guide);
        $("#sentenceLevelBadge").text(item.level);
        $("#sentenceTargetBadge").text("연음화 " + item.targets.length + "곳");
        $("#sentenceResultText").text("?");

        renderSentenceChangeCards(item, false);

        hasSentenceResult = false;
        isSentenceAnimating = false;
    }

    function setSentencePractice(index) {
        currentSentenceIndex = index;

        $("#sentenceList .word-item").removeClass("active");
        $(`#sentenceList .word-item[data-sentence-index='${currentSentenceIndex}']`).addClass("active");

        resetSentenceState();
        syncSentenceListHeight();

        setTimeout(function() {
            const activeWord = document.querySelector("#sentenceList .word-item.active");
            const sentenceList = document.getElementById("sentenceList");

            if (activeWord && sentenceList && window.innerWidth <= 820) {
                const activeTop = activeWord.offsetTop;
                const activeBottom = activeTop + activeWord.offsetHeight;
                const visibleTop = sentenceList.scrollTop;
                const visibleBottom = visibleTop + sentenceList.clientHeight;

                if (activeTop < visibleTop || activeBottom > visibleBottom) {
                    sentenceList.scrollTo({
                        top: Math.max(activeTop - 12, 0),
                        behavior: "smooth"
                    });
                }
            }
        }, 50);
    }

    function playSentenceAnimation() {
        if (isSentenceAnimating) return;

        isSentenceAnimating = true;
        resetSentenceState();

        const item = sentenceData[currentSentenceIndex];
        const $display = $("#sentenceDisplay");

        setTimeout(function() {
            $display.find(".sentence-target").each(function(index) {
                const $target = $(this);
                setTimeout(function() {
                    $target.addClass("ready");
                }, index * 220);
            });
        }, 120);

        setTimeout(function() {
            $display.fadeTo(150, 0.25, function() {
                $(this)
                    .html(buildSentenceHtml(item, true))
                    .fadeTo(220, 1, function() {
                        $(this).find(".sentence-target").addClass("changed");
                    });
            });

            renderSentenceChangeCards(item, true);
            $("#sentenceResultText")
                .hide()
                .text(item.spoken)
                .fadeIn(250, function() {
                    speakText(item.spoken);
                });

            hasSentenceResult = true;
            isSentenceAnimating = false;
        }, 850 + (item.targets.length * 180));
    }

    function renderLongTextList() {
        const $list = $("#longTextList");
        $list.empty();

        longTextData.forEach(function(item, index) {
            const paragraphCount = item.paragraphs.length;
            const wordCount = item.paragraphs.join(" ").split(/\s+/).filter(Boolean).length;

            $list.append(`
                <button class="long-text-card" type="button" data-long-text-index="${index}">
                    <div class="long-text-card-title">${item.title}</div>
                    <div class="long-text-card-desc">${item.guide}</div>
                    <div class="long-text-card-meta">
                        <span class="final-chip">${item.level}</span>
                        <span class="final-chip">${paragraphCount}문단</span>
                        <span class="final-chip">약 ${wordCount}어절</span>
                    </div>
                </button>
            `);
        });
    }

    function buildLongTextParagraphHtml(paragraph, tokenState) {
        return paragraph.split(/(\s+)/).map(function(part) {
            if (/^\s+$/.test(part)) {
                return part;
            }

            const tokenIndex = tokenState.index;
            tokenState.index += 1;

            return `<button class="long-text-token" type="button" data-long-text-token="${tokenIndex}">${escapeHtml(part)}</button>`;
        }).join("");
    }

    function renderLongTextBody(item) {
        const tokenState = { index: 0 };
        const html = item.paragraphs.map(function(paragraph) {
            return `<p class="long-text-paragraph">${buildLongTextParagraphHtml(paragraph, tokenState)}</p>`;
        }).join("");

        $("#longTextBody").html(html);
    }

    function clearLongTextHighlight() {
        $("#longTextBody .long-text-token")
            .removeClass("read-highlight touch-point range-start");
    }

    function applyLongTextHighlight(tokenIndex) {
        clearLongTextHighlight();

        $("#longTextBody .long-text-token").each(function() {
            const currentTokenIndex = Number($(this).data("long-text-token"));

            if (currentTokenIndex <= tokenIndex) {
                $(this).addClass("read-highlight");
            }

            if (currentTokenIndex === tokenIndex) {
                $(this).addClass("touch-point");
            }
        });
    }

    function applyLongTextRangeHighlight(startIndex, endIndex) {
        clearLongTextHighlight();

        $("#longTextBody .long-text-token").each(function() {
            const currentTokenIndex = Number($(this).data("long-text-token"));

            if (currentTokenIndex >= startIndex && currentTokenIndex <= endIndex) {
                $(this).addClass("read-highlight");
            }

            if (currentTokenIndex === startIndex) {
                $(this).addClass("range-start");
            }

            if (currentTokenIndex === endIndex) {
                $(this).addClass("touch-point");
            }
        });
    }

    function markLongTextRangeStart(tokenIndex) {
        clearLongTextHighlight();

        $(`#longTextBody .long-text-token[data-long-text-token='${tokenIndex}']`)
            .addClass("range-start");
    }

    function setLongTextPractice(index) {
        currentLongTextIndex = Math.max(0, Math.min(index, longTextData.length - 1));
        const item = longTextData[currentLongTextIndex];

        stopLongTextTimer();
        longTextElapsedMs = 0;
        longTextRunning = false;
        longTextPaused = false;
        longTextSelectedTokenIndex = -1;
        longTextRangeStartIndex = -1;
        longTextRangeActive = false;
        longTextRangeComplete = false;

        $("#longTextPracticeHeading").text(item.title + " 읽기 연습");
        $("#longTextTitle").text(item.title);
        $("#longTextGuide").text(item.guide);
        $("#longTextLevelBadge").text(item.level);
        $("#longTextLengthBadge").text(item.paragraphs.length + "문단");
        $("#longTextCheckpoint").text("-");
        $("#btnLongTextStart").text("시작");
        setLongTextStatus("대기");
        updateLongTextTimerDisplay();
        renderLongTextBody(item);
    }

    function pauseLongTextAt(tokenIndex) {
        if (!longTextRunning) return;

        longTextElapsedMs = Date.now() - longTextStartedAt;
        stopLongTextTimer();
        longTextRunning = false;
        longTextPaused = true;
        longTextSelectedTokenIndex = tokenIndex;
        longTextRangeStartIndex = -1;
        longTextRangeActive = false;
        longTextRangeComplete = false;

        updateLongTextTimerDisplay();
        $("#longTextCheckpoint").text(formatLongTextTime(longTextElapsedMs));
        $("#btnLongTextStart").text("이어하기");
        setLongTextStatus("멈춤");
        applyLongTextHighlight(tokenIndex);
    }

    function resumeLongText() {
        if (!longTextPaused) return;

        longTextPaused = false;
        longTextSelectedTokenIndex = -1;
        longTextRangeStartIndex = -1;
        longTextRangeActive = false;
        longTextRangeComplete = false;
        clearLongTextHighlight();
        $("#longTextCheckpoint").text("-");
        $("#btnLongTextStart").text("진행 중");
        startLongTextTimer();
    }

    function startLongTextRangeAt(tokenIndex) {
        stopLongTextTimer();
        longTextElapsedMs = 0;
        longTextStartedAt = Date.now();
        longTextRunning = true;
        longTextPaused = false;
        longTextSelectedTokenIndex = -1;
        longTextRangeStartIndex = tokenIndex;
        longTextRangeActive = true;
        longTextRangeComplete = false;

        updateLongTextTimerDisplay();
        $("#longTextCheckpoint").text("-");
        $("#btnLongTextStart").text("진행 중");
        setLongTextStatus("구간 진행 중");
        markLongTextRangeStart(tokenIndex);

        longTextTimerId = setInterval(function() {
            longTextElapsedMs = Date.now() - longTextStartedAt;
            updateLongTextTimerDisplay();
        }, 100);
    }

    function finishLongTextRangeAt(tokenIndex) {
        if (!longTextRangeActive || tokenIndex <= longTextRangeStartIndex) return;

        longTextElapsedMs = Date.now() - longTextStartedAt;
        stopLongTextTimer();
        longTextRunning = false;
        longTextPaused = true;
        longTextSelectedTokenIndex = tokenIndex;
        longTextRangeActive = false;
        longTextRangeComplete = true;

        updateLongTextTimerDisplay();
        $("#longTextCheckpoint").text(formatLongTextTime(longTextElapsedMs));
        $("#btnLongTextStart").text("새 구간 시작");
        setLongTextStatus("구간 완료");
        applyLongTextRangeHighlight(longTextRangeStartIndex, tokenIndex);
    }

    function toggleLongTextAt(tokenIndex) {
        if (longTextRangeComplete) {
            startLongTextRangeAt(tokenIndex);
            return;
        }

        if (longTextRangeActive) {
            finishLongTextRangeAt(tokenIndex);
            return;
        }

        if (longTextPaused) {
            resumeLongText();
            return;
        }

        if (longTextRunning) {
            pauseLongTextAt(tokenIndex);
            return;
        }

        startLongTextRangeAt(tokenIndex);
    }


    $(document).ready(function() {
        renderWordList();
        renderFinalCategoryList();
        renderParticleCategoryList();
        renderEndingCategoryList();
        renderGrammarList();
        renderSentenceList();
        renderLongTextList();
        setPractice(0);
        setGrammarPractice(0);
        setSentencePractice(0);
        setLongTextPractice(0);
        syncPracticeListHeight();
        syncGrammarListHeight();
        syncSentenceListHeight();

        if (window.speechSynthesis) {
            getKoreanVoice();
            window.speechSynthesis.onvoiceschanged = function() {
                getKoreanVoice();
            };
        }

        if (sessionStorage.getItem("eduKitRefreshToLearningType") === "1" || isRefreshNavigation()) {
            sessionStorage.removeItem("eduKitRefreshToLearningType");
            sessionStorage.removeItem("eduKitReturnToPhonology");
            showPage("pageLearningType");
        } else if (sessionStorage.getItem("eduKitReturnToPhonology") === "1") {
            sessionStorage.removeItem("eduKitReturnToPhonology");
            showPage("pagePhonologyType");
        }

        $(window).on("resize orientationchange", function() {
            applyTargetPosition();
            applyGrammarTargetPosition();
            syncPracticeListHeight();
            syncGrammarListHeight();
            syncSentenceListHeight();
        });

        $("#btnAuthOpen").on("click", function() {
            $("#passwordBox").slideDown(250);
            $("#passwordInput").focus();
        });

        $("#btnLogin").on("click", function() {
            const password = $("#passwordInput").val();

            if (password === "1111") {
                $("#loginError").hide();
                showPage("pageLearningType");
            } else {
                $("#loginError").fadeIn(150);
                $("#passwordInput").val("").focus();
            }
        });

        $("#passwordInput").on("keyup", function(e) {
            if (e.key === "Enter") {
                $("#btnLogin").click();
            }
        });

        $("#btnPhonologyType").on("click", function() {
            showPage("pagePhonologyType");
        });

        $("#btnBackLearningTypeFromPhonology").on("click", function() {
            showPage("pageLearningType");
        });

        $("#btnLiaisonType").on("click", function() {
            showPage("pageInfo");
        });

        $("#btnHDeletionType").on("click", function() {
            window.location.href = "h-deletion.html";
        });

        $("#btnTensingType").on("click", function() {
            window.location.href = "tensing.html";
        });

        $("#btnNasalizationType").on("click", function() {
            window.location.href = "nasalization.html";
        });

        $("#btnAspirationType").on("click", function() {
            window.location.href = "aspiration.html";
        });

        $("#btnDoubleFinalType").on("click", function() {
            window.location.href = "double-final.html";
        });

        $("#btnFinalSoundType").on("click", function() {
            window.location.href = "final-sound.html";
        });

        $("#btnBackPhonologyFromInfo").on("click", function() {
            showPage("pagePhonologyType");
        });

        $("#btnStart").on("click", function() {
            showPage("pageCategory");
        });

        $("#btnBackInfoFromCategory").on("click", function() {
            showPage("pageInfo");
        });

        $("#btnWordCategory").on("click", function() {
            $("#practiceLayout").removeClass("list-open");
            $("#btnToggleList")
                .attr("aria-expanded", "false")
                .find(".toggle-label")
                .text("연습목록");

            setWordPracticeMode("all");
            showPage("pageWordPractice");
        });

        $("#btnFinalCategory").on("click", function() {
            renderFinalCategoryList();
            showPage("pageFinalCategory");
        });

        $(document).on("click", "#finalCategoryList .final-card", function() {
            const finalValue = $(this).data("final");

            $("#practiceLayout").removeClass("list-open");
            $("#btnToggleList")
                .attr("aria-expanded", "false")
                .find(".toggle-label")
                .text("연습목록");

            setWordPracticeMode("final", finalValue);
            showPage("pageWordPractice");
        });

        $("#btnParticleCategory").on("click", function() {
            renderParticleCategoryList();
            showPage("pageParticleCategory");
        });

        $(document).on("click", "#particleCategoryList .final-card", function() {
            const particleValue = $(this).data("particle");

            $("#grammarPracticeLayout").removeClass("list-open");
            $("#btnToggleGrammarList")
                .attr("aria-expanded", "false")
                .find(".toggle-label")
                .text("연습목록");

            setGrammarPracticeMode("particle", particleValue);
            showPage("pageGrammarPractice");
        });

        $("#btnEndingCategory").on("click", function() {
            renderEndingCategoryList();
            showPage("pageEndingCategory");
        });

        $(document).on("click", "#endingCategoryList .final-card", function() {
            const endingValue = $(this).data("ending");

            $("#grammarPracticeLayout").removeClass("list-open");
            $("#btnToggleGrammarList")
                .attr("aria-expanded", "false")
                .find(".toggle-label")
                .text("연습목록");

            setGrammarPracticeMode("ending", endingValue);
            showPage("pageGrammarPractice");
        });

        $("#btnGrammarCategory").on("click", function() {
            $("#grammarPracticeLayout").removeClass("list-open");
            $("#btnToggleGrammarList")
                .attr("aria-expanded", "false")
                .find(".toggle-label")
                .text("연습목록");

            setGrammarPracticeMode("all");
            showPage("pageGrammarPractice");
        });



        $("#btnSentenceCategory").on("click", function() {
            $("#sentencePracticeLayout").removeClass("list-open");
            $("#btnToggleSentenceList")
                .attr("aria-expanded", "false")
                .find(".toggle-label")
                .text("연습목록");

            showPage("pageSentencePractice");
            setSentencePractice(currentSentenceIndex);
        });

        $("#btnLongTextCategory").on("click", function() {
            renderLongTextList();
            showPage("pageLongTextList");
        });

        $(document).on("click", "#longTextList .long-text-card", function() {
            const index = Number($(this).data("long-text-index"));
            setLongTextPractice(index);
            showPage("pageLongTextPractice");
        });

        $("#btnBackCategory").on("click", function() {
            if (wordPracticeMode === "final") {
                showPage("pageFinalCategory");
                return;
            }

            showPage("pageCategory");
        });

        $("#btnBackCategoryFromFinal").on("click", function() {
            showPage("pageCategory");
        });

        $("#btnBackCategoryFromParticle").on("click", function() {
            showPage("pageCategory");
        });

        $("#btnBackCategoryFromEnding").on("click", function() {
            showPage("pageCategory");
        });

        $("#btnBackCategoryFromGrammar").on("click", function() {
            if (grammarPracticeMode === "particle") {
                showPage("pageParticleCategory");
                return;
            }

            if (grammarPracticeMode === "ending") {
                showPage("pageEndingCategory");
                return;
            }

            showPage("pageCategory");
        });

        $("#btnBackCategoryFromSentence").on("click", function() {
            showPage("pageCategory");
        });

        $("#btnBackCategoryFromLongTextList").on("click", function() {
            showPage("pageCategory");
        });

        $("#btnBackCategoryFromLongTextPractice").on("click", function() {
            stopLongTextTimer();
            showPage("pageLongTextList");
        });

        $("#btnToggleList").on("click", function() {
            const $practiceLayout = $("#practiceLayout");
            const isOpen = $practiceLayout.toggleClass("list-open").hasClass("list-open");

            $(this).attr("aria-expanded", isOpen ? "true" : "false");
            $(this).find(".toggle-label").text(isOpen ? "목록닫기" : "연습목록");

            setTimeout(function() {
                syncPracticeListHeight();
                applyTargetPosition();
            }, 320);
        });

        $("#btnToggleGrammarList").on("click", function() {
            const $practiceLayout = $("#grammarPracticeLayout");
            const isOpen = $practiceLayout.toggleClass("list-open").hasClass("list-open");

            $(this).attr("aria-expanded", isOpen ? "true" : "false");
            $(this).find(".toggle-label").text(isOpen ? "목록닫기" : "연습목록");

            setTimeout(function() {
                syncGrammarListHeight();
                applyGrammarTargetPosition();
            }, 320);
        });



        $("#btnToggleSentenceList").on("click", function() {
            const $practiceLayout = $("#sentencePracticeLayout");
            const isOpen = $practiceLayout.toggleClass("list-open").hasClass("list-open");

            $(this).attr("aria-expanded", isOpen ? "true" : "false");
            $(this).find(".toggle-label").text(isOpen ? "목록닫기" : "연습목록");

            setTimeout(function() {
                syncSentenceListHeight();
            }, 320);
        });

        $(document).on("click", "#wordList .word-item", function() {
            const index = Number($(this).data("index"));
            setPractice(index);
        });

        $(document).on("click", "#grammarList .word-item", function() {
            const index = Number($(this).data("grammar-index"));
            setGrammarPractice(index);
        });

        $(document).on("click", "#sentenceList .word-item", function() {
            const index = Number($(this).data("sentence-index"));
            setSentencePractice(index);
        });

        $(document).on("click", "#longTextBody .long-text-token", function() {
            const tokenIndex = Number($(this).data("long-text-token"));
            toggleLongTextAt(tokenIndex);
        });

        $("#btnPlay").on("click", function() {
            primeSpeechSynthesis();
            playAnimation();
        });

        $("#btnListenAgain").on("click", function() {
            const item = getCurrentWordData()[currentIndex] || wordData[0];

            if (hasResult) {
                primeSpeechSynthesis();
                speakText(item.result);
            }

            setProcessText(getProcessMessage(item));
        });

        $("#btnNext").on("click", function() {
            const list = getCurrentWordData();
            const nextIndex = (currentIndex + 1) % list.length;
            setPractice(nextIndex);
        });

        $("#btnGrammarPlay").on("click", function() {
            primeSpeechSynthesis();
            playGrammarAnimation();
        });

        $("#btnGrammarListenAgain").on("click", function() {
            const item = getCurrentGrammarData()[currentGrammarIndex] || grammarData[0];

            if (hasGrammarResult) {
                primeSpeechSynthesis();
                speakText(item.result);
            }

            setGrammarProcessText(getGrammarProcessMessage(item));
        });

        $("#btnGrammarNext").on("click", function() {
            const list = getCurrentGrammarData();
            const nextIndex = (currentGrammarIndex + 1) % list.length;
            setGrammarPractice(nextIndex);
        });

        $("#btnSentencePlay").on("click", function() {
            primeSpeechSynthesis();
            playSentenceAnimation();
        });

        $("#btnSentenceListenAgain").on("click", function() {
            const item = sentenceData[currentSentenceIndex];

            if (hasSentenceResult) {
                primeSpeechSynthesis();
                speakText(item.spoken);
            }
        });

        $("#btnSentenceNext").on("click", function() {
            const nextIndex = (currentSentenceIndex + 1) % sentenceData.length;
            setSentencePractice(nextIndex);
        });

        $("#btnLongTextStart").on("click", function() {
            if (longTextRunning) return;

            if (longTextPaused) {
                if (longTextRangeComplete) {
                    resetLongTextTimer();
                    $("#btnLongTextStart").text("시작");
                    return;
                }

                resumeLongText();
                return;
            }

            longTextRangeStartIndex = -1;
            longTextRangeActive = false;
            longTextRangeComplete = false;
            clearLongTextHighlight();
            $("#btnLongTextStart").text("진행 중");
            startLongTextTimer();
        });

        $("#btnLongTextReset").on("click", function() {
            resetLongTextTimer();
            $("#btnLongTextStart").text("시작");
        });

    });

/* 화면 캡처 억제용 공통 스크립트 */
    (function() {
        const GUARD_MESSAGE = '화면 캡처가 감지되어 화면을 보호합니다.';
        let guardActive = false;

        function ensureGuardElements() {
            if (!document.getElementById('captureGuardOverlay')) {
                const overlay = document.createElement('div');
                overlay.id = 'captureGuardOverlay';
                overlay.setAttribute('aria-hidden', 'true');
                overlay.innerHTML = '<div class="capture-guard-box"><div class="capture-guard-title">화면 보호 중</div><p class="capture-guard-text">' + GUARD_MESSAGE + '<br>다시 화면을 클릭하면 보호가 해제됩니다.</p></div>';
                document.body.appendChild(overlay);
            }

        }

        function showGuard() {
            ensureGuardElements();

            const overlay = document.getElementById('captureGuardOverlay');
            if (!overlay) return;

            guardActive = true;
            document.documentElement.classList.add('capture-guard-active');
            document.body.classList.add('capture-guard-active');
            overlay.classList.add('active');
        }

        function hideGuard() {
            const overlay = document.getElementById('captureGuardOverlay');
            if (!overlay || !guardActive) return;

            guardActive = false;
            overlay.classList.remove('active');
            document.documentElement.classList.remove('capture-guard-active');
            document.body.classList.remove('capture-guard-active');
        }

        function blockEvent(e) {
            if (!e) return;
            e.preventDefault();
            e.stopPropagation();
            return false;
        }

        document.addEventListener('DOMContentLoaded', function() {
            ensureGuardElements();
        });

        document.addEventListener('contextmenu', blockEvent, true);
        document.addEventListener('selectstart', blockEvent, true);
        document.addEventListener('dragstart', blockEvent, true);
        document.addEventListener('copy', function(e) {
            showGuard();
            return blockEvent(e);
        }, true);
        document.addEventListener('cut', function(e) {
            showGuard();
            return blockEvent(e);
        }, true);

        document.addEventListener('keydown', function(e) {
            const key = (e.key || '').toLowerCase();
            const code = (e.code || '').toLowerCase();

            const isPrintScreen = key === 'printscreen' || code === 'printscreen';
            const isSave = (e.ctrlKey || e.metaKey) && key === 's';
            const isPrint = (e.ctrlKey || e.metaKey) && key === 'p';
            const isDevTool = key === 'f12' || ((e.ctrlKey || e.metaKey) && e.shiftKey && ['i', 'j', 'c'].includes(key));

            if (isPrintScreen || isSave || isPrint || isDevTool) {
                showGuard();
                return blockEvent(e);
            }
        }, true);

        document.addEventListener('keyup', function(e) {
            const key = (e.key || '').toLowerCase();
            const code = (e.code || '').toLowerCase();

            if (key === 'printscreen' || code === 'printscreen') {
                showGuard();
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText('화면 캡처는 허용되지 않습니다.').catch(function() {});
                }
                return blockEvent(e);
            }
        }, true);

        window.addEventListener('blur', function() {
            showGuard();
        });

        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                showGuard();
            }
        });

        document.addEventListener('pointerdown', function(e) {
            if (!guardActive) return;

            hideGuard();
            return blockEvent(e);
        });
    })();
