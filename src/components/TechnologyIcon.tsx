import { getTechnologyById } from "@data/technologies";
import { getIconComponent } from "@icons/TechnologyIcons";
import { BaseBlock } from "@interfaces/c4";
import { Box, Tooltip } from "@mui/material";

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
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        color: technology.color,
      }}
      data-testid={`technology_icon_${technology.id}`}
      aria-label={technology.name}
    >
      <IconComponent size={size} />
    </Box>
  );

  if (showTooltip) {
    return <Tooltip title={technology.name} arrow>{content}</Tooltip>;
  }

  return content;
};

export default TechnologyIcon;
