import BaseEditDialog from "@components/common/BaseEditDialog";
import CodeEditor from "@components/common/CodeEditor";
import { dialogThemes } from "@components/common/dialogThemes";
import ThemedTextField from "@components/common/ThemedTextField";
import TechnologySelect from "@components/TechnologySelect";
import { Box, MenuItem } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

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
    technology: string,
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
  technology: string;
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
    technology: initialLanguage,
    code: initialCode,
    url: initialUrl,
  });
  const { t } = useTranslation();

  useEffect(() => {
    setValues({
      name: initialName,
      description: initialDescription,
      codeType: initialCodeType,
      technology: initialLanguage || "",
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
          values.technology,
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
        themeType="code"
        autoFocus
        margin="dense"
        label={t("code_element_name")}
        fullWidth
        value={values.name}
        onChange={(e) => handleChange("name", e.target.value)}
        data-testid="input_name"
      />
      <ThemedTextField
        themeType="code"
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
          themeType="code"
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
          value={values.technology}
          onChange={(value) => handleChange("technology", value)}
          label={t("language")}
          placeholder={t("select_language")}
        />
      </Box>
      <CodeEditor
        theme={dialogThemes.code}
        label={t("code")}
        value={values.code}
        onChange={(value) => handleChange("code", value)}
        language={values.technology}
        placeholder={t("code_placeholder")}
      />
      <ThemedTextField
        themeType="code"
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
