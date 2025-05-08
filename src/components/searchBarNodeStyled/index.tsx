import { COLORS } from "@/data/colors";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { Box, IconButton, Stack, TextField, Typography } from "@mui/material";
import { styled } from "@mui/system";

export const SearchBarContainer = styled(Box)(() => ({
  position: "absolute",
  zIndex: 10,
  backgroundColor: COLORS.primary.background,
  backdropFilter: "blur(8px)",
  padding: "16px",
  borderRadius: "8px",
  boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
  border: `1px solid ${COLORS.primary.border}`,
  width: "350px",
  maxHeight: "400px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
}));

export const TitleBar = styled(Stack)(() => ({
  borderBottom: `1px solid ${COLORS.primary.background}`,
  marginBottom: 8,
  paddingBottom: 8,
  paddingTop: 4,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  cursor: "move",
  width: "100%",
}));

export const DragIcon = styled(DragIndicatorIcon)(() => ({
  color: COLORS.primary.border,
  fontSize: 20,
}));

export const TitleText = styled(Typography)(() => ({
  color: COLORS.primary.border,
  fontWeight: "600",
}));

export const SubtitleText = styled(Typography)(() => ({
  color: COLORS.primary.border,
  fontSize: "0.7rem",
}));

export const CloseButton = styled(IconButton)(() => ({
  color: COLORS.primary.border,
  padding: "2px",
}));

export const SearchField = styled(TextField)(() => ({
  width: "100%",
  "& .MuiOutlinedInput-root": {
    borderRadius: "6px",
    color: COLORS.primary.border,
    "&.Mui-focused fieldset": {
      borderColor: COLORS.primary.border,
      borderWidth: "2px",
    },
    "& input": {
      color: COLORS.primary.border,
    },
  },
  "& .MuiInputLabel-root": {
    color: COLORS.primary.border,
    fontWeight: "500",
  },
}));

export const ResultsContainer = styled(Box)(() => ({
  marginTop: 8,
  overflowY: "auto",
  maxHeight: "300px",
  "&::-webkit-scrollbar": {
    width: "6px",
    borderRadius: "3px",
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: COLORS.primary.background,
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: COLORS.primary.hover,
    borderRadius: "3px",
  },
}));

export const ResultItem = styled(Box)(() => ({
  padding: "12px 16px",
  borderRadius: "4px",
  cursor: "pointer",
  transition: "all 0.2s ease",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 4,
  "&:hover": {
    backgroundColor: COLORS.primary.hover,
  },
}));

export const ItemName = styled(Typography)(() => ({
  color: COLORS.primary.border,
  fontWeight: "500",
}));

export const ItemType = styled(Typography)(() => ({
  color: COLORS.secondary.border,
  backgroundColor: COLORS.secondary.background,
  padding: "4px 8px",
  borderRadius: "4px",
  fontSize: "0.7rem",
}));

export const EmptyResults = styled(Box)(() => ({
  padding: "24px 0",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  gap: 8,
}));

export const EmptyText = styled(Typography)(() => ({
  color: COLORS.secondary.border,
}));
