import { useFlatC4Store } from '@store/flatC4Store';
import { useCallback, useEffect } from 'react';
import { ViewLevel } from '../types/c4';

interface NavigationState {
  level: ViewLevel;
  systemId?: string;
  containerId?: string;
  componentId?: string;
}

export const useFlatNavigation = () => {
  const {
    model,
    setViewLevel,
    setActiveSystem,
    setActiveContainer,
    setActiveComponent
  } = useFlatC4Store();

  const updateActiveStates = useCallback((state: NavigationState) => {
    setActiveSystem(state.systemId);
    setActiveContainer(state.containerId);
    setActiveComponent(state.componentId);
    setViewLevel(state.level);
  }, [setViewLevel, setActiveSystem, setActiveContainer, setActiveComponent]);

  const buildUrl = useCallback((state: NavigationState): string => {
    let url = '#/system';

    if (state.level === 'container' && state.systemId) {
      url = `#/system/${state.systemId}/container`;
    } else if (state.level === 'component' && state.systemId && state.containerId) {
      url = `#/system/${state.systemId}/container/${state.containerId}/component`;
    } else if (state.level === 'code' && state.systemId && state.containerId && state.componentId) {
      url = `#/system/${state.systemId}/container/${state.containerId}/component/${state.componentId}/code`;
    }

    return url;
  }, []);

  const navigateToView = useCallback((viewLevel: ViewLevel, systemId?: string, containerId?: string, componentId?: string) => {
    const state: NavigationState = { level: viewLevel, systemId, containerId, componentId };
    updateActiveStates(state);
    window.history.pushState(state, '', buildUrl(state));
  }, [updateActiveStates, buildUrl]);

  const navigateToSystem = useCallback(() => {
    const state: NavigationState = { level: 'system' };
    updateActiveStates(state);
    window.history.pushState(state, '', buildUrl(state));
  }, [updateActiveStates, buildUrl]);

  const navigateToContainer = useCallback((systemId: string) => {
    if (!systemId) return;

    const state: NavigationState = { level: 'container', systemId };
    updateActiveStates(state);
    window.history.pushState(state, '', buildUrl(state));
  }, [updateActiveStates, buildUrl]);

  const navigateToComponent = useCallback((systemId: string, containerId: string) => {
    if (!systemId || !containerId) return;

    const state: NavigationState = { level: 'component', systemId, containerId };
    updateActiveStates(state);
    window.history.pushState(state, '', buildUrl(state));
  }, [updateActiveStates, buildUrl]);

  const navigateToCode = useCallback((systemId: string, containerId: string, componentId: string) => {
    if (!systemId || !containerId || !componentId) return;

    const state: NavigationState = { level: 'code', systemId, containerId, componentId };
    updateActiveStates(state);
    window.history.pushState(state, '', buildUrl(state));
  }, [updateActiveStates, buildUrl]);

  const syncUrlWithState = useCallback(() => {
    const { viewLevel, activeSystemId, activeContainerId, activeComponentId } = model;
    const hash = window.location.hash;

    if (hash && hash !== '#/' && hash !== '#/system') {
      return;
    }

    const state: NavigationState = {
      level: viewLevel,
      systemId: activeSystemId,
      containerId: activeContainerId,
      componentId: activeComponentId
    };

    window.history.replaceState(state, '', buildUrl(state));
  }, [model, buildUrl]);

  const handlePopState = useCallback((event: PopStateEvent) => {
    const state = event.state as NavigationState | null;

    if (state) {
      updateActiveStates(state);
      return;
    }

    const hash = window.location.hash;
    const parts = hash.split('/').filter(p => p !== '' && p !== '#');

    let newState: NavigationState = { level: 'system' };

    if (parts.length === 0 || (parts.length === 1 && parts[0] === 'system')) {
      // System view
    } else if (parts.length >= 3 && parts[0] === 'system' && parts[2] === 'container') {
      // Container view
      newState = { level: 'container', systemId: parts[1] };
    } else if (parts.length >= 5 && parts[0] === 'system' && parts[2] === 'container' && parts[4] === 'component') {
      // Component view
      newState = { level: 'component', systemId: parts[1], containerId: parts[3] };
    } else if (parts.length >= 7 && parts[0] === 'system' && parts[2] === 'container' && parts[4] === 'component' && parts[6] === 'code') {
      // Code view
      newState = { level: 'code', systemId: parts[1], containerId: parts[3], componentId: parts[5] };
    }

    updateActiveStates(newState);
    window.history.replaceState(newState, '', buildUrl(newState));
  }, [updateActiveStates, buildUrl]);

  useEffect(() => {
    syncUrlWithState();
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [syncUrlWithState, handlePopState]);

  return {
    navigateToSystem,
    navigateToContainer,
    navigateToComponent,
    navigateToCode,
    navigateToView
  };
};
