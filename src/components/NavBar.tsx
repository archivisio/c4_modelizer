import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Box, Breadcrumbs, Link, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { useC4Store } from "../store/c4Store";

interface NavBarProps {
  systemName?: string;
  containerName?: string;
  componentName?: string;
}

const NavBar: React.FC<NavBarProps> = ({
  systemName,
  containerName,
  componentName,
}) => {
  const { setViewLevel, model } = useC4Store();
  const { t } = useTranslation();

  const handleSystemsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setViewLevel("system");
  };

  const handleContainersClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (model.activeSystemId) {
      setViewLevel("container");
    }
  };

  const handleComponentsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (model.activeSystemId && model.activeContainerId) {
      setViewLevel("component");
    }
  };

  return (
    <Box
      sx={{
        p: 1.5,
        bgcolor: "#132f4c",
        borderBottom: "1px solid rgba(81, 162, 255, 0.2)",
        backdropFilter: "blur(8px)",
      }}
    >
      <Breadcrumbs
        separator={
          <NavigateNextIcon fontSize="small" sx={{ color: "#51a2ff" }} />
        }
        aria-label="breadcrumb"
      >
        <Link
          underline="hover"
          color={
            model.viewLevel === "system"
              ? "#51a2ff"
              : "rgba(255, 255, 255, 0.7)"
          }
          href="#"
          onClick={handleSystemsClick}
          sx={{
            display: "flex",
            alignItems: "center",
            fontWeight: 500,
            transition: "all 0.2s ease",
            "&:hover": { color: "#51a2ff" },
          }}
        >
          {t("systems")}
        </Link>

        {(model.viewLevel === "container" ||
          model.viewLevel === "component" ||
          model.viewLevel === "code") &&
          systemName && (
            <Link
              underline="hover"
              color={
                model.viewLevel === "container"
                  ? "#51a2ff"
                  : "rgba(255, 255, 255, 0.7)"
              }
              href="#"
              onClick={handleContainersClick}
              sx={{
                display: "flex",
                alignItems: "center",
                fontWeight: 500,
                transition: "all 0.2s ease",
                "&:hover": { color: "#51a2ff" },
              }}
            >
              {systemName} {t("containers")}
            </Link>
          )}

        {(model.viewLevel === "component" || model.viewLevel === "code") &&
          containerName && (
            <Link
              underline="hover"
              color={
                model.viewLevel === "component"
                  ? "#51a2ff"
                  : "rgba(255, 255, 255, 0.7)"
              }
              href="#"
              onClick={handleComponentsClick}
              sx={{
                display: "flex",
                alignItems: "center",
                fontWeight: 500,
                transition: "all 0.2s ease",
                "&:hover": { color: "#51a2ff" },
              }}
            >
              {containerName} {t("components")}
            </Link>
          )}

        {model.viewLevel === "code" && componentName && (
          <Typography color="#51a2ff" sx={{ fontWeight: 500 }}>
            {componentName} {t("code")}
          </Typography>
        )}
      </Breadcrumbs>
    </Box>
  );
};

export default NavBar;
