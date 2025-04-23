import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import React, { useState } from 'react';

interface SystemEditDialogProps {
  open: boolean;
  initialName?: string;
  initialDescription?: string;
  onSave: (name: string, description: string) => void;
  onClose: () => void;
}

export default function SystemEditDialog({
  open,
  initialName = '',
  initialDescription = '',
  onSave,
  onClose,
}: SystemEditDialogProps) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);

  React.useEffect(() => {
    setName(initialName);
    setDescription(initialDescription);
  }, [initialName, initialDescription, open]);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Éditer le système</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Nom du système"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="dense"
          label="Description"
          fullWidth
          multiline
          minRows={2}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button
          onClick={() => onSave(name, description)}
          variant="contained"
          disabled={!name.trim()}
        >
          Sauvegarder
        </Button>
      </DialogActions>
    </Dialog>
  );
}
