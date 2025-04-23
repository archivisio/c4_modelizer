import { Box, Tooltip } from '@mui/material';
import { getTechnologyById } from '../data/technologies';
import { getIconComponent } from '../icons/TechnologyIcons';

interface TechnologyIconProps {
  technologyId: string;
  size?: number;
  showTooltip?: boolean;
}

/**
 * Component for displaying a technology icon with optional tooltip
 */
const TechnologyIcon = ({ technologyId, size = 24, showTooltip = true }: TechnologyIconProps) => {
  const technology = getTechnologyById(technologyId);
  
  if (!technology) return null;
  
  // Get the icon component statically
  const IconComponent = getIconComponent(technology.icon);
  
  const content = (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        color: technology.color,
      }}
    >
      <IconComponent size={size} />
    </Box>
  );
  
  if (showTooltip) {
    return (
      <Tooltip title={technology.name}>
        {content}
      </Tooltip>
    );
  }
  
  return content;
};

export default TechnologyIcon;
