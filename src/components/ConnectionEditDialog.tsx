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

interface ConnectionValues {
  label: string;
  technology: string;
  description: string;
}

const ConnectionEditDialog: React.FC<ConnectionEditDialogProps> = ({
  open,
  connection,
  onClose,
  onSave,
  onDelete,
}) => {
  const { t } = useTranslation();

  const [values, setValues] = useState<ConnectionValues>({
    label: "",
    technology: "",
    description: "",
  });

  useEffect(() => {
    if (connection) {
      setValues({
        label: connection.label || "",
        technology: connection.technology || "",
        description: connection.description || "",
      });
    } else {
      setValues({
        label: "",
        technology: "",
        description: "",
      });
    }
  }, [connection]);

  const handleChange = (field: keyof ConnectionValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!connection) return;

    onSave({
      ...connection,
      label: values.label,
      technology: values.technology,
      description: values.description,
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
        value={values.label}
        onChange={(e) => handleChange("label", e.target.value)}
      />
      <ThemedTextField
        theme={dialogThemes.connection}
        margin="dense"
        label={t("connection_description")}
        fullWidth
        multiline
        minRows={3}
        value={values.description}
        onChange={(e) => handleChange("description", e.target.value)}
      />
      <TechnologySelect
        level="connection"
        value={values.technology}
        onChange={(value) => handleChange("technology", value)}
        label={t("connection_technology")}
        placeholder={t("select_technology")}
      />
    </BaseEditDialog>
  );
};

export default ConnectionEditDialog;
