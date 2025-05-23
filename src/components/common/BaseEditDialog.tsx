import DeleteIcon from "@mui/icons-material/Delete";
import { Tooltip, useTheme } from "@mui/material";
import { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import ConfirmDialog from "./ConfirmDialog";
import {
  CancelButton,
  DeleteButton,
  SaveButton,
  StyledDialog,
  StyledDialogActions,
  StyledDialogContent,
  StyledDialogTitle,
  createDialogActionsStyles,
  createDialogPaperStyles,
  createDialogTitleStyles,
  createSaveButtonStyles,
} from "./baseEditDialogStyled";

export type DialogThemeType = 'system' | 'container' | 'component' | 'code' | 'connection';

export interface BaseEditDialogProps {
  open: boolean;
  title: string;
  themeType?: DialogThemeType;
  children?: ReactNode;
  onSave: () => void;
  onClose: () => void;
  onDelete?: () => void;
  deleteConfirmationMessage?: string;
  deleteTitle?: string;
  saveDisabled?: boolean;
}

export default function BaseEditDialog({
  open,
  title,
  themeType = 'system',
  children,
  onSave,
  onClose,
  onDelete,
  deleteConfirmationMessage,
  deleteTitle,
  saveDisabled = false,
}: BaseEditDialogProps) {
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const { t } = useTranslation();
  const theme = useTheme();
  const themeColor = theme.c4Colors[themeType];

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
    setShowDeleteConfirmation(false);
    onClose();
  };

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: createDialogPaperStyles(themeColor),
      }}
    >
      <StyledDialogTitle sx={createDialogTitleStyles(themeColor)}>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <span>{title}</span>
          {onDelete && (
            <Tooltip title={t("deleteNode")} arrow>
              <DeleteButton
                data-testid="dialog-delete-button"
                onClick={() => setShowDeleteConfirmation(true)}
                size="small"
                aria-label={t("deleteNode")}
              >
                <DeleteIcon />
              </DeleteButton>
            </Tooltip>
          )}
        </div>
      </StyledDialogTitle>
      <StyledDialogContent>{children}</StyledDialogContent>
      <StyledDialogActions sx={createDialogActionsStyles(themeColor)}>
        <CancelButton data-testid="dialog-cancel-button" onClick={onClose}>
          {t("cancel")}
        </CancelButton>
        <SaveButton
          data-testid="dialog-save-button"
          onClick={onSave}
          variant="contained"
          disabled={saveDisabled}
          sx={createSaveButtonStyles(themeColor)}
        >
          {t("save")}
        </SaveButton>
      </StyledDialogActions>

      <ConfirmDialog
        open={showDeleteConfirmation}
        title={deleteTitle || t("confirm_delete")}
        content={deleteConfirmationMessage || t("delete_confirmation")}
        onCancel={() => setShowDeleteConfirmation(false)}
        onConfirm={handleDelete}
        confirmText={t("delete")}
        cancelText={t("cancel")}
      />
    </StyledDialog>
  );
}
