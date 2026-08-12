(function() {
    const STATE_KEY = "eduKitRoute";
    const MANAGED_KEY = "eduKitManaged";
    const DEFAULT_SELECTOR = ".screen";

    let initialized = false;
    let routeSelector = DEFAULT_SELECTOR;
    let currentRoute = "";
    let suppressObserver = false;
    let pendingBackButton = false;
    let backButtonResetTimer = null;
    let navigateToRoute = null;
    let fallbackBack = null;
    let observer = null;

    function getActiveRoute() {
        const active = document.querySelector(routeSelector + ".active");
        return active ? active.id : "";
    }

    function getCurrentState(route) {
        return {
            [MANAGED_KEY]: true,
            [STATE_KEY]: route || currentRoute || getActiveRoute()
        };
    }

    function writeState(route, replace) {
        const state = getCurrentState(route);
        const method = replace ? "replaceState" : "pushState";

        try {
            window.history[method](state, "", window.location.href);
        } catch (error) {}
    }

    function activateRoute(route) {
        if (!route) return;

        if (typeof navigateToRoute === "function") {
            navigateToRoute(route);
            return;
        }

        const target = document.getElementById(route);
        if (!target) return;

        document.querySelectorAll(routeSelector).forEach((screen) => {
            screen.classList.toggle("active", screen === target);
        });
    }

    function scheduleRouteRead() {
        window.requestAnimationFrame(() => {
            const nextRoute = getActiveRoute();
            if (!nextRoute || nextRoute === currentRoute) return;

            currentRoute = nextRoute;

            if (suppressObserver) return;

            writeState(nextRoute, pendingBackButton);
            pendingBackButton = false;
        });
    }

    function markBackButtonNavigation(event) {
        const target = event.target && event.target.closest &&
            event.target.closest(".back-btn, .back-icon-btn, [id^='btnBack']");

        if (!target) return;

        pendingBackButton = true;
        window.clearTimeout(backButtonResetTimer);
        backButtonResetTimer = window.setTimeout(() => {
            pendingBackButton = false;
        }, 600);
    }

    function handlePopState(event) {
        const state = event.state || {};
        const route = state[STATE_KEY];

        if (route && route !== currentRoute) {
            suppressObserver = true;
            currentRoute = route;
            activateRoute(route);
            window.requestAnimationFrame(() => {
                suppressObserver = false;
            });
            return;
        }

        writeState(currentRoute, false);

        if (typeof fallbackBack === "function") {
            fallbackBack(currentRoute);
        }
    }

    function defaultFallbackBack(route) {
        const activeRoute = route || getActiveRoute();

        if (activeRoute === "infoScreen") {
            const homeBackButton = document.getElementById("btnBackHome");
            if (homeBackButton) {
                homeBackButton.click();
            }
            return;
        }

        if (activeRoute === "practiceScreen") {
            const practiceBackButton = document.getElementById("btnBackSelect") ||
                document.getElementById("btnBackInfo");
            if (practiceBackButton) {
                practiceBackButton.click();
            }
            return;
        }

        if (activeRoute === "selectScreen") {
            const selectBackButton = document.getElementById("btnBackInfo");
            if (selectBackButton) {
                selectBackButton.click();
            }
        }
    }

    function init(options) {
        if (initialized) return;

        const config = options || {};
        routeSelector = config.selector || DEFAULT_SELECTOR;
        navigateToRoute = config.navigate || null;
        fallbackBack = config.fallbackBack || defaultFallbackBack;
        currentRoute = getActiveRoute();

        if (!currentRoute || !window.history || !window.history.pushState) return;

        initialized = true;

        writeState(currentRoute, true);
        writeState(currentRoute, false);

        document.addEventListener("click", markBackButtonNavigation, true);
        window.addEventListener("popstate", handlePopState);

        observer = new MutationObserver(scheduleRouteRead);
        document.querySelectorAll(routeSelector).forEach((screen) => {
            observer.observe(screen, {
                attributes: true,
                attributeFilter: ["class"]
            });
        });
    }

    window.eduKitNavigation = {
        init
    };

    document.addEventListener("DOMContentLoaded", () => {
        if (document.querySelector(".page")) return;
        if (!document.querySelector(DEFAULT_SELECTOR)) return;
        init({ selector: DEFAULT_SELECTOR });
    });
})();
