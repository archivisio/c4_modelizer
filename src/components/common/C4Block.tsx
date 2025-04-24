import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Card,
  CardContent,
  Chip,
  IconButton,
  SxProps,
  Theme,
  Typography,
} from "@mui/material";
import { Handle, Position } from "@xyflow/react";
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
  type: "system" | "container" | "component" | "code";
  codeType?: "class" | "function" | "interface" | "variable" | "other";
  code?: string;
  onEdit: () => void;
  variant?: "primary" | "secondary" | "tertiary" | "quaternary";
  handlePositions?: HandlePositions;
  additionalContent?: React.ReactNode;
}

interface ColorStyle {
  background: string;
  gradient: string;
  gradientHover: string;
  border: string;
  hover: string;
  glow: string;
}

const COLORS: Record<string, ColorStyle> = {
  primary: {
    background: "rgba(13, 71, 161, 0.1)",
    gradient:
      "linear-gradient(135deg, rgba(25, 118, 210, 0.15) 0%, rgba(13, 71, 161, 0.1) 100%)",
    gradientHover:
      "linear-gradient(135deg, rgba(25, 118, 210, 0.25) 0%, rgba(13, 71, 161, 0.2) 100%)",
    border: "#1976d2",
    hover: "#42a5f5",
    glow: "0 0 15px rgba(33, 150, 243, 0.3)",
  },
  secondary: {
    background: "rgba(0, 121, 107, 0.1)",
    gradient:
      "linear-gradient(135deg, rgba(0, 150, 136, 0.15) 0%, rgba(0, 121, 107, 0.1) 100%)",
    gradientHover:
      "linear-gradient(135deg, rgba(0, 150, 136, 0.25) 0%, rgba(0, 121, 107, 0.2) 100%)",
    border: "#00897b",
    hover: "#26a69a",
    glow: "0 0 15px rgba(0, 150, 136, 0.3)",
  },
  tertiary: {
    background: "rgba(245, 124, 0, 0.1)",
    gradient:
      "linear-gradient(135deg, rgba(255, 152, 0, 0.15) 0%, rgba(245, 124, 0, 0.1) 100%)",
    gradientHover:
      "linear-gradient(135deg, rgba(255, 152, 0, 0.25) 0%, rgba(245, 124, 0, 0.2) 100%)",
    border: "#f57c00",
    hover: "#ffa726",
    glow: "0 0 15px rgba(255, 152, 0, 0.3)",
  },
  quaternary: {
    background: "rgba(123, 31, 162, 0.1)",
    gradient:
      "linear-gradient(135deg, rgba(156, 39, 176, 0.15) 0%, rgba(123, 31, 162, 0.1) 100%)",
    gradientHover:
      "linear-gradient(135deg, rgba(156, 39, 176, 0.25) 0%, rgba(123, 31, 162, 0.2) 100%)",
    border: "#7b1fa2",
    hover: "#ab47bc",
    glow: "0 0 15px rgba(156, 39, 176, 0.3)",
  },
};

const TYPE_TO_VARIANT: Record<
  string,
  "primary" | "secondary" | "tertiary" | "quaternary"
> = {
  system: "primary",
  container: "secondary",
  component: "tertiary",
  code: "quaternary",
  class: "quaternary",
  function: "secondary",
  interface: "tertiary",
  variable: "primary",
  other: "quaternary",
};

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
  type,
  codeType,
  code,
  onEdit,
  variant,
  handlePositions = { source: Position.Bottom, target: Position.Top },
  additionalContent,
}) => {
  const techData = technology ? getTechnologyById(technology) : undefined;

  const colorVariant =
    variant || TYPE_TO_VARIANT[codeType || type] || "primary";
  const defaultColors = COLORS[colorVariant];

  const colors: ColorStyle = techData
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
    : defaultColors;

  const cardSx: SxProps<Theme> = {
    minWidth: 200,
    maxWidth: 280,
    borderRadius: 2,
    border: `1px solid ${colors.border}`,
    background: colors.gradient,
    transition: "all 0.2s ease-in-out",
    boxShadow: selected
      ? `0 0 0 2px ${colors.border}, ${colors.glow}`
      : "0 4px 20px rgba(0,0,0,0.15)",
    backdropFilter: "blur(8px)",
    "&:hover": {
      background: colors.gradientHover,
      boxShadow: `0 8px 32px rgba(0,0,0,0.2), ${colors.glow}`,
      transform: "translateY(-3px)",
    },
    overflow: "visible",
    position: "relative",
    "&::after": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      height: "4px",
      background: `linear-gradient(90deg, transparent, ${colors.border}, transparent)`,
      borderTopLeftRadius: "2px",
      borderTopRightRadius: "2px",
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
              background: colors.border,
              border: `2px solid ${colors.border}`,
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
            background: colors.border,
            border: `2px solid ${colors.border}`,
            width: 8,
            height: 8,
          }}
        />
      )}

      <Card sx={cardSx} className="tech-card">
        <CardContent sx={{ p: 2.5, color: "#fff" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 1,
            }}
          >
            <Box>
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

              {codeType && (
                <Chip
                  size="small"
                  label={codeType}
                  sx={{
                    borderColor: `${
                      COLORS[TYPE_TO_VARIANT[codeType || "other"]].border
                    }`,
                    color: "#fff",
                    fontWeight: "medium",
                    backgroundColor: "rgba(0,0,0,0.2)",
                    backdropFilter: "blur(4px)",
                    "& .MuiChip-label": { px: 1.5 },
                  }}
                  variant="outlined"
                />
              )}

              {technology && (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mt: 1,
                    gap: 0.8,
                    backgroundColor: "rgba(0,0,0,0.2)",
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    backdropFilter: "blur(4px)",
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                >
                  <TechnologyIcon technologyId={technology} size={16} />
                  <Typography
                    variant="caption"
                    sx={{
                      color: "rgba(255,255,255,0.8)",
                      fontWeight: "medium",
                    }}
                  >
                    {technology}
                  </Typography>
                </Box>
              )}
            </Box>

            <IconButton
              size="small"
              onClick={onEdit}
              sx={{
                backgroundColor: "rgba(0,0,0,0.3)",
                color: "#fff",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
                width: 32,
                height: 32,
                border: "1px solid rgba(255,255,255,0.2)",
                backdropFilter: "blur(4px)",
                transition: "all 0.2s ease",
              }}
            >
              <EditIcon fontSize="small" />
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

          {additionalContent}
          {code && (
            <Box
              sx={{
                mt: 1.5,
                p: 1.5,
                backgroundColor: "rgba(0,0,0,0.3)",
                borderRadius: 1,
                fontSize: "0.75rem",
                fontFamily: '"Fira Code", "Roboto Mono", monospace',
                overflowX: "auto",
                maxHeight: "80px",
                overflowY: "auto",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#e0e0e0",
                backdropFilter: "blur(4px)",
                boxShadow: "inset 0 0 10px rgba(0,0,0,0.2)",
              }}
            >
              {code}
            </Box>
          )}

          <Box
            sx={{
              position: "absolute",
              bottom: 4,
              right: 8,
              backgroundColor: "rgba(0,0,0,0.3)",
              px: 1.5,
              py: 0.3,
              borderRadius: 5,
              border: `1px solid ${colors.border}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(4px)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: "bold",
                fontSize: "0.65rem",
                color: "#fff",
                textTransform: "uppercase",
                letterSpacing: 1,
                textShadow: `0 0 5px ${colors.border}`,
              }}
            >
              {type}
            </Typography>
          </Box>
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
              background: colors.border,
              border: `2px solid ${colors.border}`,
              width: 10,
              height: 10,
              boxShadow: `0 0 5px ${colors.border}`,
            }}
          />
        ))
      ) : (
        <Handle
          type="source"
          position={handlePositions.source}
          style={{
            background: colors.border,
            border: `2px solid ${colors.border}`,
            width: 10,
            height: 10,
            boxShadow: `0 0 5px ${colors.border}`,
          }}
        />
      )}
    </>
  );
};

export default C4Block;
