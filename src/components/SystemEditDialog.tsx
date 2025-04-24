import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface SystemEditDialogProps {
  open: boolean;
  initialName?: string;
  initialDescription?: string;
  onSave: (name: string, description: string) => void;
  onClose: () => void;
}

export default function SystemEditDialog({
  open,
  initialName = "",
  initialDescription = "",
  onSave,
  onClose,
}: SystemEditDialogProps) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const { t } = useTranslation();

  useEffect(() => {
    setName(initialName);
    setDescription(initialDescription);
  }, [initialName, initialDescription, open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          bgcolor: "#0a1929",
          color: "#fff",
          border: "1px solid rgba(81, 162, 255, 0.3)",
          borderRadius: 2,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
        },
      }}
    >
      <DialogTitle
        sx={{
          borderBottom: "1px solid rgba(81, 162, 255, 0.2)",
          pb: 2,
          "& .MuiTypography-root": {
            fontWeight: 600,
            background: "linear-gradient(90deg, #51a2ff 0%, #8ed6ff 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          },
        }}
      >
        {t("edit_system")}
      </DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        <TextField
          autoFocus
          margin="dense"
          label={t("system_name")}
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "rgba(81, 162, 255, 0.3)" },
              "&:hover fieldset": { borderColor: "rgba(81, 162, 255, 0.5)" },
              "&.Mui-focused fieldset": { borderColor: "#51a2ff" },
            },
            "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" },
            "& .MuiInputLabel-root.Mui-focused": { color: "#51a2ff" },
            "& .MuiInputBase-input": { color: "#fff" },
          }}
        />
        <TextField
          margin="dense"
          label={t("system_description")}
          fullWidth
          multiline
          minRows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "rgba(81, 162, 255, 0.3)" },
              "&:hover fieldset": { borderColor: "rgba(81, 162, 255, 0.5)" },
              "&.Mui-focused fieldset": { borderColor: "#51a2ff" },
            },
            "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" },
            "& .MuiInputLabel-root.Mui-focused": { color: "#51a2ff" },
            "& .MuiInputBase-input": { color: "#fff" },
          }}
        />
      </DialogContent>
      <DialogActions
        sx={{ px: 3, py: 2, borderTop: "1px solid rgba(81, 162, 255, 0.2)" }}
      >
        <Button
          onClick={onClose}
          sx={{
            color: "rgba(255, 255, 255, 0.7)",
            "&:hover": {
              color: "#fff",
              backgroundColor: "rgba(81, 162, 255, 0.1)",
            },
          }}
        >
          {t("cancel")}
        </Button>
        <Button
          onClick={() => onSave(name, description)}
          variant="contained"
          disabled={!name.trim()}
          sx={{
            background: "linear-gradient(90deg, #1976d2 0%, #51a2ff 100%)",
            boxShadow: "0 4px 10px rgba(25, 118, 210, 0.3)",
            "&:hover": {
              background: "linear-gradient(90deg, #1565c0 0%, #1976d2 100%)",
            },
            "&.Mui-disabled": {
              background: "rgba(81, 162, 255, 0.1)",
              color: "rgba(255, 255, 255, 0.3)",
            },
          }}
        >
          {t("save")}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
