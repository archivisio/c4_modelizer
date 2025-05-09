import BaseEditDialog from "@components/common/BaseEditDialog";
import ThemedTextField from "@components/common/ThemedTextField";
import TechnologySelect from "@components/TechnologySelect";
import { ConnectionInfo } from "@interfaces/connection";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { LabelText, StyledCheckbox, StyledFormControlLabel, StyledFormControlWrapper, StyledSlider } from "./connectionEditDialogStyled";

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
  labelPosition: number;
  bidirectional: boolean;
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
    bidirectional: false,
  });

  useEffect(() => {
    if (connection) {
      setValues({
        label: connection.label || "",
        technology: connection.technology || "",
        description: connection.description || "",
        labelPosition:
          typeof connection.labelPosition === "number"
            ? connection.labelPosition
            : 50,
        bidirectional: connection.bidirectional || false,
      });
    } else {
      setValues({
        label: "",
        technology: "",
        description: "",
        labelPosition: 50,
        bidirectional: false,
      });
    }
  }, [connection]);

  const handleChange = (
    field: keyof ConnectionValues,
    value: string | number | boolean
  ) => {
    setValues((prev) => ({
      ...prev,
      [field]: field === "labelPosition" ? Number(value) : value,
    }));
  };

  const handleSave = () => {
    if (!connection) return;

    onSave({
      ...connection,
      label: values.label,
      technology: values.technology,
      description: values.description,
      labelPosition: values.labelPosition,
      bidirectional: values.bidirectional,
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
      themeType="connection"
      onSave={handleSave}
      onClose={onClose}
      onDelete={connection && onDelete ? handleDelete : undefined}
      deleteConfirmationMessage={t("delete_connection_confirmation", {
        label: connection?.label || t("connection"),
      })}
    >
      <ThemedTextField
        themeType="connection"
        autoFocus
        margin="dense"
        label={t("connection_label")}
        fullWidth
        value={values.label}
        onChange={(e) => handleChange("label", e.target.value)}
        data-testid="input_label"
      />
      <ThemedTextField
        themeType="connection"
        margin="dense"
        label={t("connection_description")}
        fullWidth
        multiline
        minRows={3}
        value={values.description}
        onChange={(e) => handleChange("description", e.target.value)}
        data-testid="input_description"
      />
      <TechnologySelect
        level="connection"
        value={values.technology}
        onChange={(value) => handleChange("technology", value)}
        label={t("technology")}
        placeholder={t("select_technology")}
      />
      <StyledFormControlWrapper>
        <LabelText>
          {t("label_position")}
        </LabelText>
        <StyledSlider
          value={values.labelPosition}
          min={0}
          max={100}
          step={1}
          marks={[
            { value: 0, label: t("start") },
            { value: 100, label: t("end") },
          ]}
          onChange={(_, val) =>
            handleChange("labelPosition", typeof val === "number" ? val : 50)
          }
          valueLabelDisplay="auto"
          data-testid="input_label_position"
        />
      </StyledFormControlWrapper>
      <StyledFormControlWrapper>
        <StyledFormControlLabel
          control={
            <StyledCheckbox
              checked={values.bidirectional}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("bidirectional", e.target.checked)}
            />
          }
          label={t("bidirectional_connection")}
          data-testid="input_bidirectional"
        />
      </StyledFormControlWrapper>
    </BaseEditDialog>
  );
};

export default ConnectionEditDialog;
