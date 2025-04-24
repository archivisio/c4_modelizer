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
import React, { useRef } from "react";
import { useTranslation } from "react-i18next";

interface ToolbarProps {
  onAddSystem: () => void;
  onExport: () => void;
  onImport: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const Toolbar: React.FC<ToolbarProps> = ({
  onAddSystem,
  onExport,
  onImport,
}) => {
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
          {t("app_title")}
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
      </MuiToolbar>
    </AppBar>
  );
};

export default Toolbar;
