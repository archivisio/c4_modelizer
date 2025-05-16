import { StyledCard } from "../../c4BlockStyled";
import { styled } from "@mui/material/styles";

export const UserCard = styled(StyledCard)({
  borderRadius: "50% 50% 0 0",
  width: 100,
  height: 100,
});

export const DatabaseCard = styled(StyledCard)({
  borderRadius: "0 0 50% 50%",
  width: 150,
  height: 150,
  "&::before": {
    content: '""',
    position: "absolute",
    top: "10%",
    left: 0,
    right: 0,
    height: "1px",
    backgroundColor: "currentColor",
    opacity: 0.2,
  },
  "&::after": {
    content: '""',
    position: "absolute",
    top: "20%",
    left: 0,
    right: 0,
    height: "1px",
    backgroundColor: "currentColor",
    opacity: 0.2,
  },
});

export const StorageCard = styled(StyledCard)({
  position: "relative",
  width: 150,
  height: 100,
  "&::before": {
    content: '""',
    position: "absolute",
    top: 0,
    left: "10%",
    width: "80%",
    height: "10px",
    backgroundColor: "currentColor",
    opacity: 0.2,
    borderRadius: "5px 5px 0 0",
  },
});
