import { TechnologyLevel } from '../types/c4';
import data from './technologies.json';

export interface Technology {
  id: string;
  name: string;
  icon: string;
  color: string;
  levels: TechnologyLevel[];
}

export const technologies = data as Technology[];

export const getTechnologiesByLevel = (level: TechnologyLevel): Technology[] => {
  return technologies.filter(tech => tech.levels.includes(level));
};

export const getTechnologyById = (id: string): Technology | undefined => {
  return technologies.find(tech => tech.id === id);
};
