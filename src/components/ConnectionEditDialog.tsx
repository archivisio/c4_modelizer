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
import { ConnectionInfo } from '../types/connection';
import TechnologySelect from './TechnologySelect';

interface ConnectionEditDialogProps {
  open: boolean;
  connection: ConnectionInfo | null;
  onClose: () => void;
  onSave: (connectionInfo: ConnectionInfo) => void;
}

const ConnectionEditDialog: React.FC<ConnectionEditDialogProps> = ({
  open,
  connection,
  onClose,
  onSave,
}) => {
  const { t } = useTranslation();
  
  const [label, setLabel] = useState('');
  const [technology, setTechnology] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (connection) {
      setLabel(connection.label || '');
      setTechnology(connection.technology || '');
      setDescription(connection.description || '');
    } else {
      // Reset form if not editing an existing connection
      setLabel('');
      setTechnology('');
      setDescription('');
    }
  }, [connection]);

  const handleSave = () => {
    if (!connection) return;
    
    onSave({
      ...connection,
      label,
      technology,
      description,
    });
  };

  return (
    <Dialog open={open} onClose={onClose} PaperProps={{ sx: { bgcolor: '#0a1929', color: '#fff', border: '1px solid rgba(0, 176, 255, 0.3)', borderRadius: 2, boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)' } }}>
      <DialogTitle sx={{ borderBottom: '1px solid rgba(0, 176, 255, 0.2)', pb: 2, '& .MuiTypography-root': { fontWeight: 600, background: 'linear-gradient(90deg, #0288d1 0%, #29b6f6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } }}>{t('edit_connection')}</DialogTitle>
      <DialogContent sx={{ py: 3 }}>
        <TextField
          autoFocus
          margin="normal"
          id="connection-label"
          label={t('connection_label')}
          fullWidth
          variant="outlined"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          sx={{ 
            mb: 2,
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'rgba(0, 176, 255, 0.3)' },
              '&:hover fieldset': { borderColor: 'rgba(0, 176, 255, 0.5)' },
              '&.Mui-focused fieldset': { borderColor: '#0288d1' }
            },
            '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
            '& .MuiInputLabel-root.Mui-focused': { color: '#29b6f6' },
            '& .MuiInputBase-input': { color: '#fff' }
          }}
        />
        <TextField
          margin="normal"
          id="connection-description"
          label={t('connection_description')}
          fullWidth
          multiline
          rows={3}
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{ 
            mb: 2,
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'rgba(0, 176, 255, 0.3)' },
              '&:hover fieldset': { borderColor: 'rgba(0, 176, 255, 0.5)' },
              '&.Mui-focused fieldset': { borderColor: '#0288d1' }
            },
            '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' },
            '& .MuiInputLabel-root.Mui-focused': { color: '#29b6f6' },
            '& .MuiInputBase-input': { color: '#fff' }
          }}
        />
        <TechnologySelect
          level={'connection' as any}
          value={technology}
          onChange={setTechnology}
          label={t('connection_technology')}
          placeholder={t('select_technology')}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, borderTop: '1px solid rgba(0, 176, 255, 0.2)' }}>
        <Button onClick={onClose} sx={{ color: 'rgba(255, 255, 255, 0.7)', '&:hover': { color: '#fff', backgroundColor: 'rgba(0, 176, 255, 0.1)' } }}>{t('cancel')}</Button>
        <Button onClick={handleSave} variant="contained" sx={{ 
            background: 'linear-gradient(90deg, #0288d1 0%, #29b6f6 100%)', 
            boxShadow: '0 4px 10px rgba(0, 176, 255, 0.3)',
            '&:hover': { background: 'linear-gradient(90deg, #01579b 0%, #0288d1 100%)' }
          }}>
          {t('save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConnectionEditDialog;
