import { Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import * as push from "../api/push";

function SubscribePush() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subsButtonEnabled, setSubsButtonEnabled] = useState(false);

  useEffect(() => {
    navigator.serviceWorker.ready
      .then((regs) => regs.pushManager.getSubscription())
      .then((subs) => {
        if (!subs) {
          setIsSubscribed(false);
        } else {
          setIsSubscribed(true);
        }
        setSubsButtonEnabled(true);
      });
  }, []);

  const handleSubscribePush = async () => {
    if (Notification.permission === "granted") {
      const isSubscribed = await push.subscribePush();
      if (!isSubscribed) {
        alert("error");
      } else {
        setIsSubscribed(true);
      }
    }
  };

  const handleUnsubscribePush = async () => {
    const teste = await push.unsubscribePush();
    if (teste) {
      setIsSubscribed(false);
    }
    console.log("oi", teste);
  };

  return (
    <>
      {isSubscribed ? (
        <Button
          variant="outlined"
          onClick={handleUnsubscribePush}
          color="warning"
          disabled={!subsButtonEnabled}
        >
          UNSUBSCRIBE PUSH
        </Button>
      ) : (
        <Button
          variant="outlined"
          onClick={handleSubscribePush}
          disabled={!subsButtonEnabled}
        >
          SUBSCRIBE PUSH
        </Button>
      )}
    </>
  );
}

export default SubscribePush;
