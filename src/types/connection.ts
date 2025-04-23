// Types pour les connexions entre éléments C4
import { TechnologyLevel } from './c4';

// Informations de base pour une connexion
export interface ConnectionInfo {
  id: string; // Format 'source->target'
  sourceId: string;
  targetId: string;
  label?: string;
  technology?: string;
  description?: string;
}

// Type pour stocker les connexions dans le store
export interface ConnectionData {
  targetId: string;
  label?: string;
  technology?: string;
  description?: string;
}

// Types pour les props du dialogue d'édition de connexion
export interface ConnectionEditDialogProps {
  open: boolean;
  connection: ConnectionInfo | null;
  level: TechnologyLevel;
  onClose: () => void;
  onSave: (connection: ConnectionInfo) => void;
}
