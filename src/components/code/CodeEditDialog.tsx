import { Box, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import BaseEditDialog from "../common/BaseEditDialog";
import CodeEditor from "../common/CodeEditor";
import { dialogThemes } from "../common/dialogThemes";
import ThemedTextField from "../common/ThemedTextField";
import TechnologySelect from "../TechnologySelect";

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

type CodeType = "class" | "function" | "interface" | "variable" | "other";

interface CodeValues {
  name: string;
  description: string;
  codeType: CodeType;
  language: string;
  code: string;
  url: string;
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
  const [values, setValues] = useState<CodeValues>({
    name: initialName,
    description: initialDescription,
    codeType: initialCodeType,
    language: initialLanguage,
    code: initialCode,
    url: initialUrl,
  });
  const { t } = useTranslation();

  useEffect(() => {
    setValues({
      name: initialName,
      description: initialDescription,
      codeType: initialCodeType,
      language: initialLanguage || "",
      code: initialCode || "",
      url: initialUrl || "",
    });
  }, [
    initialName,
    initialDescription,
    initialCodeType,
    initialLanguage,
    initialCode,
    initialUrl,
    open,
  ]);

  const handleChange = (field: keyof CodeValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <BaseEditDialog
      open={open}
      title={t("edit_code_element")}
      theme={dialogThemes.code}
      onSave={() =>
        onSave(
          values.name,
          values.description,
          values.codeType,
          values.language,
          values.code,
          values.url
        )
      }
      onClose={onClose}
      onDelete={onDelete}
      saveDisabled={!values.name.trim()}
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
        value={values.name}
        onChange={(e) => handleChange("name", e.target.value)}
        data-testid="input_name"
      />
      <ThemedTextField
        theme={dialogThemes.code}
        margin="dense"
        label={t("code_element_description")}
        fullWidth
        multiline
        minRows={3}
        value={values.description}
        onChange={(e) => handleChange("description", e.target.value)}
        data-testid="input_description"
      />
      <Box sx={{ display: "flex", gap: 2 }}>
        <ThemedTextField
          fullWidth
          theme={dialogThemes.code}
          select
          label={t("code_type")}
          value={values.codeType}
          onChange={(e) => handleChange("codeType", e.target.value as CodeType)}
          data-testid="input_type"
          margin="dense"
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
          value={values.language}
          onChange={(value) => handleChange("language", value)}
          label={t("language")}
          placeholder={t("select_language")}
        />
      </Box>
      <CodeEditor
        theme={dialogThemes.code}
        label={t("code")}
        value={values.code}
        onChange={(value) => handleChange("code", value)}
        language={values.language}
        placeholder={t("code_placeholder")}
      />
      <ThemedTextField
        theme={dialogThemes.code}
        margin="dense"
        label={t("url")}
        fullWidth
        value={values.url}
        onChange={(e) => handleChange("url", e.target.value)}
        data-testid="input_url"
      />
    </BaseEditDialog>
  );
}
