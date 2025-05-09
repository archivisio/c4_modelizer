import { ColorStyle } from "@/theme/theme";
import { Box, Card, CardContent, IconButton, Typography } from "@mui/material";
import { styled } from "@mui/system";

export const hexToRgb = (hex: string): string => {
  const cleanHex = hex.startsWith("#") ? hex.slice(1) : hex;

  const bigint = parseInt(cleanHex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;

  return `${r}, ${g}, ${b}`;
};

export const BlockContainer = styled(Box)(() => ({
  backgroundColor: "#0a1929",
  borderRadius: 12,
}));

export const StyledCard = styled(Card)<{
  colorstyles: ColorStyle;
  selected: boolean;
  hasDescription: boolean;
}>(({ colorstyles, selected, hasDescription }) => ({
  width: 200,
  height: hasDescription ? 120 : 80,
  borderRadius: 8,
  position: "relative",
  overflow: "hidden",
  transition: "all 0.2s ease",
  boxShadow: selected
    ? `0 0 0 2px ${colorstyles.border}, ${colorstyles.glow}`
    : "0 4px 20px rgba(0,0,0,0.15)",
  background: colorstyles.gradient,
  border: `1px solid ${colorstyles.border}`,
  "&:hover": {
    boxShadow: `0 0 0 2px ${colorstyles.hover}, ${colorstyles.glow}`,
    background: colorstyles.gradientHover,
  },
  display: "flex",
  flexDirection: "column",
}));

export const StyledCardContent = styled(CardContent)(() => ({
  padding: 12,
  color: "#fff",
  overflow: "hidden",
  flex: 1,
  display: "flex",
  flexDirection: "column",
}));

export const HeaderContainer = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: 8,
}));

export const TitleContainer = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  gap: 8,
  minWidth: 0,
}));

export const BlockTitle = styled(Typography)(() => ({
  fontWeight: "bold",
  color: "#fff",
  textShadow: "0 0 10px rgba(255,255,255,0.3)",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  maxWidth: "130px",
}));

export const ActionsContainer = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  gap: 8,
  minWidth: 0,
}));

export const ActionIconButton = styled(IconButton)<{ colorstyles: ColorStyle }>(
  ({ colorstyles }) => ({
    backgroundColor: "rgba(0,0,0,0.3)",
    color: "#fff",
    "&:hover": {
      backgroundColor: `rgba(${hexToRgb(colorstyles.hover)}, 0.2)`,
      borderColor: colorstyles.hover,
      boxShadow: `0 0 5px rgba(${hexToRgb(colorstyles.hover)}, 0.3)`,
    },
    "&:focus": {
      backgroundColor: `rgba(${hexToRgb(colorstyles.hover)}, 0.2)`,
      borderColor: colorstyles.hover,
      boxShadow: `0 0 5px rgba(${hexToRgb(colorstyles.hover)}, 0.3)`,
      outline: "none",
    },
    "&:focus-visible": {
      outline: "none",
    },
    width: 22,
    height: 22,
    minWidth: 22,
    minHeight: 22,
    border: `1px solid ${colorstyles.border}`,
    backdropFilter: "blur(4px)",
    transition: "all 0.2s ease",
    padding: 4,
  })
);

export const DescriptionText = styled(Typography)(() => ({
  marginTop: 12,
  color: "rgba(255,255,255,0.8)",
  backgroundColor: "rgba(0,0,0,0.2)",
  padding: 8,
  borderRadius: 4,
  backdropFilter: "blur(4px)",
  border: "1px solid rgba(255,255,255,0.1)",
  overflow: "hidden",
  textOverflow: "ellipsis",
  WebkitLineClamp: 3,
  WebkitBoxOrient: "vertical",
  lineHeight: "1.2em",
  maxHeight: "3.6em",
  display: "-webkit-box",
}));

export const createHandleStyle = (
  colorstyles: ColorStyle,
  isSource: boolean = false
) => ({
  background: colorstyles.border,
  border: `2px solid ${colorstyles.border}`,
  width: isSource ? 10 : 8,
  height: isSource ? 10 : 8,
  boxShadow: isSource ? `0 0 5px ${colorstyles.border}` : undefined,
});
