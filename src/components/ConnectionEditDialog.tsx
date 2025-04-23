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
import { TechnologyLevel } from '../types/c4';
import TechnologySelect from './TechnologySelect';

interface ConnectionEditDialogProps {
  open: boolean;
  connection: ConnectionInfo | null;
  level: TechnologyLevel;
  onClose: () => void;
  onSave: (connectionInfo: ConnectionInfo) => void;
}

const ConnectionEditDialog: React.FC<ConnectionEditDialogProps> = ({
  open,
  connection,
  level,
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
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t('edit_connection')}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="normal"
          id="connection-label"
          label={t('connection_label')}
          fullWidth
          variant="outlined"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
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
        />
        <TechnologySelect
          level={level}
          value={technology}
          onChange={setTechnology}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('cancel')}</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          {t('save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConnectionEditDialog;
