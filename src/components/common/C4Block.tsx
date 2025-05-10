import { getTechnologyById } from "@/data/technologies";
import { ColorStyle } from "@/theme/theme";
import { BaseBlock } from "@/types/c4";
import EditIcon from "@mui/icons-material/Edit";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Tooltip, useTheme } from "@mui/material";
import { Handle, Position } from "@xyflow/react";
import React from "react";
import { useTranslation } from "react-i18next";
import TechnologyIcon from "../TechnologyIcon";
import {
  ActionIconButton,
  ActionsContainer,
  BlockContainer,
  BlockTitle,
  DescriptionText,
  HeaderContainer,
  hexToRgb,
  StyledCard,
  StyledCardContent,
  TitleContainer,
} from "./c4BlockStyled";

export type HandlePositions = {
  source: Position | Position[];
  target: Position | Position[];
};

export interface C4BlockProps {
  item: BaseBlock;
  selected?: boolean;
  onEdit: () => void;
  colors: ColorStyle;
  handlePositions?: HandlePositions;
  children?: React.ReactNode;
}

const createHandleStyle = (colorStyles: ColorStyle, isSource = false) => ({
  background: colorStyles.border,
  border: `2px solid ${colorStyles.border}`,
  width: isSource ? 10 : 8,
  height: isSource ? 10 : 8,
  ...(isSource && { boxShadow: `0 0 5px ${colorStyles.border}` }),
});

const C4Block: React.FC<C4BlockProps> = ({
  item,
  selected = false,
  onEdit,
  colors,
  handlePositions = { source: Position.Bottom, target: Position.Top },
  children,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const { technology, name, description, url } = item;
  const techData = technology ? getTechnologyById(technology) : undefined;
  const defaultColorStyle = colors;
  const colorStyles: ColorStyle = techData
    ? {
        ...theme.c4Colors.system,
        background: `rgba(${hexToRgb(techData.color)}, 0.1)`,
        gradient: `linear-gradient(135deg, rgba(${hexToRgb(
          techData.color
        )}, 0.15) 0%, rgba(${hexToRgb(techData.color)}, 0.05) 100%)`,
        gradientHover: `linear-gradient(135deg, rgba(${hexToRgb(
          techData.color
        )}, 0.25) 0%, rgba(${hexToRgb(techData.color)}, 0.15) 100%)`,
        border: techData.color,
        hover: techData.color,
        glow: `0 0 15px rgba(${hexToRgb(techData.color)}, 0.3)`,
      }
    : defaultColorStyle;

  return (
    <>
      {Array.isArray(handlePositions.target) ? (
        handlePositions.target.map((position: Position, index: number) => (
          <Handle
            key={`target-${index}`}
            type="target"
            position={position}
            data-testid={`target-${position}-${index}`}
            id={`target-${position}-${index}`}
            style={createHandleStyle(colorStyles)}
          />
        ))
      ) : (
        <Handle
          type="target"
          position={handlePositions.target}
          data-testid={`target-${handlePositions.target}`}
          id={`target-${handlePositions.target}`}
          style={createHandleStyle(colorStyles)}
        />
      )}
      <BlockContainer sx={{ opacity: item.original ? 0.5 : 1 }}>
        <StyledCard
          colorstyles={colorStyles}
          selected={selected}
          data-has-description={description ? "true" : "false"}
          className="tech-card"
        >
          <StyledCardContent>
            <HeaderContainer>
              <TitleContainer>
                {technology && (
                  <TechnologyIcon
                    item={{ technology, name } as unknown as BaseBlock}
                    size={24}
                  />
                )}
                <BlockTitle variant="subtitle1">{name}</BlockTitle>
              </TitleContainer>

              <ActionsContainer>
                {url && (
                  <Tooltip title={t("open_url")} arrow>
                    <ActionIconButton
                      size="small"
                      onClick={() => window.open(url, "_blank")}
                      aria-label={t("open_url")}
                      colorstyles={colorStyles}
                    >
                      <OpenInNewIcon fontSize="inherit" />
                    </ActionIconButton>
                  </Tooltip>
                )}

                {!item.original && (
                  <Tooltip title={t("edit")} arrow>
                    <ActionIconButton
                      size="small"
                      onClick={onEdit}
                      aria-label={t("edit")}
                      colorstyles={colorStyles}
                    >
                      <EditIcon fontSize="inherit" />
                    </ActionIconButton>
                  </Tooltip>
                )}
              </ActionsContainer>
            </HeaderContainer>

            {description && (
              <DescriptionText variant="body2">{description}</DescriptionText>
            )}

            {children}
          </StyledCardContent>
        </StyledCard>
      </BlockContainer>

      {Array.isArray(handlePositions.source) ? (
        handlePositions.source.map((position: Position, index: number) => (
          <Handle
            key={`source-${index}`}
            type="source"
            position={position}
            data-testid={`source-${position}-${index}`}
            id={`source-${position}-${index}`}
            style={createHandleStyle(colorStyles, true)}
          />
        ))
      ) : (
        <Handle
          type="source"
          position={handlePositions.source}
          id={`source-${handlePositions.source}`}
          data-testid={`source-${handlePositions.source}`}
          style={createHandleStyle(colorStyles, true)}
        />
      )}
    </>
  );
};

export default C4Block;
