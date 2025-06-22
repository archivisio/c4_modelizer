import React, { Suspense } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { lazyRegistry } from '../lazyRegistry';
import { registry } from '../registry';

// Mock the registry
jest.mock('../registry', () => ({
  registry: {
    getComponent: jest.fn(),
  },
}));

const mockRegistry = registry as jest.Mocked<typeof registry>;

// Test components
const TestComponent: React.FC<{ message: string }> = ({ message }) => (
  <div data-testid="test-component">{message}</div>
);

const FallbackComponent: React.FC<{ message: string }> = ({ message }) => (
  <div data-testid="fallback-component">{message}</div>
);

describe('lazyRegistry', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Component Loading', () => {
    it('should load component from registry', async () => {
      mockRegistry.getComponent.mockResolvedValue(TestComponent);

      const LazyComponent = lazyRegistry<{ message: string }>('test-component');

      render(
        <Suspense fallback={<div data-testid="loading">Loading...</div>}>
          <LazyComponent message="Hello from registry" />
        </Suspense>
      );

      // Should show loading first
      expect(screen.getByTestId('loading')).toBeInTheDocument();

      // Wait for component to load
      await waitFor(() => {
        expect(screen.getByTestId('test-component')).toBeInTheDocument();
      });

      expect(screen.getByText('Hello from registry')).toBeInTheDocument();
      expect(mockRegistry.getComponent).toHaveBeenCalledWith('test-component');
    });

    it('should use fallback when component not found in registry', async () => {
      mockRegistry.getComponent.mockResolvedValue(null);

      const LazyComponent = lazyRegistry<{ message: string }>('non-existent', FallbackComponent);

      render(
        <Suspense fallback={<div data-testid="loading">Loading...</div>}>
          <LazyComponent message="Fallback message" />
        </Suspense>
      );

      await waitFor(() => {
        expect(screen.getByTestId('fallback-component')).toBeInTheDocument();
      });

      expect(screen.getByText('Fallback message')).toBeInTheDocument();
    });

    it('should render nothing when no component and no fallback', async () => {
      mockRegistry.getComponent.mockResolvedValue(null);

      const LazyComponent = lazyRegistry<{ message: string }>('non-existent');

      render(
        <Suspense fallback={<div data-testid="loading">Loading...</div>}>
          <LazyComponent message="Should not render" />
        </Suspense>
      );

      await waitFor(() => {
        expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      });

      // Should render nothing (empty)
      expect(screen.queryByText('Should not render')).not.toBeInTheDocument();
    });
  });

  describe('Type Safety', () => {
    it('should handle components with no props', async () => {
      const NoPropsComponent: React.FC = () => (
        <div data-testid="no-props-component">No props needed</div>
      );

      mockRegistry.getComponent.mockResolvedValue(NoPropsComponent);

      const LazyNoPropsComponent = lazyRegistry('no-props-component');

      render(
        <Suspense fallback={<div data-testid="loading">Loading...</div>}>
          <LazyNoPropsComponent />
        </Suspense>
      );

      await waitFor(() => {
        expect(screen.getByTestId('no-props-component')).toBeInTheDocument();
      });

      expect(screen.getByText('No props needed')).toBeInTheDocument();
    });
  });
});