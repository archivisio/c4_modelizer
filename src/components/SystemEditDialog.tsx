import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import BaseEditDialog from "./common/BaseEditDialog";
import { dialogThemes } from "./common/dialogThemes";
import ThemedTextField from "./common/ThemedTextField";
import TechnologySelect from "./TechnologySelect";

interface SystemEditDialogProps {
  open: boolean;
  initialName?: string;
  initialDescription?: string;
  initialTechnology?: string;
  initialUrl?: string;
  onSave: (name: string, description: string, technology: string, url: string) => void;
  onClose: () => void;
  onDelete?: () => void;
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
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [technology, setTechnology] = useState(initialTechnology);
  const [url, setUrl] = useState(initialUrl);
  const { t } = useTranslation();

  useEffect(() => {
    setName(initialName);
    setDescription(initialDescription);
    setTechnology(initialTechnology || "");
    setUrl(initialUrl || "");
  }, [initialName, initialDescription, initialTechnology, initialUrl, open]);

  return (
    <BaseEditDialog
      open={open}
      title={t("edit_system")}
      theme={dialogThemes.system}
      onSave={() => onSave(name, description, technology, url)}
      onClose={onClose}
      onDelete={onDelete}
      saveDisabled={!name.trim()}
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
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <ThemedTextField
        theme={dialogThemes.system}
        margin="dense"
        label={t("system_description")}
        fullWidth
        multiline
        minRows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <TechnologySelect
        level="system"
        value={technology}
        onChange={setTechnology}
        label={t("technology")}
        placeholder={t("select_technology")}
      />
      <ThemedTextField
        theme={dialogThemes.system}
        margin="dense"
        label={t("url")}
        fullWidth
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
    </BaseEditDialog>
  );
}
