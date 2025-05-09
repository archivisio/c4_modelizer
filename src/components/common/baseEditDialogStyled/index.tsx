import { DialogTheme } from "@/components/common/BaseEditDialog";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  PaperProps,
} from "@mui/material";
import { styled } from "@mui/system";

export const StyledDialog = styled(Dialog)(() => ({
  "& .MuiDialog-paper": {
    bgcolor: "#0a1929",
    color: "#fff",
    borderRadius: 8,
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
  },
}));

export const StyledDialogContent = styled(DialogContent)(() => ({
  paddingTop: 24,
  paddingBottom: 24,
}));

export const CancelButton = styled(Button)(() => ({
  color: "rgba(255, 255, 255, 0.7)",
  "&:hover": {
    color: "#fff",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
}));

export const DeleteButton = styled(IconButton)(() => ({
  color: "#ff5252",
  "&:hover": {
    backgroundColor: "rgba(255, 82, 82, 0.1)",
  },
}));

export const createDialogPaperStyles = (theme: DialogTheme) => ({
  bgcolor: "#0a1929",
  color: "#fff",
  border: `1px solid rgba(${theme.primaryColor}, 0.3)`,
  borderRadius: 8,
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
});

export const createDialogTitleStyles = (theme: DialogTheme) => ({
  borderBottom: `1px solid rgba(${theme.primaryColor}, 0.2)`,
  paddingBottom: 16,
  "& .MuiTypography-root": {
    fontWeight: 600,
    background: `linear-gradient(90deg, ${theme.gradientStart} 0%, ${theme.gradientEnd} 100%)`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

export const createDialogActionsStyles = (theme: DialogTheme) => ({
  paddingLeft: 24,
  paddingRight: 24,
  paddingTop: 16,
  paddingBottom: 16,
  borderTop: `1px solid rgba(${theme.primaryColor}, 0.2)`,
});

export const createSaveButtonStyles = (theme: DialogTheme) => ({
  background: `linear-gradient(90deg, ${theme.gradientStart} 0%, ${theme.gradientEnd} 100%)`,
  boxShadow: `0 4px 10px rgba(${theme.primaryColor}, 0.3)`,
  "&:hover": {
    background: `linear-gradient(90deg, ${theme.hoverGradientStart} 0%, ${theme.hoverGradientEnd} 100%)`,
  },
  "&.Mui-disabled": {
    background: `rgba(${theme.primaryColor}, 0.1)`,
    color: "rgba(255, 255, 255, 0.3)",
  },
});

export const DialogPaper = (props: PaperProps & { theme?: DialogTheme }) => {
  const { theme, ...otherProps } = props;
  return (
    <Paper
      {...otherProps}
      sx={theme ? createDialogPaperStyles(theme) : undefined}
    />
  );
};

export const StyledDialogTitle = (
  props: React.ComponentProps<typeof DialogTitle> & { theme?: DialogTheme }
) => {
  const { theme, ...otherProps } = props;
  return (
    <DialogTitle
      {...otherProps}
      sx={theme ? createDialogTitleStyles(theme) : undefined}
    />
  );
};

export const StyledDialogActions = (
  props: React.ComponentProps<typeof DialogActions> & { theme?: DialogTheme }
) => {
  const { theme, ...otherProps } = props;
  return (
    <DialogActions
      {...otherProps}
      sx={theme ? createDialogActionsStyles(theme) : undefined}
    />
  );
};

export const SaveButton = (
  props: React.ComponentProps<typeof Button> & { theme?: DialogTheme }
) => {
  const { theme, ...otherProps } = props;
  return (
    <Button
      {...otherProps}
      sx={theme ? createSaveButtonStyles(theme) : undefined}
    />
  );
};
