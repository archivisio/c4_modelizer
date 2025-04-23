import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import TechnologySelect from './TechnologySelect';

interface ContainerEditDialogProps {
  open: boolean;
  initialName?: string;
  initialDescription?: string;
  initialTechnology?: string;
  onSave: (name: string, description: string, technology: string) => void;
  onClose: () => void;
}

export default function ContainerEditDialog({
  open,
  initialName = '',
  initialDescription = '',
  initialTechnology = '',
  onSave,
  onClose,
}: ContainerEditDialogProps) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [technology, setTechnology] = useState(initialTechnology);
  const { t } = useTranslation();

  useEffect(() => {
    setName(initialName);
    setDescription(initialDescription);
    setTechnology(initialTechnology || '');
  }, [initialName, initialDescription, initialTechnology, open]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t('edit_container')}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label={t('container_name')}
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="dense"
          label={t('container_description')}
          fullWidth
          multiline
          minRows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TechnologySelect
          level="container"
          value={technology}
          onChange={setTechnology}
          label={t('container_technology')}
          placeholder={t('select_technology')}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('cancel')}</Button>
        <Button
          onClick={() => onSave(name, description, technology)}
          variant="contained"
          disabled={!name.trim()}
        >
          {t('save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
