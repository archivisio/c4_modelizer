import { TechnologyLevel } from "@archivisio/c4-modelizer-sdk";
import { getTechnologiesByLevel, Technology } from "@data/technologies";
import { Autocomplete, Box, TextField, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface TechColorProps {
  border: string;
  borderHover: string;
  borderFocus: string;
  labelFocus: string;
}

const TechColorDot = styled(Box)<{ bgcolor: string }>(({ bgcolor }) => ({
  width: 20,
  height: 20,
  borderRadius: "50%",
  backgroundColor: bgcolor,
  display: "inline-block",
  marginRight: 8,
  boxShadow: `0 0 5px ${bgcolor}80`,
}));

const TechOptionText = styled(Typography)(() => ({
  color: "#0a1929",
}));

const StyledTextField = styled(TextField)<{ colors: TechColorProps }>(
  ({ colors }) => ({
    "& .MuiOutlinedInput-root": {
      "& fieldset": { borderColor: colors.border },
      "&:hover fieldset": { borderColor: colors.borderHover },
      "&.Mui-focused fieldset": { borderColor: colors.borderFocus },
    },
    "& .MuiInputLabel-root": { color: "rgba(255, 255, 255, 0.7)" },
    "& .MuiInputLabel-root.Mui-focused": { color: colors.labelFocus },
    "& .MuiInputBase-input": { color: "#fff" },
    "& .MuiSvgIcon-root": { color: "rgba(255, 255, 255, 0.7)" },
  })
);

interface TechnologySelectProps {
  fullWidth?: boolean;
  level: TechnologyLevel;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

const getLevelColors = (level: TechnologyLevel) => {
  switch (level) {
    case "container":
      return {
        border: "rgba(0, 150, 136, 0.3)",
        borderHover: "rgba(0, 150, 136, 0.5)",
        borderFocus: "#00897b",
        labelFocus: "#4db6ac",
      };
    case "component":
      return {
        border: "rgba(255, 152, 0, 0.3)",
        borderHover: "rgba(255, 152, 0, 0.5)",
        borderFocus: "#f57c00",
        labelFocus: "#ffb74d",
      };
    case "code":
      return {
        border: "rgba(156, 39, 176, 0.3)",
        borderHover: "rgba(156, 39, 176, 0.5)",
        borderFocus: "#9c27b0",
        labelFocus: "#ce93d8",
      };
    case "connection":
      return {
        border: "rgba(0, 176, 255, 0.3)",
        borderHover: "rgba(0, 176, 255, 0.5)",
        borderFocus: "#0288d1",
        labelFocus: "#29b6f6",
      };
    default:
      return {
        border: "rgba(81, 162, 255, 0.3)",
        borderHover: "rgba(81, 162, 255, 0.5)",
        borderFocus: "#1976d2",
        labelFocus: "#51a2ff",
      };
  }
};

const TechnologySelect = ({
  fullWidth = false,
  level,
  value,
  onChange,
  label,
  placeholder,
}: TechnologySelectProps) => {
  const { t } = useTranslation();

  const colors = getLevelColors(level);
  const [options, setOptions] = useState<Technology[]>([]);
  const [selectedTech, setSelectedTech] = useState<Technology | null>(null);

  useEffect(() => {
    const compatibleTechs = getTechnologiesByLevel(level);
    setOptions(compatibleTechs);

    if (value) {
      const selected = compatibleTechs.find((tech) => tech.id === value);
      setSelectedTech(selected || null);
    } else {
      setSelectedTech(null);
    }
  }, [level, value]);

  return (
    <Autocomplete
      fullWidth={fullWidth}
      options={options}
      value={selectedTech}
      onChange={(_, newValue) => {
        setSelectedTech(newValue);
        onChange(newValue?.id || "");
      }}
      getOptionLabel={(option) => option.name}
      renderOption={(props, option) => {
        const { key, ...otherProps } = props;
        return (
          <Box
            key={key}
            component="li"
            sx={{ display: "flex", alignItems: "center" }}
            data-testid={`technology_option_${option.id}`}
            {...otherProps}
          >
            <TechColorDot bgcolor={option.color} />
            <TechOptionText variant="body2">{option.name}</TechOptionText>
          </Box>
        );
      }}
      renderInput={(params) => (
        <StyledTextField
          {...params}
          label={label || t("technology")}
          placeholder={placeholder || t("select_technology")}
          fullWidth
          margin="dense"
          colors={colors}
        />
      )}
      data-testid="input_technology"
    />
  );
};

export default TechnologySelect;
