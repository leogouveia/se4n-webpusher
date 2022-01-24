export function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    // eslint-disable-next-line no-useless-escape
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const BASE_URL = process.env.REACT_APP_API_URL;

export const subscribePush = async () => {
  try {
    const registration = await navigator.serviceWorker.ready;

    const response = await fetch(BASE_URL + "/api/push/vapid-keys");
    const publicVapidKey = await response.text();

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    });

    const res = await fetch(BASE_URL + "/api/push/subscribe", {
      method: "POST",
      body: JSON.stringify({ subscription }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.error(res);
      throw Error("Failed to subscribe push");
    }

    const resSubs = await res.json();

    console.log(resSubs);
    if ("localStorage" in window) {
      localStorage.setItem("pushSubscription", resSubs.subscription_id);
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const unsubscribePush = async () => {
  return navigator.serviceWorker.ready
    .then((registration) => {
      console.log("registration", registration);
      return registration.pushManager.getSubscription();
    })
    .then(async (subscription) => {
      console.log("subscription", subscription);
      if (!subscription) {
        console.log("No subscription to unsubscribe.");
        return true;
      }

      await subscription.unsubscribe();

      if ("localStorage" in window) {
        localStorage.removeItem("pushSubscription");
      }

      await fetch(BASE_URL + "/api/push/unsubscribe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subscription }),
      });

      return true;
    })
    .catch((err) => {
      console.log("Error during getSubscription()", err);
      return false;
    });
};

export const sendPush = async (message = "Teste de notificação") => {
  const pushId = localStorage.getItem("pushSubscription");
  if (!pushId) {
    return {
      success: false,
      message: "Usuário não está inscrito em notificações",
    };
  }
  await fetch(BASE_URL + "/api/push/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      pushId,
      message,
    }),
  });
};
