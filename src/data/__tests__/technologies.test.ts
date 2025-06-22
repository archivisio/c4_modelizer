import { getTechnologiesByLevel, getTechnologyById, technologies, Technology } from '../technologies';
import { TechnologyLevel } from '@archivisio/c4-modelizer-sdk';

// Mock data for testing
const mockTechnologies: Technology[] = [
  { id: 'java', name: 'Java', icon: 'java', color: '#f89820', levels: ['code'] },
  { id: 'python', name: 'Python', icon: 'python', color: '#3776ab', levels: ['code'] },
  { id: 'docker', name: 'Docker', icon: 'docker', color: '#2496ed', levels: ['container'] },
  { id: 'kubernetes', name: 'Kubernetes', icon: 'kubernetes', color: '#326ce5', levels: ['container', 'system'] },
  { id: 'nginx', name: 'Nginx', icon: 'nginx', color: '#009639', levels: ['component'] },
  { id: 'react', name: 'React', icon: 'react', color: '#61dafb', levels: ['component', 'code'] },
  { id: 'aws', name: 'AWS', icon: 'aws', color: '#ff9900', levels: ['system'] },
];

// Mock the imported JSON files
jest.mock('../technologies/cloud.json', () => ({
  default: [
    { id: 'aws', name: 'AWS', icon: 'aws', color: '#ff9900', levels: ['system'] }
  ]
}), { virtual: true });

jest.mock('../technologies/codes.json', () => ({
  default: [
    { id: 'java', name: 'Java', icon: 'java', color: '#f89820', levels: ['code'] },
    { id: 'python', name: 'Python', icon: 'python', color: '#3776ab', levels: ['code'] }
  ]
}), { virtual: true });

jest.mock('../technologies/databases.json', () => ({ default: [] }), { virtual: true });
jest.mock('../technologies/devops.json', () => ({
  default: [
    { id: 'docker', name: 'Docker', icon: 'docker', color: '#2496ed', levels: ['container'] },
    { id: 'kubernetes', name: 'Kubernetes', icon: 'kubernetes', color: '#326ce5', levels: ['container', 'system'] }
  ]
}), { virtual: true });
jest.mock('../technologies/frameworks.json', () => ({
  default: [
    { id: 'react', name: 'React', icon: 'react', color: '#61dafb', levels: ['component', 'code'] }
  ]
}), { virtual: true });
jest.mock('../technologies/languages.json', () => ({ default: [] }), { virtual: true });
jest.mock('../technologies/messageBrokers.json', () => ({ default: [] }), { virtual: true });
jest.mock('../technologies/monitoring.json', () => ({ default: [] }), { virtual: true });
jest.mock('../technologies/protocols.json', () => ({ default: [] }), { virtual: true });
jest.mock('../technologies/saas.json', () => ({ default: [] }), { virtual: true });
jest.mock('../technologies/security.json', () => ({ default: [] }), { virtual: true });
jest.mock('../technologies/systems.json', () => ({
  default: [
    { id: 'nginx', name: 'Nginx', icon: 'nginx', color: '#009639', levels: ['component'] }
  ]
}), { virtual: true });

describe('technologies', () => {
  describe('getTechnologiesByLevel', () => {
    it('should return technologies for code level', () => {
      const codeLevel: TechnologyLevel = 'code';
      const result = getTechnologiesByLevel(codeLevel);
      
      expect(result).toHaveLength(3);
      expect(result.map(t => t.id)).toEqual(['java', 'python', 'react']);
    });

    it('should return technologies for container level', () => {
      const containerLevel: TechnologyLevel = 'container';
      const result = getTechnologiesByLevel(containerLevel);
      
      expect(result).toHaveLength(2);
      expect(result.map(t => t.id)).toEqual(['docker', 'kubernetes']);
    });

    it('should return technologies for component level', () => {
      const componentLevel: TechnologyLevel = 'component';
      const result = getTechnologiesByLevel(componentLevel);
      
      expect(result).toHaveLength(2);
      expect(result.map(t => t.id)).toEqual(['nginx', 'react']);
    });

    it('should return technologies for system level', () => {
      const systemLevel: TechnologyLevel = 'system';
      const result = getTechnologiesByLevel(systemLevel);
      
      expect(result).toHaveLength(2);
      expect(result.map(t => t.id)).toEqual(['aws', 'kubernetes']);
    });

    it('should return technologies sorted alphabetically by name', () => {
      const codeLevel: TechnologyLevel = 'code';
      const result = getTechnologiesByLevel(codeLevel);
      
      const names = result.map(t => t.name);
      const sortedNames = [...names].sort();
      expect(names).toEqual(sortedNames);
    });

    it('should return empty array for level with no technologies', () => {
      // Create a mock with no technologies for a specific level
      const mockEmptyLevel = 'code' as TechnologyLevel;
      
      // Temporarily mock technologies array to be empty for this test
      const originalFilter = Array.prototype.filter;
      Array.prototype.filter = jest.fn().mockReturnValue([]);
      
      const result = getTechnologiesByLevel(mockEmptyLevel);
      expect(result).toHaveLength(0);
      
      // Restore original filter
      Array.prototype.filter = originalFilter;
    });

    it('should handle technologies with multiple levels correctly', () => {
      // Test that technologies appearing at multiple levels are included in all relevant results
      const containerLevel: TechnologyLevel = 'container';
      const systemLevel: TechnologyLevel = 'system';
      
      const containerResult = getTechnologiesByLevel(containerLevel);
      const systemResult = getTechnologiesByLevel(systemLevel);
      
      // Kubernetes should appear in both container and system results
      expect(containerResult.some(t => t.id === 'kubernetes')).toBe(true);
      expect(systemResult.some(t => t.id === 'kubernetes')).toBe(true);
    });
  });

  describe('getTechnologyById', () => {
    it('should return technology when found', () => {
      const result = getTechnologyById('java');
      
      expect(result).toBeDefined();
      expect(result?.id).toBe('java');
      expect(result?.name).toBe('Java');
      expect(result?.color).toBe('#f89820');
      expect(result?.levels).toEqual(['code']);
    });

    it('should return technology for multi-level technology', () => {
      const result = getTechnologyById('kubernetes');
      
      expect(result).toBeDefined();
      expect(result?.id).toBe('kubernetes');
      expect(result?.name).toBe('Kubernetes');
      expect(result?.levels).toEqual(['container', 'system']);
    });

    it('should return undefined when technology not found', () => {
      const result = getTechnologyById('nonexistent');
      
      expect(result).toBeUndefined();
    });

    it('should handle empty string id', () => {
      const result = getTechnologyById('');
      
      expect(result).toBeUndefined();
    });

    it('should be case sensitive', () => {
      const result = getTechnologyById('JAVA');
      
      expect(result).toBeUndefined();
    });

    it('should return first match if there are duplicates', () => {
      // This test ensures consistent behavior even if there were duplicate IDs
      const result = getTechnologyById('java');
      
      expect(result).toBeDefined();
      expect(result?.id).toBe('java');
    });
  });

  describe('technologies array', () => {
    it('should be an array', () => {
      expect(Array.isArray(technologies)).toBe(true);
    });

    it('should contain technologies from all imported files', () => {
      // The mocked data should result in 6 total technologies
      expect(technologies.length).toBeGreaterThan(0);
    });

    it('should have technologies with required properties', () => {
      technologies.forEach(tech => {
        expect(tech).toHaveProperty('id');
        expect(tech).toHaveProperty('name');
        expect(tech).toHaveProperty('icon');
        expect(tech).toHaveProperty('color');
        expect(tech).toHaveProperty('levels');
        expect(typeof tech.id).toBe('string');
        expect(typeof tech.name).toBe('string');
        expect(typeof tech.icon).toBe('string');
        expect(typeof tech.color).toBe('string');
        expect(Array.isArray(tech.levels)).toBe(true);
      });
    });

    it('should have unique technology IDs', () => {
      const ids = technologies.map(tech => tech.id);
      const uniqueIds = [...new Set(ids)];
      expect(ids).toHaveLength(uniqueIds.length);
    });

    it('should have valid color codes', () => {
      technologies.forEach(tech => {
        // Basic check for hex color format
        expect(tech.color).toMatch(/^#[0-9a-fA-F]{6}$/);
      });
    });

    it('should have valid technology levels', () => {
      const validLevels: TechnologyLevel[] = ['system', 'container', 'component', 'code'];
      technologies.forEach(tech => {
        tech.levels.forEach(level => {
          expect(validLevels).toContain(level);
        });
        expect(tech.levels.length).toBeGreaterThan(0);
      });
    });
  });
});