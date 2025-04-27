import { TechnologyLevel } from '../types/c4';
import cloud from './technologies/cloud.json';
import codes from './technologies/codes.json';
import databases from './technologies/databases.json';
import devops from './technologies/devops.json';
import frameworks from './technologies/frameworks.json';
import languages from './technologies/languages.json';
import messageBrokers from './technologies/messageBrokers.json';
import monitoring from './technologies/monitoring.json';
import saas from './technologies/saas.json';
import security from './technologies/security.json';
import systems from './technologies/systems.json';
import protocols from './technologies/protocols.json';

export interface Technology {
  id: string;
  name: string;
  icon: string;
  color: string;
  levels: TechnologyLevel[];
}

export const technologies = [...cloud, ...codes, ...databases, ...devops, ...frameworks, ...languages, ...messageBrokers, ...monitoring, ...saas, ...security, ...systems, ...protocols] as Technology[];

export const getTechnologiesByLevel = (level: TechnologyLevel): Technology[] => {
  return technologies.filter(tech => tech.levels.includes(level)).sort((a, b) => a.name.localeCompare(b.name));
};

export const getTechnologyById = (id: string): Technology | undefined => {
  return technologies.find(tech => tech.id === id);
};
