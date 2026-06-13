(function() {
    if (!("serviceWorker" in navigator)) return;

    let refreshing = false;
    let waitingWorker = null;

    function showUpdateNotice() {
        if (document.querySelector(".pwa-update-notice")) return;

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
