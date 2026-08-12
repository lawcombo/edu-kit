(function() {
    if (!("serviceWorker" in navigator)) return;

    let refreshing = false;
    let waitingWorker = null;
    let noticeStylesReady = false;

    function ensureNoticeStyles() {
        if (noticeStylesReady || document.getElementById("pwa-update-notice-style")) return;

        const style = document.createElement("style");
        style.id = "pwa-update-notice-style";
        style.textContent = `
            .pwa-update-backdrop {
                position: fixed;
                inset: 0;
                z-index: 9998;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 22px;
                background: rgba(15, 23, 42, 0.46);
                backdrop-filter: blur(5px);
                box-sizing: border-box;
            }

            .pwa-update-notice {
                position: relative;
                left: auto;
                top: auto;
                z-index: auto;
                width: min(calc(100vw - 44px), 330px);
                display: grid;
                align-items: stretch;
                justify-content: stretch;
                gap: 14px;
                padding: 22px 20px 18px;
                border: 1px solid rgba(56, 189, 248, 0.28);
                border-radius: 22px;
                background: linear-gradient(145deg, #1e40af 0%, #2563eb 52%, #0891b2 100%);
                box-shadow: 0 24px 60px rgba(15, 23, 42, 0.34);
                transform: none;
                box-sizing: border-box;
                color: #ffffff;
                text-align: center;
                letter-spacing: 0;
                pointer-events: auto;
            }

            .pwa-update-notice strong,
            .pwa-update-notice span {
                display: block;
                letter-spacing: 0;
            }

            .pwa-update-notice strong {
                color: #ffffff;
                font-size: 18px;
                font-weight: 900;
                line-height: 1.28;
            }

            .pwa-update-notice span {
                margin-top: 6px;
                color: rgba(239, 246, 255, 0.9);
                font-size: 13px;
                font-weight: 700;
                line-height: 1.45;
            }

            .pwa-update-notice button {
                width: 100%;
                min-height: 44px;
                border: 0;
                border-radius: 999px;
                background: #ffffff;
                color: #1d4ed8;
                font: inherit;
                font-size: 14px;
                font-weight: 900;
                cursor: pointer;
                box-shadow: 0 10px 26px rgba(15, 23, 42, 0.18);
            }

            .pwa-update-notice button:disabled {
                cursor: wait;
                opacity: 0.72;
            }

            @media (max-width: 420px) {
                .pwa-update-backdrop {
                    padding: 18px;
                }

                .pwa-update-notice {
                    width: min(calc(100vw - 36px), 310px);
                    gap: 12px;
                    padding: 20px 18px 16px;
                }

                .pwa-update-notice strong {
                    font-size: 17px;
                }

                .pwa-update-notice span {
                    font-size: 12px;
                }

                .pwa-update-notice button {
                    min-height: 42px;
                    font-size: 13px;
                }
            }
        `;
        document.head.appendChild(style);
        noticeStylesReady = true;
    }

    function showUpdateNotice() {
        if (document.querySelector(".pwa-update-backdrop")) return;
        ensureNoticeStyles();

        const backdrop = document.createElement("div");
        backdrop.className = "pwa-update-backdrop";
        backdrop.setAttribute("role", "presentation");

        const notice = document.createElement("div");
        notice.className = "pwa-update-notice";
        notice.setAttribute("role", "dialog");
        notice.setAttribute("aria-modal", "true");
        notice.setAttribute("aria-labelledby", "pwaUpdateTitle");
        notice.innerHTML = `
            <div>
                <strong id="pwaUpdateTitle">새 버전이 준비됐어요</strong>
                <span>새로고침하면 바로 업데이트가 적용돼요</span>
            </div>
            <button type="button">새로고침</button>
        `;

        notice.querySelector("button").addEventListener("click", function() {
            this.disabled = true;

            if (!waitingWorker) {
                window.location.reload();
                return;
            }

            waitingWorker.postMessage({ type: "SKIP_WAITING" });
        });

        backdrop.appendChild(notice);
        document.body.appendChild(backdrop);
    }

    function listenForUpdate(registration) {
        if (registration.waiting && navigator.serviceWorker.controller) {
            waitingWorker = registration.waiting;
            showUpdateNotice();
        }

        registration.addEventListener("updatefound", function() {
            const newWorker = registration.installing;
            if (!newWorker) return;

            newWorker.addEventListener("statechange", function() {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                    waitingWorker = newWorker;
                    showUpdateNotice();
                }
            });
        });
    }

    navigator.serviceWorker.addEventListener("controllerchange", function() {
        if (refreshing) return;
        refreshing = true;
        window.location.reload();
    });

    window.addEventListener("load", function() {
        navigator.serviceWorker.register("./service-worker.js")
            .then(function(registration) {
                listenForUpdate(registration);
                registration.update().catch(function() {});
            })
            .catch(function() {});
    });
})();
