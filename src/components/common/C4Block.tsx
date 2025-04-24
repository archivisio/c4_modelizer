import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Card,
  CardContent,
  IconButton,
  SxProps,
  Theme,
  Typography,
} from "@mui/material";
import { Handle, Position } from "@xyflow/react";
import { ColorStyle } from "../../data/colors";
import { getTechnologyById } from "../../data/technologies";
import TechnologyIcon from "../TechnologyIcon";

export type HandlePositions = {
  source: Position | Position[];
  target: Position | Position[];
};

export interface C4BlockProps {
  name: string;
  description?: string;
  technology?: string;
  selected?: boolean;
  onEdit: () => void;
  colors: ColorStyle;
  handlePositions?: HandlePositions;
  children?: React.ReactNode;
}

const hexToRgb = (hex: string): string => {
  const cleanHex = hex.startsWith("#") ? hex.slice(1) : hex;

  const bigint = parseInt(cleanHex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `${r}, ${g}, ${b}`;
};

const C4Block: React.FC<C4BlockProps> = ({
  name,
  description,
  technology,
  selected = false,
  onEdit,
  colors,
  handlePositions = { source: Position.Bottom, target: Position.Top },
  children,
}) => {
  const techData = technology ? getTechnologyById(technology) : undefined;
  const defaultColorStyle = colors;
  const colorStyles: ColorStyle = techData
    ? {
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

  const cardSx: SxProps<Theme> = {
    minWidth: 200,
    width: "100%",
    height: "100%",
    borderRadius: 2,
    position: "relative",
    overflow: "visible",
    transition: "all 0.2s ease",
    boxShadow: selected
      ? `0 0 0 2px ${colorStyles.border}, ${colorStyles.glow}`
      : "0 4px 20px rgba(0,0,0,0.15)",
    background: colorStyles.gradient,
    border: `1px solid ${colorStyles.border}`,
    "&:hover": {
      boxShadow: `0 0 0 2px ${colorStyles.hover}, ${colorStyles.glow}`,
      background: colorStyles.gradientHover,
    },
  };

  return (
    <>
      {Array.isArray(handlePositions.target) ? (
        handlePositions.target.map((position, index) => (
          <Handle
            key={`target-${index}`}
            type="target"
            position={position}
            id={`target-${position}-${index}`}
            style={{
              background: colorStyles.border,
              border: `2px solid ${colorStyles.border}`,
              width: 8,
              height: 8,
            }}
          />
        ))
      ) : (
        <Handle
          type="target"
          position={handlePositions.target}
          style={{
            background: colorStyles.border,
            border: `2px solid ${colorStyles.border}`,
            width: 8,
            height: 8,
          }}
        />
      )}

      <Card sx={cardSx} className="tech-card">
        <CardContent sx={{ p: 1.5, color: "#fff" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 1,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {technology && <TechnologyIcon technologyId={technology} size={16} />}
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: "bold",
                  mb: 0.5,
                  color: "#fff",
                  textShadow: "0 0 10px rgba(255,255,255,0.3)",
                }}
              >
                {name}
              </Typography>
            </Box>

            <IconButton
              size="small"
              onClick={onEdit}
              sx={{
                backgroundColor: "rgba(0,0,0,0.3)",
                color: "#fff",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
                width: 22,
                height: 22,
                minWidth: 22,
                minHeight: 22,
                border: `1px solid ${colorStyles.border}`,
                backdropFilter: "blur(4px)",
                transition: "all 0.2s ease",
                p: 0.5,
              }}
            >
              <EditIcon fontSize="inherit" />
            </IconButton>
          </Box>

          {description && (
            <Typography
              variant="body2"
              sx={{
                mt: 1.5,
                color: "rgba(255,255,255,0.8)",
                backgroundColor: "rgba(0,0,0,0.2)",
                p: 1.5,
                borderRadius: 1,
                backdropFilter: "blur(4px)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
            >
              {description}
            </Typography>
          )}

          {children}
        </CardContent>
      </Card>

      {Array.isArray(handlePositions.source) ? (
        handlePositions.source.map((position, index) => (
          <Handle
            key={`source-${index}`}
            type="source"
            position={position}
            id={`source-${position}-${index}`}
            style={{
              background: colorStyles.border,
              border: `2px solid ${colorStyles.border}`,
              width: 10,
              height: 10,
              boxShadow: `0 0 5px ${colorStyles.border}`,
            }}
          />
        ))
      ) : (
        <Handle
          type="source"
          position={handlePositions.source}
          style={{
            background: colorStyles.border,
            border: `2px solid ${colorStyles.border}`,
            width: 10,
            height: 10,
            boxShadow: `0 0 5px ${colorStyles.border}`,
          }}
        />
      )}
    </>
  );
};

export default C4Block;
