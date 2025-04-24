import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import TechnologySelect from './TechnologySelect';

interface ComponentEditDialogProps {
  open: boolean;
  initialName?: string;
  initialDescription?: string;
  initialTechnology?: string;
  onSave: (name: string, description: string, technology: string) => void;
  onClose: () => void;
}

export default function ComponentEditDialog({
  open,
  initialName = '',
  initialDescription = '',
  initialTechnology = '',
  onSave,
  onClose,
}: ComponentEditDialogProps) {
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
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: { bgcolor: '#0a1929', color: '#fff', border: '1px solid rgba(255, 152, 0, 0.3)', borderRadius: 2, boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)' } }}>
      <DialogTitle sx={{ borderBottom: '1px solid rgba(255, 152, 0, 0.2)', pb: 2, '& .MuiTypography-root': { fontWeight: 600, background: 'linear-gradient(90deg, #f57c00 0%, #ffb74d 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } }}>{t('edit_component')}</DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        <TextField
          autoFocus
          margin="dense"
          label={t('component_name')}
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ 
            mb: 2,
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'rgba(255, 152, 0, 0.3)' },
              '&:hover fieldset': { borderColor: 'rgba(255, 152, 0, 0.5)' },
              '&.Mui-focused fieldset': { borderColor: '#f57c00' }
            },
            '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
            '& .MuiInputLabel-root.Mui-focused': { color: '#ffb74d' },
            '& .MuiInputBase-input': { color: '#fff' }
          }}
        />
        <TextField
          margin="dense"
          label={t('component_description')}
          fullWidth
          multiline
          minRows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ 
            mb: 2,
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'rgba(255, 152, 0, 0.3)' },
              '&:hover fieldset': { borderColor: 'rgba(255, 152, 0, 0.5)' },
              '&.Mui-focused fieldset': { borderColor: '#f57c00' }
            },
            '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
            '& .MuiInputLabel-root.Mui-focused': { color: '#ffb74d' },
            '& .MuiInputBase-input': { color: '#fff' }
          }}
        />
        <TechnologySelect
          level="component"
          value={technology}
          onChange={setTechnology}
          label={t('component_technology')}
          placeholder={t('select_technology')}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid rgba(255, 152, 0, 0.2)' }}>
        <Button onClick={onClose} sx={{ color: 'rgba(255, 255, 255, 0.7)', '&:hover': { color: '#fff', backgroundColor: 'rgba(255, 152, 0, 0.1)' } }}>{t('cancel')}</Button>
        <Button
          onClick={() => onSave(name, description, technology)}
          variant="contained"
          disabled={!name.trim()}
          sx={{ 
            background: 'linear-gradient(90deg, #f57c00 0%, #ffb74d 100%)', 
            boxShadow: '0 4px 10px rgba(255, 152, 0, 0.3)',
            '&:hover': { background: 'linear-gradient(90deg, #e65100 0%, #f57c00 100%)' },
            '&.Mui-disabled': { background: 'rgba(255, 152, 0, 0.1)', color: 'rgba(255, 255, 255, 0.3)' }
          }}
        >
          {t('save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
