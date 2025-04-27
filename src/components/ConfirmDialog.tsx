import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import React from "react";

interface ConfirmDialogProps {
  open: boolean;
  title?: string;
  content: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title,
  content,
  onCancel,
  onConfirm,
  confirmText = "Confirmer",
  cancelText = "Annuler",
}) => (
  <Dialog open={open} onClose={onCancel}>
    {title && <DialogTitle>{title}</DialogTitle>}
    <DialogContent>
      <DialogContentText>{content}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onCancel} color="primary">
        {cancelText}
      </Button>
      <Button onClick={onConfirm} color="error" variant="contained">
        {confirmText}
      </Button>
    </DialogActions>
  </Dialog>
);

export default ConfirmDialog;
