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
  onSave: (name: string, description: string, technology: string) => void;
  onClose: () => void;
  onDelete?: () => void;
}

export default function ContainerEditDialog({
  open,
  initialName = "",
  initialDescription = "",
  initialTechnology = "",
  onSave,
  onClose,
  onDelete,
}: ContainerEditDialogProps) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [technology, setTechnology] = useState(initialTechnology);
  const { t } = useTranslation();

  useEffect(() => {
    setName(initialName);
    setDescription(initialDescription);
    setTechnology(initialTechnology || "");
  }, [initialName, initialDescription, initialTechnology, open]);

  // Les champs du formulaire seront désormais passés comme enfants

  return (
    <BaseEditDialog
      open={open}
      title={t("edit_container")}
      theme={dialogThemes.container}
      onSave={() => onSave(name, description, technology)}
      onClose={onClose}
      onDelete={onDelete}
      saveDisabled={!name.trim()}
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
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <ThemedTextField
        theme={dialogThemes.container}
        margin="dense"
        label={t("container_description")}
        fullWidth
        multiline
        minRows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <TechnologySelect
        level="container"
        value={technology}
        onChange={setTechnology}
        label={t("container_technology")}
        placeholder={t("select_technology")}
      />
    </BaseEditDialog>
  );
}
