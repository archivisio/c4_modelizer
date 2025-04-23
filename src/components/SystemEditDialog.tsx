import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface SystemEditDialogProps {
  open: boolean;
  initialName?: string;
  initialDescription?: string;
  initialTechnology?: string;
  elementType?: 'system' | 'container' | 'component';
  onSave: (name: string, description: string, technology?: string) => void;
  onClose: () => void;
}

export default function SystemEditDialog({
  open,
  initialName = '',
  initialDescription = '',
  initialTechnology = '',
  elementType = 'system',
  onSave,
  onClose,
}: SystemEditDialogProps) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [technology, setTechnology] = useState(initialTechnology);
  const { t } = useTranslation();

  React.useEffect(() => {
    setName(initialName);
    setDescription(initialDescription);
    setTechnology(initialTechnology || '');
  }, [initialName, initialDescription, initialTechnology, open]);

  // Obtenez le titre et les labels appropriés en fonction du type d'élément
  const getDialogTitle = () => {
    switch (elementType) {
      case 'container': return t('edit_container');
      case 'component': return t('edit_component');
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('cancel')}</Button>
        <Button
          onClick={() => onSave(name, description, elementType === 'component' ? technology : undefined)}
          variant="contained"
          disabled={!name.trim()}
        >
          {t('save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
