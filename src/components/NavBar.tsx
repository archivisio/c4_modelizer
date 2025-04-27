import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Box, Breadcrumbs, Link } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { useC4Store } from "../store/c4Store";
import { useNavigation } from "../hooks/useNavigation";

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
  const { model } = useC4Store();
  const { t } = useTranslation();
  const { 
    navigateToSystem, 
    navigateToContainer, 
    navigateToComponent, 
    navigateToCode 
  } = useNavigation();

  const handleSystemsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigateToSystem();
  };

  const handleContainersClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (model.activeSystemId) {
      navigateToContainer(model.activeSystemId);
    }
  };

  const handleComponentsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (model.activeSystemId && model.activeContainerId) {
      navigateToComponent(model.activeSystemId, model.activeContainerId);
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
          <Link
            underline="hover"
            color="#51a2ff"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (model.activeSystemId && model.activeContainerId && model.activeComponentId) {
                navigateToCode(model.activeSystemId, model.activeContainerId, model.activeComponentId);
              }
            }}
            sx={{
              display: "flex",
              alignItems: "center",
              fontWeight: 500,
              transition: "all 0.2s ease",
              "&:hover": { color: "#51a2ff" },
            }}
          >
            {componentName} {t("code")}
          </Link>
        )}
      </Breadcrumbs>
    </Box>
  );
};

export default NavBar;
