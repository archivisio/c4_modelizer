import { useFlatC4Store } from '@/store/flatC4Store';
import { BaseBlock } from '@/types/c4';
import { useMemo } from 'react';

export function useClonePath(item: BaseBlock): string | null {
  const { model } = useFlatC4Store();

  return useMemo(() => {
    if (!item.original) {
      return null;
    }

    const { id: originalId, type } = item.original;

    let path = '';

    switch (type) {
      case 'system': {
        return null;
      }
      case 'container': {
        const originalElement = model.containers.find(c => c.id === originalId);
        if (originalElement) {
          const system = model.systems.find(s => s.id === originalElement.systemId);
          path = system ? `${system.name} / ${originalElement.name}` : originalElement.name;
        }
        break;
      }
      case 'component': {
        const originalElement = model.components.find(c => c.id === originalId);
        if (originalElement) {
          const container = model.containers.find(c => c.id === originalElement.containerId);
          const system = container ? model.systems.find(s => s.id === container.systemId) : null;

          if (system && container) {
            path = `${system.name} / ${container.name} / ${originalElement.name}`;
          } else if (container) {
            path = `${container.name} / ${originalElement.name}`;
          } else {
            path = originalElement.name;
          }
        }
        break;
      }
      case 'code': {
        const originalElement = model.codeElements.find(c => c.id === originalId);
        if (originalElement) {
          const component = model.components.find(c => c.id === originalElement.componentId);
          const container = component
            ? model.containers.find(c => c.id === component.containerId)
            : null;
          const system = container
            ? model.systems.find(s => s.id === container.systemId)
            : null;

          if (system && container && component) {
            path = `${system.name} / ${container.name} / ${component.name} / ${originalElement.name}`;
          } else if (container && component) {
            path = `${container.name} / ${component.name} / ${originalElement.name}`;
          } else if (component) {
            path = `${component.name} / ${originalElement.name}`;
          } else {
            path = originalElement.name;
          }
        }
        break;
      }
    }

    return path || null;
  }, [item, model]);
}
