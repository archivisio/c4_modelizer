// Types de base pour le modèle C4 (tous les niveaux : Système, Container, Composant et Code)

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
  codeElements?: CodeBlock[]; // Éléments de code dans ce composant
}

// Niveau Code (classes, méthodes, etc.)
export interface CodeBlock extends BaseBlock {
  componentId: string; // Composant parent
  containerId: string; // Container parent (pour faciliter la navigation)
  systemId: string; // Système parent (pour faciliter la navigation)
  codeType: 'class' | 'function' | 'interface' | 'variable' | 'other'; // Type d'élément de code
  language?: string; // Langage de programmation
  code?: string; // Extrait de code (optionnel)
  connections: string[]; // Liste des ids des éléments de code connectés
}

// Modèle C4 complet
export type C4Model = {
  systems: SystemBlock[];
  activeSystemId?: string; // Pour la navigation, système actuellement affiché
  activeContainerId?: string; // Pour la navigation, container actuellement affiché
  activeComponentId?: string; // Pour la navigation, composant actuellement affiché
  viewLevel: 'system' | 'container' | 'component' | 'code'; // Niveau de vue actuel
};
