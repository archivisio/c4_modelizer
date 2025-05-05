import { getTechnologyById } from "@data/technologies";
import { getIconComponent } from "@icons/TechnologyIcons";
import { Box, Tooltip } from "@mui/material";

interface TechnologyIconProps {
  technologyId: string;
  size?: number;
  showTooltip?: boolean;
}

const TechnologyIcon = ({
  technologyId,
  size = 24,
  showTooltip = true,
}: TechnologyIconProps) => {
  const technology = getTechnologyById(technologyId);

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
