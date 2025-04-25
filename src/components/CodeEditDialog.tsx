import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  Dialog as ConfirmDialog,
  DialogActions as ConfirmDialogActions,
  DialogContent as ConfirmDialogContent,
  DialogTitle as ConfirmDialogTitle,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  MenuItem,
  TextField,
  Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import TechnologySelect from "./TechnologySelect";

interface CodeEditDialogProps {
  open: boolean;
  initialName?: string;
  initialDescription?: string;
  initialCodeType?: "class" | "function" | "interface" | "variable" | "other";
  initialLanguage?: string;
  initialCode?: string;
  onSave: (
    name: string,
    description: string,
    codeType: "class" | "function" | "interface" | "variable" | "other",
    language: string,
    code: string
  ) => void;
  onClose: () => void;
  onDelete?: () => void;
}

export default function CodeEditDialog({
  open,
  initialName = "",
  initialDescription = "",
  initialCodeType = "class",
  initialLanguage = "",
  initialCode = "",
  onSave,
  onClose,
  onDelete,
}: CodeEditDialogProps) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [codeType, setCodeType] = useState<
    "class" | "function" | "interface" | "variable" | "other"
  >(initialCodeType);
  const [language, setLanguage] = useState(initialLanguage);
  const [code, setCode] = useState(initialCode);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setName(initialName);
    setDescription(initialDescription);
    setCodeType(initialCodeType);
    setLanguage(initialLanguage || "");
    setCode(initialCode || "");
  }, [
    initialName,
    initialDescription,
    initialCodeType,
    initialLanguage,
    initialCode,
    open,
  ]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "#0a1929",
          color: "#fff",
          border: "1px solid rgba(156, 39, 176, 0.3)",
          borderRadius: 2,
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
        },
      }}
    >
      <DialogTitle
        sx={{
          borderBottom: "1px solid rgba(156, 39, 176, 0.2)",
          pb: 2,
          "& .MuiTypography-root": {
            fontWeight: 600,
            background: "linear-gradient(90deg, #9c27b0 0%, #ce93d8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          },
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>{t("edit_code_element")}</div>
        {onDelete && (
          <Tooltip title={t("deleteNode")}>
            <IconButton
              onClick={() => setConfirmOpen(true)}
              size="small"
              sx={{
                color: "#ff5252",
                "&:hover": {
                  backgroundColor: "rgba(255, 82, 82, 0.1)",
                },
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        )}
      </DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        <TextField
          autoFocus
          margin="dense"
          label={t("code_element_name")}
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "rgba(156, 39, 176, 0.3)" },
              "&:hover fieldset": { borderColor: "rgba(156, 39, 176, 0.5)" },
              "&.Mui-focused fieldset": { borderColor: "#9c27b0" },
            },
            "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" },
            "& .MuiInputLabel-root.Mui-focused": { color: "#ce93d8" },
            "& .MuiInputBase-input": { color: "#fff" },
          }}
        />
        <TextField
          margin="dense"
          label={t("code_element_description")}
          fullWidth
          multiline
          minRows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{
            mb: 2,
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "rgba(156, 39, 176, 0.3)" },
              "&:hover fieldset": { borderColor: "rgba(156, 39, 176, 0.5)" },
              "&.Mui-focused fieldset": { borderColor: "#9c27b0" },
            },
            "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" },
            "& .MuiInputLabel-root.Mui-focused": { color: "#ce93d8" },
            "& .MuiInputBase-input": { color: "#fff" },
          }}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            mt: 1,
            mb: 2,
            alignItems: "flex-start",
          }}
        >
          <TextField
            select
            label={t("code_type")}
            value={codeType}
            onChange={(e) =>
              setCodeType(
                e.target.value as
                  | "class"
                  | "function"
                  | "interface"
                  | "variable"
                  | "other"
              )
            }
            sx={{
              flex: 1,
              minWidth: "140px",
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "rgba(156, 39, 176, 0.3)" },
                "&:hover fieldset": { borderColor: "rgba(156, 39, 176, 0.5)" },
                "&.Mui-focused fieldset": { borderColor: "#9c27b0" },
              },
              "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" },
              "& .MuiInputLabel-root.Mui-focused": { color: "#ce93d8" },
              "& .MuiInputBase-input": { color: "#fff" },
              "& .MuiSvgIcon-root": { color: "rgba(255, 255, 255, 0.7)" },
            }}
            size="medium"
            InputLabelProps={{ shrink: true }}
          >
            <MenuItem value="class" sx={{ color: "#0a1929" }}>
              {t("class")}
            </MenuItem>
            <MenuItem value="function" sx={{ color: "#0a1929" }}>
              {t("function")}
            </MenuItem>
            <MenuItem value="interface" sx={{ color: "#0a1929" }}>
              {t("interface")}
            </MenuItem>
            <MenuItem value="variable" sx={{ color: "#0a1929" }}>
              {t("variable")}
            </MenuItem>
            <MenuItem value="other" sx={{ color: "#0a1929" }}>
              {t("other")}
            </MenuItem>
          </TextField>

          <Box sx={{ flex: 2, minWidth: "200px" }}>
            <TechnologySelect
              level="code"
              value={language}
              onChange={setLanguage}
              label={t("language")}
              placeholder={t("select_language")}
            />
          </Box>
        </Box>

        <TextField
          margin="dense"
          label={t("code_snippet")}
          fullWidth
          multiline
          minRows={8}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={t("code_placeholder")}
          sx={{
            fontFamily: '"Fira Code", "Roboto Mono", monospace',
            mt: 2,
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "rgba(156, 39, 176, 0.3)" },
              "&:hover fieldset": { borderColor: "rgba(156, 39, 176, 0.5)" },
              "&.Mui-focused fieldset": { borderColor: "#9c27b0" },
            },
            "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" },
            "& .MuiInputLabel-root.Mui-focused": { color: "#ce93d8" },
            "& .MuiInputBase-input": {
              color: "#fff",
              backgroundColor: "rgba(0, 0, 0, 0.2)",
              borderRadius: "4px",
            },
          }}
        />
      </DialogContent>
      <DialogActions
        sx={{ px: 3, py: 2, borderTop: "1px solid rgba(156, 39, 176, 0.2)" }}
      >
        <Button
          onClick={onClose}
          sx={{
            color: "rgba(255, 255, 255, 0.7)",
            "&:hover": {
              color: "#fff",
              backgroundColor: "rgba(156, 39, 176, 0.1)",
            },
          }}
        >
          {t("cancel")}
        </Button>
        <Button
          onClick={() => onSave(name, description, codeType, language, code)}
          variant="contained"
          disabled={!name.trim()}
          sx={{
            background: "linear-gradient(90deg, #9c27b0 0%, #ce93d8 100%)",
            boxShadow: "0 4px 10px rgba(156, 39, 176, 0.3)",
            "&:hover": {
              background: "linear-gradient(90deg, #7b1fa2 0%, #9c27b0 100%)",
            },
            "&.Mui-disabled": {
              background: "rgba(156, 39, 176, 0.1)",
              color: "rgba(255, 255, 255, 0.3)",
            },
          }}
        >
          {t("save")}
        </Button>
      </DialogActions>

      {/* Dialog de confirmation de suppression */}
      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        PaperProps={{
          sx: {
            bgcolor: "#0a1929",
            color: "#fff",
            border: "1px solid rgba(255, 82, 82, 0.3)",
            borderRadius: 2,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
          },
        }}
      >
        <ConfirmDialogTitle
          sx={{
            borderBottom: "1px solid rgba(255, 82, 82, 0.2)",
            pb: 2,
            "& .MuiTypography-root": {
              fontWeight: 600,
              color: "#ff5252",
            },
          }}
        >
          {t("confirm_deletion")}
        </ConfirmDialogTitle>
        <ConfirmDialogContent sx={{ py: 3 }}>
          <DialogContentText sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
            {t("delete_code_confirmation", { name: initialName })}
          </DialogContentText>
        </ConfirmDialogContent>
        <ConfirmDialogActions
          sx={{ px: 3, py: 2, borderTop: "1px solid rgba(255, 82, 82, 0.2)" }}
        >
          <Button
            onClick={() => setConfirmOpen(false)}
            sx={{
              color: "rgba(255, 255, 255, 0.7)",
              "&:hover": {
                color: "#fff",
                backgroundColor: "rgba(156, 39, 176, 0.1)",
              },
            }}
          >
            {t("cancel")}
          </Button>
          <Button
            onClick={() => {
              if (onDelete) {
                onDelete();
              }
              setConfirmOpen(false);
              onClose();
            }}
            variant="contained"
            sx={{
              background: "linear-gradient(90deg, #ff5252 0%, #ff7676 100%)",
              boxShadow: "0 4px 10px rgba(255, 82, 82, 0.3)",
              "&:hover": {
                background: "linear-gradient(90deg, #d32f2f 0%, #ff5252 100%)",
              },
            }}
          >
            {t("delete")}
          </Button>
        </ConfirmDialogActions>
      </ConfirmDialog>
    </Dialog>
  );
}
