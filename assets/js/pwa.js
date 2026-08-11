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
            .pwa-update-notice {
                position: fixed;
                left: 50%;
                top: max(12px, env(safe-area-inset-top));
                z-index: 9999;
                width: min(calc(100vw - 28px), 520px);
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 12px;
                padding: 13px 14px;
                border: 1px solid rgba(219, 234, 254, 0.95);
                border-radius: 18px;
                background: #ffffff;
                box-shadow: 0 14px 36px rgba(15, 23, 42, 0.16);
                transform: translateX(-50%);
                box-sizing: border-box;
                letter-spacing: 0;
            }

            .pwa-update-notice strong,
            .pwa-update-notice span {
                display: block;
                letter-spacing: 0;
            }

            .pwa-update-notice strong {
                color: #0f172a;
                font-size: 15px;
                font-weight: 800;
                line-height: 1.3;
            }

            .pwa-update-notice span {
                margin-top: 3px;
                color: #64748b;
                font-size: 12px;
                font-weight: 700;
                line-height: 1.35;
            }

            .pwa-update-notice button {
                min-width: 84px;
                min-height: 40px;
                border: 0;
                border-radius: 14px;
                background: #2563eb;
                color: #ffffff;
                font: inherit;
                font-size: 13px;
                font-weight: 800;
                cursor: pointer;
            }

            @media (max-width: 420px) {
                .pwa-update-notice {
                    width: calc(100vw - 20px);
                    gap: 8px;
                    padding: 11px 12px;
                }

                .pwa-update-notice strong {
                    font-size: 14px;
                }

                .pwa-update-notice span {
                    font-size: 11px;
                }

                .pwa-update-notice button {
                    min-width: 76px;
                    min-height: 38px;
                    font-size: 12px;
                }
            }
        `;
        document.head.appendChild(style);
        noticeStylesReady = true;
    }

    function showUpdateNotice() {
        if (document.querySelector(".pwa-update-notice")) return;
        ensureNoticeStyles();

        const notice = document.createElement("div");
        notice.className = "pwa-update-notice";
        notice.setAttribute("role", "status");
        notice.innerHTML = `
            <div>
                <strong>새 버전이 준비됐어요</strong>
                <span>업데이트를 적용하려면 새로고침해 주세요.</span>
            </div>
            <button type="button">새로고침</button>
        `;

        notice.querySelector("button").addEventListener("click", function() {
            if (!waitingWorker) {
                window.location.reload();
                return;
            }

            waitingWorker.postMessage({ type: "SKIP_WAITING" });
        });

        document.body.appendChild(notice);
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
