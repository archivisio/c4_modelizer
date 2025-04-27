import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import {
  AppBar,
  IconButton,
  Toolbar as MuiToolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { forwardRef, useRef } from "react";
import { useTranslation } from "react-i18next";
import { C4Model } from "../types/c4";
import DeleteIcon from "@mui/icons-material/Delete";
interface ToolbarProps {
  onAddSystem: () => void;
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset: () => void;
  model: C4Model;
}

const Toolbar = forwardRef<HTMLButtonElement, ToolbarProps>(
  (
    { onAddSystem, onExport, onImport, onReset, model }: ToolbarProps,
    resetButtonRef: React.Ref<HTMLButtonElement>
  ) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { t } = useTranslation();

    return (
      <AppBar
        position="static"
        elevation={0}
        sx={{
          background: "linear-gradient(90deg, #051937 0%, #004d7a 100%)",
          borderBottom: "1px solid rgba(81, 162, 255, 0.2)",
        }}
      >
        <MuiToolbar>
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              fontWeight: 600,
              background: "linear-gradient(90deg, #51a2ff 0%, #8ed6ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "0.5px",
            }}
          >
            {t("app_title", { Level: model.viewLevel })}
          </Typography>
          <Tooltip title={t("add_block")}>
            <IconButton
              onClick={onAddSystem}
              sx={{
                color: "#fff",
                background: "rgba(81, 162, 255, 0.1)",
                backdropFilter: "blur(4px)",
                mr: 1,
                transition: "all 0.2s ease",
                "&:hover": { background: "rgba(81, 162, 255, 0.2)" },
              }}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("export_json")}>
            <IconButton
              onClick={onExport}
              sx={{
                color: "#fff",
                background: "rgba(81, 162, 255, 0.1)",
                backdropFilter: "blur(4px)",
                mr: 1,
                transition: "all 0.2s ease",
                "&:hover": { background: "rgba(81, 162, 255, 0.2)" },
              }}
            >
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("import_json")}>
            <IconButton
              component="span"
              onClick={() => fileInputRef.current?.click()}
              sx={{
                color: "#fff",
                background: "rgba(81, 162, 255, 0.1)",
                backdropFilter: "blur(4px)",
                mr: 1,
                transition: "all 0.2s ease",
                "&:hover": { background: "rgba(81, 162, 255, 0.2)" },
              }}
            >
              <UploadFileIcon />
              <input
                type="file"
                accept="application/json"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={onImport}
              />
            </IconButton>
          </Tooltip>
          <Tooltip title={t("reset_store") || "Reset"}>
            <IconButton
              component="span"
              onClick={onReset}
              ref={resetButtonRef as React.Ref<HTMLButtonElement>}
              sx={{
                color: "#fff",
                background: "rgba(81, 162, 255, 0.1)",
                backdropFilter: "blur(4px)",
                transition: "all 0.2s ease",
                "&:hover": { background: "rgba(81, 162, 255, 0.2)" },
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </MuiToolbar>
      </AppBar>
    );
  }
);

export default Toolbar;
