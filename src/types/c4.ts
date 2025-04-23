// Types de base pour le modèle C4 (niveaux Système, Container et Composant)

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
  components?: ComponentBlock[]; // Composants à l'intérieur du container
}

// Niveau Composant
export interface ComponentBlock extends BaseBlock {
  containerId: string; // Container parent
  systemId: string; // Système parent (pour faciliter la navigation)
  connections: string[]; // Liste des ids des composants connectés
  technology?: string; // Technologie utilisée pour ce composant
}

// Modèle C4 complet
export type C4Model = {
  systems: SystemBlock[];
  activeSystemId?: string; // Pour la navigation, système actuellement affiché
  activeContainerId?: string; // Pour la navigation, container actuellement affiché
  viewLevel: 'system' | 'container' | 'component'; // Niveau de vue actuel
};
