import { Box, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import BaseEditDialog from "./common/BaseEditDialog";
import CodeEditor from "./common/CodeEditor";
import { dialogThemes } from "./common/dialogThemes";
import ThemedTextField from "./common/ThemedTextField";
import TechnologySelect from "./TechnologySelect";

interface CodeEditDialogProps {
  open: boolean;
  initialName?: string;
  initialDescription?: string;
  initialCodeType?: "class" | "function" | "interface" | "variable" | "other";
  initialLanguage?: string;
  initialCode?: string;
  initialUrl?: string;
  onSave: (
    name: string,
    description: string,
    codeType: "class" | "function" | "interface" | "variable" | "other",
    language: string,
    code: string,
    url: string
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
  initialUrl = "",
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
  const [url, setUrl] = useState(initialUrl);
  const { t } = useTranslation();

  useEffect(() => {
    setName(initialName);
    setDescription(initialDescription);
    setCodeType(initialCodeType);
    setLanguage(initialLanguage || "");
    setCode(initialCode || "");
    setUrl(initialUrl || "");
  }, [
    initialName,
    initialDescription,
    initialCodeType,
    initialLanguage,
    initialCode,
    initialUrl,
    open,
  ]);

  // Les champs du formulaire seront désormais passés comme enfants

  return (
    <BaseEditDialog
      open={open}
      title={t("edit_code_element")}
      theme={dialogThemes.code}
      onSave={() => onSave(name, description, codeType, language, code, url)}
      onClose={onClose}
      onDelete={onDelete}
      saveDisabled={!name.trim()}
      deleteConfirmationMessage={t("delete_code_confirmation", {
        name: initialName,
      })}
    >
      <ThemedTextField
        theme={dialogThemes.code}
        autoFocus
        margin="dense"
        label={t("code_element_name")}
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <ThemedTextField
        theme={dialogThemes.code}
        margin="dense"
        label={t("code_element_description")}
        fullWidth
        multiline
        minRows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <ThemedTextField
          fullWidth
          theme={dialogThemes.code}
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
        >
          <MenuItem value="class">{t("code_type_class")}</MenuItem>
          <MenuItem value="function">{t("code_type_function")}</MenuItem>
          <MenuItem value="interface">{t("code_type_interface")}</MenuItem>
          <MenuItem value="variable">{t("code_type_variable")}</MenuItem>
          <MenuItem value="other">{t("code_type_other")}</MenuItem>
        </ThemedTextField>

        <TechnologySelect
          fullWidth
          level="code"
          value={language}
          onChange={setLanguage}
          label={t("language")}
          placeholder={t("select_language")}
        />
      </Box>
      <CodeEditor
        theme={dialogThemes.code}
        label={t("code")}
        value={code}
        onChange={setCode}
        language={language}
        placeholder={t("code_placeholder")}
      />
      <ThemedTextField
        theme={dialogThemes.code}
        margin="dense"
        label={t("url")}
        fullWidth
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
    </BaseEditDialog>
  );
}
