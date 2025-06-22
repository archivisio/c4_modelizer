import { exportModel, importModel, convertToFlatModel, CURRENT_SCHEMA_VERSION } from '../jsonIO';
import { useFlatC4Store } from '@archivisio/c4-modelizer-sdk';
import type { C4Model, FlatC4Model } from '@archivisio/c4-modelizer-sdk';

// Mock the store
jest.mock('@archivisio/c4-modelizer-sdk', () => ({
  useFlatC4Store: {
    getState: jest.fn(),
  },
}));

const mockUseFlatC4Store = useFlatC4Store as jest.Mocked<typeof useFlatC4Store>;

describe('jsonIO', () => {
  let mockStore: {
    model: FlatC4Model;
    setModel: jest.Mock;
  };

  beforeEach(() => {
    mockStore = {
      model: {
        systems: [],
        containers: [],
        components: [],
        codeElements: [],
        viewLevel: 'system',
        activeSystemId: undefined,
        activeContainerId: undefined,
        activeComponentId: undefined,
      },
      setModel: jest.fn(),
    };
    mockUseFlatC4Store.getState.mockReturnValue(mockStore as unknown as ReturnType<typeof useFlatC4Store.getState>);
  });

  describe('exportModel', () => {
    it('should export model with current schema version', () => {
      const testModel: FlatC4Model = {
        systems: [{ id: 'sys1', name: 'System 1', connections: [], type: 'system', position: { x: 0, y: 0 } }],
        containers: [],
        components: [],
        codeElements: [],
        viewLevel: 'system',
        activeSystemId: 'sys1',
        activeContainerId: undefined,
        activeComponentId: undefined,
      };
      mockStore.model = testModel;

      const result = exportModel();
      const parsed = JSON.parse(result);

      expect(parsed.schemaVersion).toBe(CURRENT_SCHEMA_VERSION);
      expect(parsed.systems).toEqual(testModel.systems);
      expect(parsed.viewLevel).toBe('system');
      expect(parsed.activeSystemId).toBe('sys1');
    });

    it('should format JSON with proper indentation', () => {
      const result = exportModel();
      expect(result).toContain('\n');
      expect(result).toContain('  ');
    });
  });

  describe('importModel', () => {
    it('should import valid v2 flat model', () => {
      const validV2Model = {
        schemaVersion: 2,
        systems: [{ id: 'sys1', name: 'System 1', connections: [], type: 'system', position: { x: 0, y: 0 } }],
        containers: [],
        components: [],
        codeElements: [],
        viewLevel: 'system',
      };

      const result = importModel(JSON.stringify(validV2Model));

      expect(result).toBe(true);
      expect(mockStore.setModel).toHaveBeenCalledWith(validV2Model);
    });

    it('should import and convert valid v1 nested model', () => {
      const validV1Model = {
        schemaVersion: 1,
        systems: [{
          id: 'sys1',
          name: 'System 1',
          type: 'system',
          position: { x: 0, y: 0 },
          connections: [],
          containers: [{
            id: 'cont1',
            name: 'Container 1',
            systemId: 'sys1',
            type: 'container',
            position: { x: 0, y: 0 },
            connections: [],
            components: [{
              id: 'comp1',
              name: 'Component 1',
              containerId: 'cont1',
              systemId: 'sys1',
              type: 'component',
              position: { x: 0, y: 0 },
              connections: [],
              codeElements: [{
                id: 'code1',
                name: 'Code 1',
                componentId: 'comp1',
                containerId: 'cont1',
                systemId: 'sys1',
                connections: [],
                codeType: 'class',
                type: 'code',
                position: { x: 0, y: 0 },
              }],
            }],
          }],
        }],
        viewLevel: 'system',
      } as unknown as C4Model;

      const result = importModel(JSON.stringify(validV1Model));

      expect(result).toBe(true);
      expect(mockStore.setModel).toHaveBeenCalledWith(
        expect.objectContaining({
          systems: expect.arrayContaining([
            expect.objectContaining({ id: 'sys1', name: 'System 1' })
          ]),
          containers: expect.arrayContaining([
            expect.objectContaining({ id: 'cont1', name: 'Container 1' })
          ]),
          components: expect.arrayContaining([
            expect.objectContaining({ id: 'comp1', name: 'Component 1' })
          ]),
          codeElements: expect.arrayContaining([
            expect.objectContaining({ id: 'code1', name: 'Code 1' })
          ]),
        })
      );
    });

    it('should reject invalid JSON', () => {
      const result = importModel('invalid json');
      expect(result).toBe(false);
      expect(mockStore.setModel).not.toHaveBeenCalled();
    });

    it('should reject object without systems array', () => {
      const invalidModel = { schemaVersion: 2, containers: [] };
      const result = importModel(JSON.stringify(invalidModel));
      expect(result).toBe(false);
      expect(mockStore.setModel).not.toHaveBeenCalled();
    });

    it('should reject v2 model with missing required arrays', () => {
      const incompleteV2Model = {
        schemaVersion: 2,
        systems: [],
        containers: [],
        // Missing components and codeElements
      };
      const result = importModel(JSON.stringify(incompleteV2Model));
      expect(result).toBe(false);
      expect(mockStore.setModel).not.toHaveBeenCalled();
    });

    it('should reject unsupported schema version', () => {
      const unsupportedModel = {
        schemaVersion: 99,
        systems: [],
        containers: [],
        components: [],
        codeElements: [],
      };
      const result = importModel(JSON.stringify(unsupportedModel));
      expect(result).toBe(false);
      expect(mockStore.setModel).not.toHaveBeenCalled();
    });
  });

  describe('convertToFlatModel', () => {
    it('should convert nested model to flat structure', () => {
      const nestedModel = {
        schemaVersion: 1,
        systems: [{
          id: 'sys1',
          name: 'System 1',
          type: 'system',
          position: { x: 0, y: 0 },
          connections: [{ from: 'sys1', to: 'sys2', label: 'uses' }],
          containers: [{
            id: 'cont1',
            name: 'Container 1',
            systemId: 'sys1',
            type: 'container',
            position: { x: 0, y: 0 },
            connections: [{ from: 'cont1', to: 'cont2', label: 'calls' }],
            components: [{
              id: 'comp1',
              name: 'Component 1',
              containerId: 'cont1',
              systemId: 'sys1',
              type: 'component',
              position: { x: 0, y: 0 },
              connections: [{ from: 'comp1', to: 'comp2', label: 'invokes' }],
              codeElements: [{
                id: 'code1',
                name: 'Code 1',
                componentId: 'comp1',
                containerId: 'cont1',
                systemId: 'sys1',
                codeType: 'class',
                type: 'code',
                position: { x: 0, y: 0 },
                connections: [{ from: 'code1', to: 'code2', label: 'calls' }],
              }],
            }],
          }],
        }],
        viewLevel: 'container',
        activeSystemId: 'sys1',
        activeContainerId: 'cont1',
        activeComponentId: 'comp1',
      } as unknown as C4Model;

      const result = convertToFlatModel(nestedModel);

      // Check basic structure
      expect(result.viewLevel).toBe('container');
      expect(result.activeSystemId).toBe('sys1');
      expect(result.activeContainerId).toBe('cont1');
      expect(result.activeComponentId).toBe('comp1');
      
      // Check that arrays are created and contain expected elements
      expect(result.systems).toHaveLength(1);
      expect(result.containers).toHaveLength(1);
      expect(result.components).toHaveLength(1);
      expect(result.codeElements).toHaveLength(1);
      
      // Check system
      expect(result.systems[0]).toEqual(expect.objectContaining({
        id: 'sys1',
        name: 'System 1',
        connections: [{ from: 'sys1', to: 'sys2', label: 'uses' }],
      }));
      
      // Check container
      expect(result.containers[0]).toEqual(expect.objectContaining({
        id: 'cont1',
        name: 'Container 1',
        systemId: 'sys1',
        connections: [{ from: 'cont1', to: 'cont2', label: 'calls' }],
      }));
      
      // Check component
      expect(result.components[0]).toEqual(expect.objectContaining({
        id: 'comp1',
        name: 'Component 1',
        containerId: 'cont1',
        connections: [{ from: 'comp1', to: 'comp2', label: 'invokes' }],
      }));
      
      // Check code element
      expect(result.codeElements[0]).toEqual(expect.objectContaining({
        id: 'code1',
        name: 'Code 1',
        componentId: 'comp1',
        connections: [{ from: 'code1', to: 'code2', label: 'calls' }],
      }));
    });

    it('should handle model with empty nested arrays', () => {
      const minimalModel = {
        schemaVersion: 1,
        systems: [{
          id: 'sys1',
          name: 'System 1',
          type: 'system',
          position: { x: 0, y: 0 },
          connections: [],
        }],
        viewLevel: 'system',
      } as unknown as C4Model;

      const result = convertToFlatModel(minimalModel);

      expect(result.systems).toHaveLength(1);
      expect(result.containers).toHaveLength(0);
      expect(result.components).toHaveLength(0);
      expect(result.codeElements).toHaveLength(0);
      expect(result.viewLevel).toBe('system');
    });

    it('should default viewLevel to system if not provided', () => {
      const modelWithoutViewLevel = {
        schemaVersion: 1,
        systems: [],
      } as unknown as C4Model;

      const result = convertToFlatModel(modelWithoutViewLevel);

      expect(result.viewLevel).toBe('system');
    });

    it('should preserve all connection arrays independently', () => {
      const modelWithConnections = {
        schemaVersion: 1,
        systems: [{
          id: 'sys1',
          name: 'System 1',
          connections: [{ from: 'sys1', to: 'sys2', label: 'uses' }],
          containers: [{
            id: 'cont1',
            name: 'Container 1',
            systemId: 'sys1',
            connections: [{ from: 'cont1', to: 'cont2', label: 'calls' }],
          }],
        }],
        viewLevel: 'system',
      } as unknown as C4Model;

      const result = convertToFlatModel(modelWithConnections);

      // Verify connections are copied, not referenced
      expect(result.systems[0].connections).not.toBe(modelWithConnections.systems[0].connections);
      expect(result.containers[0].connections).not.toBe(modelWithConnections.systems[0].containers![0].connections);
      
      // But content should be identical
      expect(result.systems[0].connections).toEqual([{ from: 'sys1', to: 'sys2', label: 'uses' }]);
      expect(result.containers[0].connections).toEqual([{ from: 'cont1', to: 'cont2', label: 'calls' }]);
    });
  });
});