import React, { useState, useEffect } from "react";
import { Button, Tooltip } from "@mui/material";
import * as push from "../api/push";

function SendNotifications() {
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    navigator.serviceWorker.ready
      .then((regs) => regs.pushManager.getSubscription())
      .then((subs) => {
        if (!subs) {
          setIsSubscribed(false);
        } else {
          setIsSubscribed(true);
        }
      });
  }, []);

  const sendSimpleNotification = () => {
    new Notification("Hi there!");
  };

  const handleSendPushNotification = async () => {
    await push.sendPush("Olá mundo");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",

        margin: "auto 40px",
      }}
    >
      <h1>Enviar Notificação</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          minWidth: "400px",
        }}
      >
        <Button variant="outlined" onClick={sendSimpleNotification}>
          SIMPLES
        </Button>
        <Tooltip
          title={!isSubscribed ? "Assine o serviço de push para testar." : ""}
          disableInteractive
        >
          <span>
            <Button
              variant="outlined"
              onClick={handleSendPushNotification}
              disabled={!isSubscribed}
            >
              PUSH
            </Button>
          </span>
        </Tooltip>
      </div>
    </div>
  );
}

export default SendNotifications;
