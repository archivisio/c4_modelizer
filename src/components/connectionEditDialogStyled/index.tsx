import { Box, Checkbox, FormControlLabel, Slider } from "@mui/material";
import { styled } from "@mui/system";

export const LabelText = styled('label')(() => ({
  color: "#fff",
  fontSize: 14,
  marginBottom: 4,
  display: "block",
}));

export const StyledSlider = styled(Slider)(() => ({
  color: "#3f51b5",
  "& .MuiSlider-markLabel": {
    color: "#fff",
  },
}));

export const StyledFormControlWrapper = styled(Box)(() => ({
  marginTop: 16,
}));

export const StyledCheckbox = styled(Checkbox)(() => ({
  color: "#fff",
  "&.Mui-checked": {
    color: "#3f51b5",
  },
  "& .MuiSvgIcon-root": {
    width: "0.9em",
    height: "0.9em",
  },
}));

export const StyledFormControlLabel = styled(FormControlLabel)(() => ({
  "& .MuiFormControlLabel-label": {
    color: "#fff",
    fontSize: 14,
  },
}));
