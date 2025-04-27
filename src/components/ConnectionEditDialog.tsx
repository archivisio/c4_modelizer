import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Box, Slider } from "@mui/material";
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
  labelPosition: number; // 0 = début, 100 = fin
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
    labelPosition: 50,
  });

  useEffect(() => {
    if (connection) {
      setValues({
        label: connection.label || "",
        technology: connection.technology || "",
        description: connection.description || "",
        labelPosition: typeof connection.labelPosition === "number" ? connection.labelPosition : 50,
      });
    } else {
      setValues({
        label: "",
        technology: "",
        description: "",
        labelPosition: 50,
      });
    }
  }, [connection]);

  const handleChange = (field: keyof ConnectionValues, value: string | number) => {
    setValues((prev) => ({ ...prev, [field]: field === "labelPosition" ? Number(value) : value }));
  };

  const handleSave = () => {
    if (!connection) return;

    onSave({
      ...connection,
      label: values.label,
      technology: values.technology,
      description: values.description,
      labelPosition: values.labelPosition,
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
      <Box sx={{ mt: 2 }}>
        <label style={{ color: '#fff', fontSize: 14, marginBottom: 4, display: 'block' }}>
          {t("label_position") || "Position du label et de l'icône sur la connexion"}
        </label>
        <Slider
          value={values.labelPosition}
          min={0}
          max={100}
          step={1}
          marks={[{ value: 0, label: t('start') || 'Début' }, { value: 100, label: t('end') || 'Fin' }]}
          onChange={(_, val) => handleChange("labelPosition", typeof val === 'number' ? val : 50)}
          valueLabelDisplay="auto"
          sx={{ color: dialogThemes.connection.primaryColor }}
        />
      </Box>
    </BaseEditDialog>
  );
};

export default ConnectionEditDialog;
