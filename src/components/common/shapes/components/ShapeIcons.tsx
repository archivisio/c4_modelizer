import { ColorStyle } from "@/theme/theme";
import FolderIcon from "@mui/icons-material/Folder";
import PersonIcon from "@mui/icons-material/Person";
import StorageMuiIcon from "@mui/icons-material/Storage";
import { styled } from "@mui/material/styles";
import React from "react";

export const IconContainer = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  marginBottom: theme.spacing(1),
  "& svg": {
    fontSize: 40,
  },
}));

interface ShapeIconProps {
  colorStyles: ColorStyle;
}

export const UserIcon: React.FC<ShapeIconProps> = ({ colorStyles }) => (
  <IconContainer>
    <PersonIcon style={{ color: colorStyles.border }} />
  </IconContainer>
);

export const DatabaseIcon: React.FC<ShapeIconProps> = ({ colorStyles }) => (
  <IconContainer>
    <StorageMuiIcon color="inherit" style={{ color: colorStyles.border }} />
  </IconContainer>
);

export const StorageIcon: React.FC<ShapeIconProps> = ({ colorStyles }) => (
  <IconContainer>
    <FolderIcon color="inherit" style={{ color: colorStyles.border }} />
  </IconContainer>
);
