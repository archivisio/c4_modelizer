import BaseEditDialog from "@components/common/BaseEditDialog";
import { dialogThemes } from "@components/common/dialogThemes";
import ThemedTextField from "@components/common/ThemedTextField";
import TechnologySelect from "@components/TechnologySelect";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface SystemEditDialogProps {
  open: boolean;
  initialName?: string;
  initialDescription?: string;
  initialTechnology?: string;
  initialUrl?: string;
  onSave: (
    name: string,
    description: string,
    technology: string,
    url: string
  ) => void;
  onClose: () => void;
  onDelete?: () => void;
}

interface SystemValues {
  name: string;
  description: string;
  technology: string;
  url: string;
}

export default function SystemEditDialog({
  open,
  initialName = "",
  initialDescription = "",
  initialTechnology = "",
  initialUrl = "",
  onSave,
  onClose,
  onDelete,
}: SystemEditDialogProps) {
  const [values, setValues] = useState<SystemValues>({
    name: initialName,
    description: initialDescription,
    technology: initialTechnology,
    url: initialUrl,
  });
  const { t } = useTranslation();

  useEffect(() => {
    setValues({
      name: initialName,
      description: initialDescription,
      technology: initialTechnology || "",
      url: initialUrl || "",
    });
  }, [initialName, initialDescription, initialTechnology, initialUrl, open]);

  const handleChange = (field: keyof SystemValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <BaseEditDialog
      open={open}
      title={t("edit_system")}
      theme={dialogThemes.system}
      onSave={() =>
        onSave(values.name, values.description, values.technology, values.url)
      }
      onClose={onClose}
      onDelete={onDelete}
      saveDisabled={!values.name.trim()}
      deleteConfirmationMessage={t("delete_system_confirmation", {
        name: initialName,
      })}
    >
      <ThemedTextField
        theme={dialogThemes.system}
        autoFocus
        margin="dense"
        label={t("system_name")}
        fullWidth
        value={values.name}
        onChange={(e) => handleChange("name", e.target.value)}
        data-testid="input_name"
      />
      <ThemedTextField
        theme={dialogThemes.system}
        margin="dense"
        label={t("system_description")}
        fullWidth
        multiline
        minRows={3}
        value={values.description}
        onChange={(e) => handleChange("description", e.target.value)}
        data-testid="input_description"
      />
      <TechnologySelect
        level="system"
        value={values.technology}
        onChange={(value) => handleChange("technology", value)}
        label={t("technology")}
        placeholder={t("select_technology")}
      />
      <ThemedTextField
        theme={dialogThemes.system}
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
