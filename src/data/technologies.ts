import { TechnologyLevel } from '../types/c4';
import data from './technologies.json';

// Interface pour la définition d'une technologie
export interface Technology {
  id: string;           // Identifiant unique (kebab-case)
  name: string;          // Nom d'affichage
  icon: string;          // Nom de l'icône dans react-devicons
  color: string;         // Couleur associée (code hex)
  levels: TechnologyLevel[]; // Niveaux où cette technologie peut être utilisée
}

// Liste des technologies disponibles
export const technologies = data as Technology[];

// Fonction utilitaire pour filtrer les technologies par niveau
export const getTechnologiesByLevel = (level: TechnologyLevel): Technology[] => {
  return technologies.filter(tech => tech.levels.includes(level));
};

// Fonction pour obtenir une technologie par son ID
export const getTechnologyById = (id: string): Technology | undefined => {
  return technologies.find(tech => tech.id === id);
};
