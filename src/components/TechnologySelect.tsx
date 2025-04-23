import { Autocomplete, Box, TextField, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { getTechnologiesByLevel, Technology } from '../data/technologies';
import { TechnologyLevel } from '../types/c4';

interface TechnologySelectProps {
  level: TechnologyLevel;
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
}

/**
 * A component for selecting technologies from a predefined list
 * filtered by compatibility level (container, component, code)
 */
const TechnologySelect = ({
  level,
  value,
  onChange,
  label,
  placeholder,
}: TechnologySelectProps) => {
  const { t } = useTranslation();
  const [options, setOptions] = useState<Technology[]>([]);
  const [selectedTech, setSelectedTech] = useState<Technology | null>(null);

  // Load compatible technologies based on level
  useEffect(() => {
    const compatibleTechs = getTechnologiesByLevel(level);
    setOptions(compatibleTechs);
    
    // Find initially selected technology if any
    if (value) {
      const selected = compatibleTechs.find(tech => tech.id === value);
      setSelectedTech(selected || null);
    } else {
      setSelectedTech(null);
    }
  }, [level, value]);

  return (
    <Autocomplete
      options={options}
      value={selectedTech}
      onChange={(_, newValue) => {
        setSelectedTech(newValue);
        onChange(newValue?.id || '');
      }}
      getOptionLabel={(option) => option.name}
      renderOption={(props, option) => {
        // Extraction de la prop 'key' pour éviter le warning React
        const { key, ...otherProps } = props;
        return (
        <Box key={key} component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...otherProps}>
          <Box 
            sx={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              backgroundColor: option.color,
              display: 'inline-block',
              mr: 1
            }}
          />
          <Typography variant="body2">{option.name}</Typography>
        </Box>
        );
      }}
      renderInput={(params) => (
        <TextField 
          {...params} 
          label={label || t('technology')}
          placeholder={placeholder || t('select_technology')}
          fullWidth
        />
      )}
    />
  );
};

export default TechnologySelect;
