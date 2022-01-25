import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import Dialog from "../components/Dialog";
import { useNavigate, Link } from "react-router-dom";
import SubscribePush from "../components/SubscribePush";

const initialDialog = {
  title: "Notificacao",
  text: "",
  show: false,
};

function NotificationAccess() {
  const navigate = useNavigate();
  const [isNotifEnabled, setIsNotifEnabled] = useState(false);

  useEffect(() => {
    if (!("Notification" in window)) {
      setIsNotifEnabled(false);
    } else if (Notification.permission === "granted") {
      setIsNotifEnabled(true);
    } else {
      setIsNotifEnabled(false);
    }
  }, []);

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

  const [dialog, setDialog] = React.useState({
    ...initialDialog,
    onClose: () => {
      setDialog((prev) => ({ ...prev, show: false }));
    },
  });

  const resetDialog = () => {
    setDialog((prev) => ({ ...prev, show: false }));
  };

  const showDialog = (text, onCloseCb) => {
    console.log("Show dialog");
    const title = "Notificação";
    setDialog({
      show: true,
      title,
      text,
      onClose: onCloseCb ?? resetDialog,
    });
  };

  const handleSim = async () => {
    if (!("Notification" in window)) {
      showDialog("Este navegador não suporta notificações");
    } else if (Notification.permission === "denied") {
      showDialog("Você negou as notificações");
    } else if (Notification.permission === "granted") {
      showDialog("Você já aceitou as notificações", () => {
        resetDialog();
        // navigate("/notification");
      });
    } else if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        new Notification("Olá! Bem vindo.");
      } else {
        showDialog("Você não aceitou receber notificações.");
      }
    }
  };

  useEffect(() => {
    if ("Notification" in window) {
      console.log("notif perm", Notification.permission);
      // if (Notification.permission === "granted") {
      //   navigate("/notification");
      // }
    }
  }, [navigate]);

  const handleNao = () => {
    showDialog("Você não aceitou as notificacoes");
  };

  const habilitarNotif = (
    <>
      <h1>Habilitar Notificações?</h1>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        <Button variant="outlined" color="error" onClick={handleNao}>
          NÃO
        </Button>
        <Button variant="outlined" onClick={handleSim}>
          SIM
        </Button>
      </div>
    </>
  );

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {habilitarNotif}
      {
        <>
          <h1>Assinar serviço de push?</h1>
          <div
            style={{
              flex: "1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <SubscribePush />
          </div>
        </>
      }

      {(isNotifEnabled || isSubscribed) && (
        <div style={{ marginTop: "50px" }}>
          <Button component={Link} to="/notification" variant="outlined">
            Testar notificações
          </Button>
        </div>
      )}
      <Dialog
        title={dialog.title}
        text={dialog.text}
        onClose={dialog.onClose}
        show={dialog.show}
      />
    </div>
  );
}

export default NotificationAccess;
