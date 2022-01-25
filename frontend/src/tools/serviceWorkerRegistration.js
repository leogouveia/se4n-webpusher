export const register = async () => {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker
        .register("/push/service-worker.js", { scope: "/push/" })
        .then(
          (registration) => {
            console.log(
              "Service Worker registration sucessful with scope: ",
              registration.scope
            );
            registration.onupdatefound = () => {
              const installingWorker = registration.installing;
              if (installingWorker == null) {
                return;
              }
              installingWorker.onstatechange = () => {
                if (installingWorker.state === "installed") {
                  if (navigator.serviceWorker.controller) {
                    console.log(
                      "New content is available and will be used when all " +
                        "tabs for this page are closed. See https://cra.link/PWA."
                    );
                  } else {
                    // At this point, everything has been precached.
                    // It's the perfect time to display a
                    // "Content is cached for offline use." message.
                    console.log("Content is cached for offline use.");
                  }
                }
              };
            };
          },
          (error) => {
            console.error("Service worker registration failed", error);
            console.error(error);
          }
        );
    });
  }
};
