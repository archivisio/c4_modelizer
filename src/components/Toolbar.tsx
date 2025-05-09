import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {
  AppBar,
  IconButton,
  Toolbar as MuiToolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import React, { forwardRef, useRef } from "react";
import { useTranslation } from "react-i18next";
import { FlatC4Model } from "../types/flatC4Model";

const StyledAppBar = styled(AppBar)(() => ({
  background: "linear-gradient(90deg, #051937 0%, #004d7a 100%)",
  borderBottom: "1px solid rgba(81, 162, 255, 0.2)",
}));

const AppTitle = styled(Typography)(() => ({
  flexGrow: 1,
  fontWeight: 600,
  background: "linear-gradient(90deg, #51a2ff 0%, #8ed6ff 100%)",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  letterSpacing: "0.5px",
}));

const ToolbarIconButton = styled(IconButton)(() => ({
  color: "#fff",
  background: "rgba(81, 162, 255, 0.1)",
  backdropFilter: "blur(4px)",
  marginRight: 8,
  transition: "all 0.2s ease",
  "&:hover": { background: "rgba(81, 162, 255, 0.2)" },
}));

const HiddenInput = styled("input")(() => ({
  display: "none",
}));

export interface ToolbarProps {
  onAddSystem: () => void;
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
  model: FlatC4Model;
}

const Toolbar = forwardRef<HTMLButtonElement, ToolbarProps>(
  (
    { onAddSystem, onExport, onImport, onReset, model }: ToolbarProps,
    resetButtonRef: React.Ref<HTMLButtonElement>
  ) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { t } = useTranslation();

    return (
      <StyledAppBar position="static" elevation={0}>
        <MuiToolbar>
          <AppTitle variant="h6">
            {t("app_title", { Level: model.viewLevel })}
          </AppTitle>
          <Tooltip title={t("add_block")} arrow>
            <div>
              <ToolbarIconButton
                data-testid="toolbar-add-system"
                onClick={onAddSystem}
                aria-label={t("add_block")}
              >
                <AddIcon />
              </ToolbarIconButton>
            </div>
          </Tooltip>
          <Tooltip title={t("export_json")} arrow>
            <div>
              <ToolbarIconButton
                data-testid="toolbar-export-model"
                onClick={onExport}
                aria-label={t("export_json")}
              >
                <DownloadIcon />
              </ToolbarIconButton>
            </div>
          </Tooltip>
          <Tooltip title={t("import_json")} arrow>
            <div>
              <ToolbarIconButton
                data-testid="toolbar-import-model"
                onClick={() => fileInputRef.current?.click()}
                aria-label={t("import_json")}
              >
                <UploadFileIcon />
                <HiddenInput
                  type="file"
                  accept="application/json"
                  ref={fileInputRef}
                  data-testid="toolbar-file-input"
                  onChange={onImport}
                />
              </ToolbarIconButton>
            </div>
          </Tooltip>
          <Tooltip title={t("reset_store")} arrow>
            <div>
              <ToolbarIconButton
                data-testid="toolbar-reset-model"
                onClick={onReset}
                aria-label={t("reset_store")}
                ref={resetButtonRef as React.Ref<HTMLButtonElement>}
                sx={{ marginRight: 0 }}
              >
                <DeleteIcon />
              </ToolbarIconButton>
            </div>
          </Tooltip>
        </MuiToolbar>
      </StyledAppBar>
    );
  }
);

export default Toolbar;
