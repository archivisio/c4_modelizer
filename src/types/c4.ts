// Types de base pour le modèle C4 (niveaux Système et Container)

// Position commune à tous les éléments
export type Position = { x: number; y: number };

// Type de base pour tous les éléments
export interface BaseBlock {
  id: string;
  name: string;
  description?: string;
  position: Position;
}

// Niveau Système
export interface SystemBlock extends BaseBlock {
  connections: string[]; // Liste des ids des systèmes connectés
  containers?: ContainerBlock[]; // Containers à l'intérieur du système
}

// Niveau Container
export interface ContainerBlock extends BaseBlock {
  systemId: string; // Système parent
  connections: string[]; // Liste des ids des containers connectés
}

// Modèle C4 complet
export type C4Model = {
  systems: SystemBlock[];
  activeSystemId?: string; // Pour la navigation, système actuellement affiché
  viewLevel: 'system' | 'container'; // Niveau de vue actuel
};
