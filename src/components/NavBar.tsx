import PortalTarget from "@/slots/PortalTarget";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Box, Breadcrumbs, Link } from "@mui/material";
import { styled } from "@mui/system";
import { useReactFlow } from "@xyflow/react";
import { useFlatC4Store, useFlatNavigation } from "c4-modelizer-sdk/core";
import React from "react";
import { useTranslation } from "react-i18next";

const NavBarContainer = styled(Box)(() => ({
  padding: 12,
  backgroundColor: "#132f4c",
  borderBottom: "1px solid rgba(81, 162, 255, 0.2)",
  backdropFilter: "blur(8px)",
  display: "flex",
}));

const StyledNavigateNextIcon = styled(NavigateNextIcon)(() => ({
  color: "#51a2ff",
  fontSize: "small",
}));

const StyledLink = styled(Link)(() => ({
  display: "flex",
  alignItems: "center",
  fontWeight: 500,
  transition: "all 0.2s ease",
  color: "rgba(255, 255, 255, 0.7)",
  "&:hover": {
    color: "#51a2ff",
  },
  "&.active": {
    color: "#51a2ff",
  },
}));

const NavLink = ({
  isActive,
  ...props
}: { isActive: boolean } & React.ComponentProps<typeof StyledLink>) => (
  <StyledLink className={isActive ? "active" : ""} {...props} />
);

export interface NavBarProps {
  systemName?: string;
  containerName?: string;
  componentName?: string;
}

const NavBar: React.FC<NavBarProps> = ({
  systemName,
  containerName,
  componentName,
}) => {
  const { model } = useFlatC4Store();
  const { t } = useTranslation();
  const {
    navigateToSystem,
    navigateToContainer,
    navigateToComponent,
    navigateToCode,
  } = useFlatNavigation();
  const reactFlowInstance = useReactFlow();

  const handleSystemsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigateToSystem();
    reactFlowInstance.fitView({ padding: 0.2, includeHiddenNodes: false });
  };

  const handleContainersClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (model.activeSystemId) {
      navigateToContainer(model.activeSystemId);
      reactFlowInstance.fitView({ padding: 0.2, includeHiddenNodes: false });
    }
  };

  const handleComponentsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (model.activeSystemId && model.activeContainerId) {
      navigateToComponent(model.activeSystemId, model.activeContainerId);
      reactFlowInstance.fitView({ padding: 0.2, includeHiddenNodes: false });
    }
  };

  return (
    <NavBarContainer>
      <PortalTarget id="navbar-before" />
      <Breadcrumbs
        separator={<StyledNavigateNextIcon />}
        aria-label="breadcrumb"
        data-testid="breadcrumb"
      >
        <NavLink
          underline="hover"
          isActive={model.viewLevel === "system"}
          href="#"
          onClick={handleSystemsClick}
        >
          {t("systems")}
        </NavLink>

        {(model.viewLevel === "container" ||
          model.viewLevel === "component" ||
          model.viewLevel === "code") &&
          systemName && (
            <NavLink
              underline="hover"
              isActive={model.viewLevel === "container"}
              href="#"
              onClick={handleContainersClick}
            >
              {systemName} {t("containers")}
            </NavLink>
          )}

        {(model.viewLevel === "component" || model.viewLevel === "code") &&
          containerName && (
            <NavLink
              underline="hover"
              isActive={model.viewLevel === "component"}
              href="#"
              onClick={handleComponentsClick}
            >
              {containerName} {t("components")}
            </NavLink>
          )}

        {model.viewLevel === "code" && componentName && (
          <NavLink
            underline="hover"
            isActive={true}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (
                model.activeSystemId &&
                model.activeContainerId &&
                model.activeComponentId
              ) {
                navigateToCode(
                  model.activeSystemId,
                  model.activeContainerId,
                  model.activeComponentId
                );
              }
            }}
          >
            {componentName} {t("code")}
          </NavLink>
        )}
      </Breadcrumbs>
      <PortalTarget id="navbar-after" />
    </NavBarContainer>
  );
};

export default NavBar;
