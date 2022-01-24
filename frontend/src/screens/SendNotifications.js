import { Button } from "@mui/material";
import React from "react";
import * as push from "../api/push";

function SendNotifications() {
  const sendSimpleNotification = () => {
    new Notification("Hi there!");
  };

  const handleSendPushNotification = () => {
    push.sendPush("Olá mundo");
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
        <Button variant="outlined" onClick={handleSendPushNotification}>
          PUSH
        </Button>
      </div>
    </div>
  );
}

export default SendNotifications;
