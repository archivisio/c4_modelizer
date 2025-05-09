import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import { Box, IconButton, Stack, TextField, Typography, useTheme } from "@mui/material";
import { styled } from "@mui/system";

export const SearchBarContainer = styled(Box)(() => {
  const theme = useTheme();
  return {
    position: "absolute",
    zIndex: 10,
    backgroundColor: theme.c4Colors.system.background,
    backdropFilter: "blur(8px)",
    padding: "16px",
    borderRadius: "8px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
    border: `1px solid ${theme.c4Colors.system.border}`,
    width: "350px",
    maxHeight: "400px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  };
});

export const TitleBar = styled(Stack)(() => {
  const theme = useTheme();
  return {
    borderBottom: `1px solid ${theme.c4Colors.system.background}`,
    marginBottom: 8,
    paddingBottom: 8,
    paddingTop: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    cursor: "move",
    width: "100%",
  };
});

export const DragIcon = styled(DragIndicatorIcon)(() => {
  const theme = useTheme();
  return {
    color: theme.c4Colors.system.border,
    fontSize: 20,
  };
});

export const TitleText = styled(Typography)(() => {
  const theme = useTheme();
  return {
    color: theme.c4Colors.system.border,
    fontWeight: "600",
  };
});

export const SubtitleText = styled(Typography)(() => {
  const theme = useTheme();
  return {
    color: theme.c4Colors.system.border,
    fontSize: "0.7rem",
  };
});

export const CloseButton = styled(IconButton)(() => {
  const theme = useTheme();
  return {
    color: theme.c4Colors.system.border,
    padding: "2px",
  };
});

export const SearchField = styled(TextField)(() => {
  const theme = useTheme();
  return {
    width: "100%",
    "& .MuiOutlinedInput-root": {
      borderRadius: "6px",
      color: theme.c4Colors.system.border,
      "&.Mui-focused fieldset": {
        borderColor: theme.c4Colors.system.border,
        borderWidth: "2px",
      },
      "& input": {
        color: theme.c4Colors.system.border,
      },
    },
    "& .MuiInputLabel-root": {
      color: theme.c4Colors.system.border,
      fontWeight: "500",
    },
  };
});

export const ResultsContainer = styled(Box)(() => {
  const theme = useTheme();
  return {
    marginTop: 8,
    overflowY: "auto",
    maxHeight: "300px",
    "&::-webkit-scrollbar": {
      width: "6px",
      borderRadius: "3px",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: theme.c4Colors.system.background,
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: theme.c4Colors.system.hover,
      borderRadius: "3px",
    },
  };
});

export const ResultItem = styled(Box)(() => {
  const theme = useTheme();
  return {
    padding: "12px 16px",
    borderRadius: "4px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
    "&:hover": {
      backgroundColor: theme.c4Colors.system.hover,
    },
  };
});

export const ItemName = styled(Typography)(() => {
  const theme = useTheme();
  return {
    color: theme.c4Colors.system.border,
    fontWeight: "500",
  };
});

export const ItemType = styled(Typography)(() => {
  const theme = useTheme();
  return {
    color: theme.c4Colors.container.border,
    backgroundColor: theme.c4Colors.container.background,
    padding: "4px 8px",
    borderRadius: "4px",
    fontSize: "0.7rem",
  };
});

export const EmptyResults = styled(Box)(() => ({
  padding: "24px 0",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  gap: 8,
}));

export const EmptyText = styled(Typography)(() => {
  const theme = useTheme();
  return {
    color: theme.c4Colors.container.border,
  };
});
