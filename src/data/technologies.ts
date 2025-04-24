import { TechnologyLevel } from '../types/c4';

// Interface pour la définition d'une technologie
export interface Technology {
  id: string;           // Identifiant unique (kebab-case)
  name: string;          // Nom d'affichage
  icon: string;          // Nom de l'icône dans react-devicons
  color: string;         // Couleur associée (code hex)
  levels: TechnologyLevel[]; // Niveaux où cette technologie peut être utilisée
}

// Liste des technologies disponibles
export const technologies: Technology[] = [
  // Backend languages
  {
    id: 'java',
    name: 'Java',
    icon: 'java',
    color: '#f89820',
    levels: ['container', 'component', 'code', 'connection']
  },
  {
    id: 'spring-boot',
    name: 'Spring Boot',
    icon: 'spring',
    color: '#6db33f',
    levels: ['container', 'component']
  },
  {
    id: 'node-js',
    name: 'Node.js',
    icon: 'nodejs',
    color: '#339933',
    levels: ['container', 'component', 'connection']
  },
  {
    id: 'ruby',
    name: 'Ruby',
    icon: 'ruby',
    color: '#CC342D',
    levels: ['container', 'component', 'code', 'connection']
  },
  {
    id: 'rails',
    name: 'Ruby on Rails',
    icon: 'rails',
    color: '#CC0000',
    levels: ['container', 'component']
  },
  {
    id: 'python',
    name: 'Python',
    icon: 'python',
    color: '#3776AB',
    levels: ['container', 'component', 'code', 'connection']
  },
  {
    id: 'django',
    name: 'Django',
    icon: 'django',
    color: '#092E20',
    levels: ['container', 'component']
  },
  {
    id: 'php',
    name: 'PHP',
    icon: 'php',
    color: '#777BB4',
    levels: ['container', 'component', 'code', 'connection']
  },
  {
    id: 'csharp',
    name: 'C#',
    icon: 'csharp',
    color: '#239120',
    levels: ['container', 'component', 'code', 'connection']
  },
  {
    id: 'dotnet',
    name: '.NET',
    icon: 'dot-net',
    color: '#512BD4',
    levels: ['container', 'component', 'connection']
  },
  {
    id: 'go',
    name: 'Go',
    icon: 'go',
    color: '#00ADD8',
    levels: ['container', 'component', 'code', 'connection']
  },
  
  // Frontend frameworks
  {
    id: 'react',
    name: 'React',
    icon: 'react',
    color: '#61DAFB',
    levels: ['container', 'component']
  },
  {
    id: 'angular',
    name: 'Angular',
    icon: 'angularjs',
    color: '#DD0031',
    levels: ['container', 'component']
  },
  {
    id: 'vue',
    name: 'Vue.js',
    icon: 'vuejs',
    color: '#4FC08D',
    levels: ['container', 'component']
  },
  {
    id: 'svelte',
    name: 'Svelte',
    icon: 'svelte',
    color: '#FF3E00',
    levels: ['container', 'component']
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    icon: 'javascript',
    color: '#F7DF1E',
    levels: ['container', 'component', 'code', 'connection']
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    icon: 'typescript',
    color: '#3178C6',
    levels: ['container', 'component', 'code']
  },
  
  // Databases
  {
    id: 'postgresql',
    name: 'PostgreSQL',
    icon: 'postgresql',
    color: '#4169E1',
    levels: ['container', 'connection']
  },
  {
    id: 'mysql',
    name: 'MySQL',
    icon: 'mysql',
    color: '#4479A1',
    levels: ['container', 'connection']
  },
  {
    id: 'mongodb',
    name: 'MongoDB',
    icon: 'mongodb',
    color: '#47A248',
    levels: ['container', 'connection']
  },
  {
    id: 'redis',
    name: 'Redis',
    icon: 'redis',
    color: '#DC382D',
    levels: ['container', 'connection']
  },
  
  // Infrastructure
  {
    id: 'docker',
    name: 'Docker',
    icon: 'docker',
    color: '#2496ED',
    levels: ['container']
  },
  {
    id: 'kubernetes',
    name: 'Kubernetes',
    icon: 'kubernetes',
    color: '#326CE5',
    levels: ['container']
  },
  {
    id: 'nginx',
    name: 'NGINX',
    icon: 'nginx',
    color: '#009639',
    levels: ['container']
  },
  {
    id: 'graphql',
    name: 'GraphQL',
    icon: 'graphql',
    color: '#E10098',
    levels: ['container', 'component', 'connection']
  },
  {
    id: 'aws',
    name: 'AWS',
    icon: 'amazonwebservices',
    color: '#232F3E',
    levels: ['container']
  },
  
  // Testing frameworks
  {
    id: 'jest',
    name: 'Jest',
    icon: 'jest',
    color: '#C21325',
    levels: ['component']
  },
  {
    id: 'selenium',
    name: 'Selenium',
    icon: 'selenium',
    color: '#43B02A',
    levels: ['component']
  },
  {
    id: 'rspec',
    name: 'RSpec',
    icon: 'ruby',
    color: '#CC342D',
    levels: ['component']
  },
  
  // Others
  {
    id: 'other',
    name: 'Other',
    icon: 'code',
    color: '#546E7A',
    levels: ['container', 'component', 'code', 'connection']
  }
];

// Fonction utilitaire pour filtrer les technologies par niveau
export const getTechnologiesByLevel = (level: TechnologyLevel): Technology[] => {
  return technologies.filter(tech => tech.levels.includes(level));
};

// Fonction pour obtenir une technologie par son ID
export const getTechnologyById = (id: string): Technology | undefined => {
  return technologies.find(tech => tech.id === id);
};
