import DeleteIcon from "@mui/icons-material/Delete";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";

export interface DialogTheme {
  primaryColor: string;
  secondaryColor: string;
  gradientStart: string;
  gradientEnd: string;
  hoverGradientStart: string;
  hoverGradientEnd: string;
}

// Suppression de l'interface DialogField qui n'est plus nécessaire

export interface BaseEditDialogProps {
  open: boolean;
  title: string;
  theme: DialogTheme;
  children?: ReactNode;
  onSave: () => void;
  onClose: () => void;
  onDelete?: () => void;
  deleteConfirmationMessage?: string;
  deleteTitle?: string;
  saveDisabled?: boolean;
}

export default function BaseEditDialog({
  open,
  title,
  theme,
  children,
  onSave,
  onClose,
  onDelete,
  deleteConfirmationMessage,
  deleteTitle,
  saveDisabled = false,
}: BaseEditDialogProps) {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const { t } = useTranslation();

  // Generate styles based on theme
  const dialogStyles = {
    paper: {
      bgcolor: "#0a1929",
      color: "#fff",
      border: `1px solid rgba(${theme.primaryColor}, 0.3)`,
      borderRadius: 2,
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
    },
    title: {
      borderBottom: `1px solid rgba(${theme.primaryColor}, 0.2)`,
      pb: 2,
      "& .MuiTypography-root": {
        fontWeight: 600,
        background: `linear-gradient(90deg, ${theme.gradientStart} 0%, ${theme.gradientEnd} 100%)`,
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      },
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    input: {
      mb: 2,
      "& .MuiOutlinedInput-root": {
        "& fieldset": { borderColor: `rgba(${theme.primaryColor}, 0.3)` },
        "&:hover fieldset": { borderColor: `rgba(${theme.primaryColor}, 0.5)` },
        "&.Mui-focused fieldset": { borderColor: theme.gradientStart },
      },
      "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" },
      "& .MuiInputLabel-root.Mui-focused": { color: theme.gradientEnd },
      "& .MuiInputBase-input": { color: "#fff" },
    },
    codeInput: {
      fontFamily: '"Fira Code", "Roboto Mono", monospace',
      mt: 2,
      "& .MuiOutlinedInput-root": {
        "& fieldset": { borderColor: `rgba(${theme.primaryColor}, 0.3)` },
        "&:hover fieldset": { borderColor: `rgba(${theme.primaryColor}, 0.5)` },
        "&.Mui-focused fieldset": { borderColor: theme.gradientStart },
      },
      "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" },
      "& .MuiInputLabel-root.Mui-focused": { color: theme.gradientEnd },
      "& .MuiInputBase-input": {
        color: "#fff",
        backgroundColor: "rgba(0, 0, 0, 0.2)",
        borderRadius: "4px",
      },
    },
    actions: {
      px: 3,
      py: 2,
      borderTop: `1px solid rgba(${theme.primaryColor}, 0.2)`,
    },
    cancelButton: {
      color: "rgba(255, 255, 255, 0.7)",
      "&:hover": {
        color: "#fff",
        backgroundColor: `rgba(${theme.primaryColor}, 0.1)`,
      },
    },
    saveButton: {
      background: `linear-gradient(90deg, ${theme.gradientStart} 0%, ${theme.gradientEnd} 100%)`,
      boxShadow: `0 4px 10px rgba(${theme.primaryColor}, 0.3)`,
      "&:hover": {
        background: `linear-gradient(90deg, ${theme.hoverGradientStart} 0%, ${theme.hoverGradientEnd} 100%)`,
      },
      "&.Mui-disabled": {
        background: `rgba(${theme.primaryColor}, 0.1)`,
        color: "rgba(255, 255, 255, 0.3)",
      },
    },
    deleteButton: {
      color: "#ff5252",
      "&:hover": {
        backgroundColor: "rgba(255, 82, 82, 0.1)",
      },
    },
    confirmDialog: {
      bgcolor: "#0a1929",
      color: "#fff",
      border: "1px solid rgba(255, 82, 82, 0.3)",
      borderRadius: 2,
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
      maxWidth: "500px",
      width: "90%",
      margin: "auto",
    },
    confirmTitle: {
      borderBottom: "1px solid rgba(255, 82, 82, 0.2)",
      pb: 2,
      "& .MuiTypography-root": {
        fontWeight: 600,
        color: "#ff5252",
        fontSize: "1.2rem",
      },
    },
    confirmContent: {
      py: 3,
    },
    confirmText: {
      color: "rgba(255, 255, 255, 0.7)",
    },
    confirmActions: {
      px: 3,
      py: 2,
      borderTop: "1px solid rgba(255, 82, 82, 0.2)",
    },
    confirmCancelButton: {
      color: "rgba(255, 255, 255, 0.9)",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      "&:hover": {
        color: "#fff",
        backgroundColor: `rgba(${theme.primaryColor}, 0.2)`,
        border: "1px solid rgba(255, 255, 255, 0.5)",
      },
    },
    confirmDeleteButton: {
      background: "linear-gradient(90deg, #ff5252 0%, #ff7676 100%)",
      boxShadow: "0 4px 10px rgba(255, 82, 82, 0.3)",
      "&:hover": {
        background: "linear-gradient(90deg, #d32f2f 0%, #ff5252 100%)",
      },
    },
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
    setShowDeleteConfirmation(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: dialogStyles.paper,
      }}
    >
      <DialogTitle sx={dialogStyles.title}>
        <div>{title}</div>
        {onDelete && (
          <Tooltip title={t("deleteNode")}>
            <IconButton
              onClick={() => setShowDeleteConfirmation(true)}
              size="small"
              sx={dialogStyles.deleteButton}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}
      </DialogTitle>
      <DialogContent sx={{ py: 3 }}>{children}</DialogContent>
      <DialogActions sx={dialogStyles.actions}>
        <Button onClick={onClose} sx={dialogStyles.cancelButton}>
          {t("cancel")}
        </Button>
        <Button
          onClick={onSave}
          variant="contained"
          disabled={saveDisabled}
          sx={dialogStyles.saveButton}
        >
          {t("save")}
        </Button>
      </DialogActions>

      {/* Dialogue de confirmation de suppression */}
      <Dialog
        open={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
        aria-labelledby="delete-confirmation-dialog-title"
        aria-describedby="delete-confirmation-dialog-description"
        PaperProps={{ sx: dialogStyles.confirmDialog }}
      >
        <DialogTitle id="delete-confirmation-dialog-title" sx={dialogStyles.confirmTitle}>
          {deleteTitle || t("confirm_delete")}
        </DialogTitle>
        <DialogContent sx={dialogStyles.confirmContent}>
          <DialogContentText id="delete-confirmation-dialog-description" sx={dialogStyles.confirmText}>
            {deleteConfirmationMessage || t("delete_confirmation")}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={dialogStyles.confirmActions}>
          <Button
            onClick={() => setShowDeleteConfirmation(false)}
            variant="outlined"
            sx={dialogStyles.confirmCancelButton}
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={handleDelete}
            variant="contained"
            color="error"
            sx={dialogStyles.confirmDeleteButton}
          >
            {t("delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
}
