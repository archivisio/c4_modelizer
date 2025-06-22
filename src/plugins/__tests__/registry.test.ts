import { PluginRegistry, C4Plugin } from '../registry';
import * as React from 'react';

// Mock React
const mockComponent = () => React.createElement('div', { testId: 'mock-component' });
const mockAsyncComponent = () => Promise.resolve(mockComponent);

describe('PluginRegistry', () => {
  let registry: PluginRegistry;

  beforeEach(() => {
    registry = new PluginRegistry();
  });

  describe('Component Registration', () => {
    it('should register and retrieve components', async () => {
      const componentId = 'test-component';
      const resolver = () => Promise.resolve(mockComponent);

      registry.registerComponent(componentId, resolver);
      const retrievedComponent = await registry.getComponent(componentId);

      expect(retrievedComponent).toBe(mockComponent);
    });

    it('should return null for non-existent component', async () => {
      const result = await registry.getComponent('non-existent');
      expect(result).toBeNull();
    });

    it('should handle multiple components with different IDs', async () => {
      const component1 = () => React.createElement('div', { testId: 'component1' });
      const component2 = () => React.createElement('div', { testId: 'component2' });
      
      registry.registerComponent('comp1', () => Promise.resolve(component1));
      registry.registerComponent('comp2', () => Promise.resolve(component2));

      const result1 = await registry.getComponent('comp1');
      const result2 = await registry.getComponent('comp2');

      expect(result1).toBe(component1);
      expect(result2).toBe(component2);
    });

    it('should overwrite component if registered with same ID', async () => {
      const component1 = () => React.createElement('div', { testId: 'component1' });
      const component2 = () => React.createElement('div', { testId: 'component2' });
      
      registry.registerComponent('comp', () => Promise.resolve(component1));
      registry.registerComponent('comp', () => Promise.resolve(component2));

      const result = await registry.getComponent('comp');
      expect(result).toBe(component2);
    });

    it('should handle async component resolvers', async () => {
      const asyncResolver = async () => {
        await new Promise(resolve => setTimeout(resolve, 10));
        return mockComponent;
      };

      registry.registerComponent('async-comp', asyncResolver);
      const result = await registry.getComponent('async-comp');

      expect(result).toBe(mockComponent);
    });
  });

  describe('Portal Registration', () => {
    it('should register and retrieve portals', () => {
      const portalId = 'test-portal';
      const portalNode = React.createElement('div', { testId: 'portal-content' });

      registry.registerPortal(portalId, portalNode);
      const retrievedPortal = registry.getPortal(portalId);

      expect(retrievedPortal).toBe(portalNode);
    });

    it('should return undefined for non-existent portal', () => {
      const result = registry.getPortal('non-existent');
      expect(result).toBeUndefined();
    });

    it('should handle multiple portals', () => {
      const portal1 = React.createElement('div', { testId: 'portal1' });
      const portal2 = React.createElement('div', { testId: 'portal2' });

      registry.registerPortal('portal1', portal1);
      registry.registerPortal('portal2', portal2);

      expect(registry.getPortal('portal1')).toBe(portal1);
      expect(registry.getPortal('portal2')).toBe(portal2);
    });

    it('should overwrite portal if registered with same ID', () => {
      const portal1 = React.createElement('div', { testId: 'portal1' });
      const portal2 = React.createElement('div', { testId: 'portal2' });

      registry.registerPortal('portal', portal1);
      registry.registerPortal('portal', portal2);

      expect(registry.getPortal('portal')).toBe(portal2);
    });
  });

  describe('Method Registration', () => {
    it('should register and retrieve methods', () => {
      const methodId = 'test-method';
      const method = jest.fn();

      registry.registerMethod(methodId, method);
      const retrievedMethod = registry.getMethod(methodId);

      expect(retrievedMethod).toBe(method);
    });

    it('should return undefined for non-existent method', () => {
      const result = registry.getMethod('non-existent');
      expect(result).toBeUndefined();
    });

    it('should handle multiple methods', () => {
      const method1 = jest.fn();
      const method2 = jest.fn();

      registry.registerMethod('method1', method1);
      registry.registerMethod('method2', method2);

      expect(registry.getMethod('method1')).toBe(method1);
      expect(registry.getMethod('method2')).toBe(method2);
    });

    it('should overwrite method if registered with same ID', () => {
      const method1 = jest.fn();
      const method2 = jest.fn();

      registry.registerMethod('method', method1);
      registry.registerMethod('method', method2);

      expect(registry.getMethod('method')).toBe(method2);
    });

    it('should allow calling registered methods', () => {
      const method = jest.fn();
      registry.registerMethod('callable-method', method);

      const retrievedMethod = registry.getMethod('callable-method');
      retrievedMethod?.();

      expect(method).toHaveBeenCalledTimes(1);
    });
  });

  describe('Mixed Registration', () => {
    it('should handle registration of all types simultaneously', async () => {
      const component = mockComponent;
      const portal = React.createElement('div', { testId: 'portal' });
      const method = jest.fn();

      registry.registerComponent('comp', () => Promise.resolve(component));
      registry.registerPortal('portal', portal);
      registry.registerMethod('method', method);

      const retrievedComponent = await registry.getComponent('comp');
      const retrievedPortal = registry.getPortal('portal');
      const retrievedMethod = registry.getMethod('method');

      expect(retrievedComponent).toBe(component);
      expect(retrievedPortal).toBe(portal);
      expect(retrievedMethod).toBe(method);
    });

    it('should not interfere between different types with same ID', async () => {
      const sameId = 'same-id';
      const component = mockComponent;
      const portal = React.createElement('div', { testId: 'portal' });
      const method = jest.fn();

      registry.registerComponent(sameId, () => Promise.resolve(component));
      registry.registerPortal(sameId, portal);
      registry.registerMethod(sameId, method);

      const retrievedComponent = await registry.getComponent(sameId);
      const retrievedPortal = registry.getPortal(sameId);
      const retrievedMethod = registry.getMethod(sameId);

      expect(retrievedComponent).toBe(component);
      expect(retrievedPortal).toBe(portal);
      expect(retrievedMethod).toBe(method);
    });
  });

  describe('C4Plugin Interface', () => {
    it('should define the correct interface structure', () => {
      const mockPlugin: C4Plugin = {
        name: 'test-plugin',
        version: '1.0.0',
        setup: jest.fn(),
      };

      expect(mockPlugin.name).toBe('test-plugin');
      expect(mockPlugin.version).toBe('1.0.0');
      expect(typeof mockPlugin.setup).toBe('function');
    });

    it('should call setup method with registry instance', () => {
      const setupMock = jest.fn();
      const plugin: C4Plugin = {
        name: 'test-plugin',
        version: '1.0.0',
        setup: setupMock,
      };

      plugin.setup(registry);

      expect(setupMock).toHaveBeenCalledTimes(1);
      expect(setupMock).toHaveBeenCalledWith(registry);
    });
  });
});