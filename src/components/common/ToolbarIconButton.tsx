import { IconButton, styled } from "@mui/material";

export const ToolbarIconButton = styled(IconButton)(() => ({
  color: "#fff",
  background: "rgba(81, 162, 255, 0.1)",
  backdropFilter: "blur(4px)",
  marginRight: 8,
  transition: "all 0.2s ease",
  "&:hover": { background: "rgba(81, 162, 255, 0.2)" },
}));