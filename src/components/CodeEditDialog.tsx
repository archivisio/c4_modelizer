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
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

interface CodeEditDialogProps {
  open: boolean;
  initialName?: string;
  initialDescription?: string;
  initialCodeType?: 'class' | 'function' | 'interface' | 'variable' | 'other';
  initialLanguage?: string;
  initialCode?: string;
  onSave: (name: string, description: string, codeType: 'class' | 'function' | 'interface' | 'variable' | 'other', language: string, code: string) => void;
  onClose: () => void;
}

export default function CodeEditDialog({
  open,
  initialName = '',
  initialDescription = '',
  initialCodeType = 'class',
  initialLanguage = '',
  initialCode = '',
  onSave,
  onClose,
}: CodeEditDialogProps) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [codeType, setCodeType] = useState<'class' | 'function' | 'interface' | 'variable' | 'other'>(initialCodeType);
  const [language, setLanguage] = useState(initialLanguage);
  const [code, setCode] = useState(initialCode);
  const { t } = useTranslation();

  useEffect(() => {
    setName(initialName);
    setDescription(initialDescription);
    setCodeType(initialCodeType);
    setLanguage(initialLanguage || '');
    setCode(initialCode || '');
  }, [initialName, initialDescription, initialCodeType, initialLanguage, initialCode, open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{t('edit_code_element')}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label={t('code_element_name')}
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="dense"
          label={t('code_element_description')}
          fullWidth
          multiline
          minRows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
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
          minRows={6}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder={t('code_placeholder')}
          sx={{ fontFamily: 'monospace' }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('cancel')}</Button>
        <Button
          onClick={() => onSave(name, description, codeType, language, code)}
          variant="contained"
          disabled={!name.trim()}
        >
          {t('save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
