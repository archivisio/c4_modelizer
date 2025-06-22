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
    mockUseFlatC4Store.getState.mockReturnValue(mockStore);
  });

  describe('exportModel', () => {
    it('should export model with current schema version', () => {
      const testModel: FlatC4Model = {
        systems: [{ id: 'sys1', name: 'System 1', connections: [] }],
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
        systems: [{ id: 'sys1', name: 'System 1', connections: [] }],
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
      const validV1Model: C4Model = {
        schemaVersion: 1,
        systems: [{
          id: 'sys1',
          name: 'System 1',
          connections: [],
          containers: [{
            id: 'cont1',
            name: 'Container 1',
            systemId: 'sys1',
            connections: [],
            components: [{
              id: 'comp1',
              name: 'Component 1',
              containerId: 'cont1',
              connections: [],
              codeElements: [{
                id: 'code1',
                name: 'Code 1',
                componentId: 'comp1',
                connections: [],
              }],
            }],
          }],
        }],
        viewLevel: 'system',
      };

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
      const nestedModel: C4Model = {
        schemaVersion: 1,
        systems: [{
          id: 'sys1',
          name: 'System 1',
          connections: [{ id: 'conn1', from: 'sys1', to: 'sys2', label: 'uses' }],
          containers: [{
            id: 'cont1',
            name: 'Container 1',
            systemId: 'sys1',
            connections: [{ id: 'conn2', from: 'cont1', to: 'cont2', label: 'calls' }],
            components: [{
              id: 'comp1',
              name: 'Component 1',
              containerId: 'cont1',
              connections: [{ id: 'conn3', from: 'comp1', to: 'comp2', label: 'invokes' }],
              codeElements: [{
                id: 'code1',
                name: 'Code 1',
                componentId: 'comp1',
                connections: [{ id: 'conn4', from: 'code1', to: 'code2', label: 'calls' }],
              }],
            }],
          }],
        }],
        viewLevel: 'container',
        activeSystemId: 'sys1',
        activeContainerId: 'cont1',
        activeComponentId: 'comp1',
      } as C4Model;

      const result = convertToFlatModel(nestedModel);

      expect(result).toEqual(expect.objectContaining({
        systems: expect.arrayContaining([
          expect.objectContaining({
            id: 'sys1',
            name: 'System 1',
            connections: [{ id: 'conn1', from: 'sys1', to: 'sys2', label: 'uses' }],
          })
        ]),
        containers: expect.arrayContaining([
          expect.objectContaining({
            id: 'cont1',
            name: 'Container 1',
            systemId: 'sys1',
            connections: [{ id: 'conn2', from: 'cont1', to: 'cont2', label: 'calls' }],
          })
        ]),
        components: expect.arrayContaining([
          expect.objectContaining({
            id: 'comp1',
            name: 'Component 1',
            containerId: 'cont1',
            connections: [{ id: 'conn3', from: 'comp1', to: 'comp2', label: 'invokes' }],
          })
        ]),
        codeElements: expect.arrayContaining([
          expect.objectContaining({
            id: 'code1',
            name: 'Code 1',
            componentId: 'comp1',
            connections: [{ id: 'conn4', from: 'code1', to: 'code2', label: 'calls' }],
          })
        ]),
        viewLevel: 'container',
        activeSystemId: 'sys1',
        activeContainerId: 'cont1',
        activeComponentId: 'comp1',
      }));
    });

    it('should handle model with empty nested arrays', () => {
      const minimalModel: C4Model = {
        schemaVersion: 1,
        systems: [{
          id: 'sys1',
          name: 'System 1',
          connections: [],
        }],
        viewLevel: 'system',
      };

      const result = convertToFlatModel(minimalModel);

      expect(result.systems).toHaveLength(1);
      expect(result.containers).toHaveLength(0);
      expect(result.components).toHaveLength(0);
      expect(result.codeElements).toHaveLength(0);
      expect(result.viewLevel).toBe('system');
    });

    it('should default viewLevel to system if not provided', () => {
      const modelWithoutViewLevel: C4Model = {
        schemaVersion: 1,
        systems: [],
      };

      const result = convertToFlatModel(modelWithoutViewLevel);

      expect(result.viewLevel).toBe('system');
    });

    it('should preserve all connection arrays independently', () => {
      const modelWithConnections: C4Model = {
        schemaVersion: 1,
        systems: [{
          id: 'sys1',
          name: 'System 1',
          connections: [{ id: 'conn1', from: 'sys1', to: 'sys2', label: 'uses' }],
          containers: [{
            id: 'cont1',
            name: 'Container 1',
            systemId: 'sys1',
            connections: [{ id: 'conn2', from: 'cont1', to: 'cont2', label: 'calls' }],
          }],
        }],
        viewLevel: 'system',
      };

      const result = convertToFlatModel(modelWithConnections);

      // Verify connections are copied, not referenced
      expect(result.systems[0].connections).not.toBe(modelWithConnections.systems[0].connections);
      expect(result.containers[0].connections).not.toBe(modelWithConnections.systems[0].containers![0].connections);
      
      // But content should be identical
      expect(result.systems[0].connections).toEqual([{ id: 'conn1', from: 'sys1', to: 'sys2', label: 'uses' }]);
      expect(result.containers[0].connections).toEqual([{ id: 'conn2', from: 'cont1', to: 'cont2', label: 'calls' }]);
    });
  });
});