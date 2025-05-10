import { getTechnologyById } from "@data/technologies";
import { getIconComponent } from "@icons/TechnologyIcons";
import { BaseBlock } from "@interfaces/c4";
import { Box, Tooltip } from "@mui/material";
import { styled } from "@mui/system";

const IconContainer = styled(Box)(() => ({
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  width: "var(--icon-size)",
  height: "var(--icon-size)",
  color: "var(--icon-color)",
}));

interface TechnologyIconProps {
  item: BaseBlock;
  size?: number;
  showTooltip?: boolean;
}

const TechnologyIcon = ({
  item,
  size = 24,
  showTooltip = true,
}: TechnologyIconProps) => {
  if (!item.technology) return null;

  const technology = getTechnologyById(item.technology);
  if (!technology) return null;

  const IconComponent = getIconComponent(technology.id);

  const content = (
    <IconContainer
      style={
        {
          "--icon-size": `${size}px`,
          "--icon-color": technology.color,
        } as React.CSSProperties
      }
      data-testid={`technology_icon_${technology.id}`}
      aria-label={technology.name}
    >
      <IconComponent size={size} />
    </IconContainer>
  );

  if (showTooltip) {
    return (
      <Tooltip title={technology.name} arrow>
        {content}
      </Tooltip>
    );
  }

  return content;
};

export default TechnologyIcon;
