import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ConnectionInfo } from "../types/connection";
import BaseEditDialog from "./common/BaseEditDialog";
import { dialogThemes } from "./common/dialogThemes";
import ThemedTextField from "./common/ThemedTextField";
import TechnologySelect from "./TechnologySelect";

interface ConnectionEditDialogProps {
  open: boolean;
  connection: ConnectionInfo | null;
  onClose: () => void;
  onSave: (connectionInfo: ConnectionInfo) => void;
  onDelete?: (connectionInfo: ConnectionInfo) => void;
}

const ConnectionEditDialog: React.FC<ConnectionEditDialogProps> = ({
  open,
  connection,
  onClose,
  onSave,
  onDelete,
}) => {
  const { t } = useTranslation();

  const [label, setLabel] = useState("");
  const [technology, setTechnology] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (connection) {
      setLabel(connection.label || "");
      setTechnology(connection.technology || "");
      setDescription(connection.description || "");
    } else {
      setLabel("");
      setTechnology("");
      setDescription("");
    }
  }, [connection]);

  const handleSave = () => {
    if (!connection) return;

    onSave({
      ...connection,
      label,
      technology,
      description,
    });
  };

  const handleDelete = () => {
    if (!connection || !onDelete) return;
    onDelete(connection);
  };

  return (
    <BaseEditDialog
      open={open}
      title={t("edit_connection")}
      theme={dialogThemes.connection}
      onSave={handleSave}
      onClose={onClose}
      onDelete={connection && onDelete ? handleDelete : undefined}
      deleteConfirmationMessage={t("delete_connection_confirmation", {
        label: connection?.label || t("connection"),
      })}
    >
      <ThemedTextField
        theme={dialogThemes.connection}
        autoFocus
        margin="dense"
        label={t("connection_label")}
        fullWidth
        value={label}
        onChange={(e) => setLabel(e.target.value)}
      />
      <ThemedTextField
        theme={dialogThemes.connection}
        margin="dense"
        label={t("connection_description")}
        fullWidth
        multiline
        minRows={3}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <TechnologySelect
        level="connection"
        value={technology}
        onChange={setTechnology}
        label={t("connection_technology")}
        placeholder={t("select_technology")}
      />
    </BaseEditDialog>
  );
};

export default ConnectionEditDialog;
