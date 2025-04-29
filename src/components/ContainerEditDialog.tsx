import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import BaseEditDialog from "./common/BaseEditDialog";
import { dialogThemes } from "./common/dialogThemes";
import ThemedTextField from "./common/ThemedTextField";
import TechnologySelect from "./TechnologySelect";

interface ContainerEditDialogProps {
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

interface ContainerValues {
  name: string;
  description: string;
  technology: string;
  url: string;
}

export default function ContainerEditDialog({
  open,
  initialName = "",
  initialDescription = "",
  initialTechnology = "",
  initialUrl = "",
  onSave,
  onClose,
  onDelete,
}: ContainerEditDialogProps) {
  const [values, setValues] = useState<ContainerValues>({
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

  const handleChange = (field: keyof ContainerValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <BaseEditDialog
      open={open}
      title={t("edit_container")}
      theme={dialogThemes.container}
      onSave={() =>
        onSave(values.name, values.description, values.technology, values.url)
      }
      onClose={onClose}
      onDelete={onDelete}
      saveDisabled={!values.name.trim()}
      deleteConfirmationMessage={t("delete_container_confirmation", {
        name: initialName,
      })}
    >
      <ThemedTextField
        theme={dialogThemes.container}
        autoFocus
        margin="dense"
        label={t("container_name")}
        fullWidth
        value={values.name}
        onChange={(e) => handleChange("name", e.target.value)}
        data-testid="input_name"
      />
      <ThemedTextField
        theme={dialogThemes.container}
        margin="dense"
        label={t("container_description")}
        fullWidth
        multiline
        minRows={3}
        value={values.description}
        onChange={(e) => handleChange("description", e.target.value)}
        data-testid="input_description"
      />
      <TechnologySelect
        level="container"
        value={values.technology}
        onChange={(value) => handleChange("technology", value)}
        label={t("technology")}
        placeholder={t("select_technology")}
      />
      <ThemedTextField
        theme={dialogThemes.container}
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
