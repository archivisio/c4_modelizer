
import { TechnologyLevel } from './c4';

export interface ConnectionInfo {
  id: string;
  sourceId: string;
  targetId: string;
  label?: string;
  technology?: string;
  description?: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
}

export interface ConnectionData {
  targetId: string;
  label?: string;
  technology?: string;
  description?: string;
  sourceHandle?: string | null;
  targetHandle?: string | null;
}

export interface ConnectionEditDialogProps {
  open: boolean;
  connection: ConnectionInfo | null;
  level: TechnologyLevel;
  onClose: () => void;
  onSave: (connection: ConnectionInfo) => void;
}
