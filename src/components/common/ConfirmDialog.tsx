import { useFlatC4Store } from "@archivisio/c4-modelizer-sdk"
import { useTheme } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import React from "react";
import { useTranslation } from "react-i18next";

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
  confirmText,
  cancelText,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { model } = useFlatC4Store();
  const colors = theme.c4Colors[model.viewLevel];
  
  return (
  <Dialog open={open} onClose={onCancel} data-testid="confirm-dialog">
    {title && <DialogTitle>{title}</DialogTitle>}
    <DialogContent>
      <DialogContentText>{content}</DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={onCancel} data-testid="cancel-button" sx={{ color: colors.primaryColor, borderColor: colors.primaryColor }}>
        {cancelText || t("cancel")}
      </Button>
      <Button onClick={onConfirm} variant="contained" data-testid="confirm-button" sx={{ borderColor: colors.primaryColor, backgroundColor: colors.primaryColor }}>
        {confirmText || t("confirm")}
      </Button>
    </DialogActions>
  </Dialog>
  );
};

export default ConfirmDialog;
