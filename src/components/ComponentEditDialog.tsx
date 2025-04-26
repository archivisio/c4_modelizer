import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import BaseEditDialog from "./common/BaseEditDialog";
import { dialogThemes } from "./common/dialogThemes";
import ThemedTextField from "./common/ThemedTextField";
import TechnologySelect from "./TechnologySelect";

interface ComponentEditDialogProps {
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

interface ComponentValues {
  name: string;
  description: string;
  technology: string;
  url: string;
}

export default function ComponentEditDialog({
  open,
  initialName = "",
  initialDescription = "",
  initialTechnology = "",
  initialUrl = "",
  onSave,
  onClose,
  onDelete,
}: ComponentEditDialogProps) {
  const [values, setValues] = useState<ComponentValues>({
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

  const handleChange = (field: keyof ComponentValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <BaseEditDialog
      open={open}
      title={t("edit_component")}
      theme={dialogThemes.component}
      onSave={() =>
        onSave(values.name, values.description, values.technology, values.url)
      }
      onClose={onClose}
      onDelete={onDelete}
      saveDisabled={!values.name.trim()}
      deleteConfirmationMessage={t("delete_component_confirmation", {
        name: initialName,
      })}
    >
      <ThemedTextField
        theme={dialogThemes.component}
        autoFocus
        margin="dense"
        label={t("component_name")}
        fullWidth
        value={values.name}
        onChange={(e) => handleChange("name", e.target.value)}
      />
      <ThemedTextField
        theme={dialogThemes.component}
        margin="dense"
        label={t("component_description")}
        fullWidth
        multiline
        minRows={3}
        value={values.description}
        onChange={(e) => handleChange("description", e.target.value)}
      />
      <TechnologySelect
        level="component"
        value={values.technology}
        onChange={(value) => handleChange("technology", value)}
        label={t("component_technology")}
        placeholder={t("select_technology")}
      />
      <ThemedTextField
        theme={dialogThemes.component}
        margin="dense"
        label={t("url")}
        fullWidth
        value={values.url}
        onChange={(e) => handleChange("url", e.target.value)}
      />
    </BaseEditDialog>
  );
}
