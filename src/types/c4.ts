// Types de base pour le modèle C4 (niveau Système)

export type SystemBlock = {
  id: string;
  name: string;
  description?: string;
  position: { x: number; y: number };
  connections: string[]; // Liste des ids des systèmes connectés
};

export type C4Model = {
  systems: SystemBlock[];
};
