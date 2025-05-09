import { Box } from "@mui/material";
import { styled } from "@mui/system";

export const ErrorBox = styled(Box)(() => ({
  position: "absolute",
  bottom: 16,
  left: 16,
  bgcolor: "#f44336",
  color: "white",
  padding: 16,
  borderRadius: 4,
}));
