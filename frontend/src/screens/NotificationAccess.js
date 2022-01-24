import React, { useEffect } from "react";
import { Button } from "@mui/material";
import { Box } from "@mui/system";
import Dialog from "../components/Dialog";
import { useNavigate } from "react-router-dom";
import * as push from "../api/push";

const initialDialog = {
  title: "Notificacao",
  text: "",
  show: false,
};

function NotificationAccess() {
  const navigate = useNavigate();

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

  const handleSim = () => {
    if (!("Notification" in window)) {
      showDialog("Este navegador não suporta notificações");
    } else if (Notification.permission === "denied") {
      showDialog("Você negou as notificações");
    } else if (Notification.permission === "granted") {
      showDialog("Você já aceitou as notificações", () => {
        resetDialog();
        navigate("/notification");
      });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission(async (permission) => {
        if (permission === "granted") {
          new Notification("Olá! Bem vindo.");
          navigate("/notification");
          return;
        }
      });
    }
  };

  useEffect(() => {
    if ("Notification" in window) {
      console.log("notif perm", Notification.permission);
      if (Notification.permission === "granted") {
        navigate("/notification");
      }
    }
  }, [navigate]);

  const handleNao = () => {
    showDialog("Você não aceitou as notificacoes");
  };

  return (
    <div>
      <h1>Deseja receber notificações?</h1>
      <Box
        sx={{
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
      </Box>
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
