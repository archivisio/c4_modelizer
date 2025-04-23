import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
} from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface SystemEditDialogProps {
  open: boolean;
  initialName?: string;
  initialDescription?: string;
  initialTechnology?: string;
  initialCodeType?: 'class' | 'function' | 'interface' | 'variable' | 'other';
  initialLanguage?: string;
  initialCode?: string;
  elementType?: 'system' | 'container' | 'component' | 'code';
  onSave: (name: string, description: string, technology?: string, codeType?: 'class' | 'function' | 'interface' | 'variable' | 'other', language?: string, code?: string) => void;
  onClose: () => void;
}

export default function SystemEditDialog({
  open,
  initialName = '',
  initialDescription = '',
  initialTechnology = '',
  initialCodeType = 'class',
  initialLanguage = '',
  initialCode = '',
  elementType = 'system',
  onSave,
  onClose,
}: SystemEditDialogProps) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [technology, setTechnology] = useState(initialTechnology);
  const [codeType, setCodeType] = useState<'class' | 'function' | 'interface' | 'variable' | 'other'>(initialCodeType);
  const [language, setLanguage] = useState(initialLanguage);
  const [code, setCode] = useState(initialCode);
  const { t } = useTranslation();

  React.useEffect(() => {
    setName(initialName);
    setDescription(initialDescription);
    setTechnology(initialTechnology || '');
    setCodeType(initialCodeType);
    setLanguage(initialLanguage || '');
    setCode(initialCode || '');
  }, [initialName, initialDescription, initialTechnology, initialCodeType, initialLanguage, initialCode, open]);

  // Obtenez le titre et les labels appropriés en fonction du type d'élément
  const getDialogTitle = () => {
    switch (elementType) {
      case 'container': return t('edit_container');
      case 'component': return t('edit_component');
      case 'code': return t('edit_code_element');
      default: return t('edit_system');
    }
  };
  
  const getNameLabel = () => {
    switch (elementType) {
      case 'container': return t('container_name');
      case 'component': return t('component_name');
      default: return t('system_name');
    }
  };
  
  const getDescriptionLabel = () => {
    switch (elementType) {
      case 'container': return t('container_description');
      case 'component': return t('component_description');
      default: return t('system_description');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{getDialogTitle()}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label={getNameLabel()}
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="dense"
          label={getDescriptionLabel()}
          fullWidth
          multiline
          minRows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        {elementType === 'component' && (
          <TextField
            margin="dense"
            label={t('component_technology')}
            fullWidth
            value={technology}
            onChange={(e) => setTechnology(e.target.value)}
            placeholder={t('technology_placeholder')}
          />
        )}
        
        {elementType === 'code' && (
          <>
            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <TextField
                select
                margin="dense"
                label={t('code_type')}
                fullWidth
                value={codeType}
                onChange={(e) => setCodeType(e.target.value as 'class' | 'function' | 'interface' | 'variable' | 'other')}
              >
                <MenuItem value="class">{t('class')}</MenuItem>
                <MenuItem value="function">{t('function')}</MenuItem>
                <MenuItem value="interface">{t('interface')}</MenuItem>
                <MenuItem value="variable">{t('variable')}</MenuItem>
                <MenuItem value="other">{t('other')}</MenuItem>
              </TextField>
              
              <TextField
                margin="dense"
                label={t('language')}
                fullWidth
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                placeholder={t('language_placeholder')}
              />
            </Box>
            
            <TextField
              margin="dense"
              label={t('code_snippet')}
              fullWidth
              multiline
              minRows={4}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={t('code_placeholder')}
              sx={{ fontFamily: 'monospace' }}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('cancel')}</Button>
        <Button
          onClick={() => {
            if (elementType === 'code') {
              onSave(name, description, undefined, codeType, language, code);
            } else if (elementType === 'component') {
              onSave(name, description, technology);
            } else {
              onSave(name, description);
            }
          }}
          variant="contained"
          disabled={!name.trim()}
        >
          {t('save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
