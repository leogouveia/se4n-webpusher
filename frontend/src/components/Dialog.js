import { Button, DialogActions, DialogContentText } from "@mui/material";
import MuiDialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import React, { useEffect, useState } from "react";

function Dialog({ title, text, show = false, onClose, afterClose }) {
  const [open, setOpen] = useState(show);

  //   const handleClickOpen = () => {
  //     setOpen(true);
  //   };

  const handleClose = () => {
    setOpen(false);
    console.log("handleClose");
    console.log(onClose);
    if (onClose) onClose();
  };

  useEffect(() => {
    setOpen(show);
    console.log("show change");
    return () => setOpen(false);
  }, [show]);

  return (
    <div>
      <MuiDialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {text}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Ok
          </Button>
        </DialogActions>
      </MuiDialog>
    </div>
  );
}

export default Dialog;
