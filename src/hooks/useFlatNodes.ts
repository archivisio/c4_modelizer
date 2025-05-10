import { useDialogs } from '@contexts/DialogContext';
import { useFilteredEntities, useFlatC4Store } from '@store/flatC4Store';
import { Node } from '@xyflow/react';
import { useCallback, useMemo } from 'react';

export function useFlatNodes() {
  const { model, updateSystem, updateContainer, updateComponent, updateCodeElement } = useFlatC4Store();
  const { openEditDialog } = useDialogs();
  const { containers, components, codeElements } = useFilteredEntities();

  const systemNodes: Node[] = useMemo(
    () =>
      model.systems.map((sys) => ({
        id: sys.id,
        type: 'system',
        position: sys.position,
        data: {
          ...sys,
          onEdit: () => openEditDialog(sys.id, false),
        },
      })),
    [model.systems, openEditDialog]
  );

  const containerNodes: Node[] = useMemo(() => {
    if (!model.activeSystemId) return [];

    return containers.map((container) => ({
      id: container.id,
      type: 'container',
      position: container.position,
      data: {
        ...container,
        onEdit: () => openEditDialog(container.id, true),
      },
    }));
  }, [containers, model.activeSystemId, openEditDialog]);

  const componentNodes: Node[] = useMemo(() => {
    if (!model.activeContainerId) return [];

    return components.map((component) => ({
      id: component.id,
      type: 'component',
      position: component.position,
      data: {
        ...component,
        onEdit: () => openEditDialog(component.id, false),
      },
    }));
  }, [components, model.activeContainerId, openEditDialog]);

  const codeNodes: Node[] = useMemo(() => {
    if (!model.activeComponentId) return [];

    return codeElements.map((codeElement) => ({
      id: codeElement.id,
      type: 'code',
      position: codeElement.position,
      data: {
        ...codeElement,
        onEdit: () => openEditDialog(codeElement.id, false),
      },
    }));
  }, [
    codeElements,
    model.activeComponentId,
    openEditDialog
  ]);

  const currentNodes = useMemo(() => {
    switch (model.viewLevel) {
      case 'system':
        return systemNodes;
      case 'container':
        return containerNodes;
      case 'component':
        return componentNodes;
      case 'code':
        return codeNodes;
      default:
        return [];
    }
  }, [model.viewLevel, systemNodes, containerNodes, componentNodes, codeNodes]);

  const getNodeById = useCallback(
    (id: string) => {
      return [...systemNodes, ...containerNodes, ...componentNodes, ...codeNodes].find((node) => node.id === id);
    },
    [systemNodes, containerNodes, componentNodes, codeNodes]
  );

  const handleNodePositionChange = useCallback(
    (id: string, position: { x: number; y: number }) => {
      if (model.viewLevel === 'system') {
        updateSystem(id, { position });
      } else if (model.viewLevel === 'container') {
        updateContainer(id, { position });
      } else if (model.viewLevel === 'component') {
        updateComponent(id, { position });
      } else if (model.viewLevel === 'code') {
        updateCodeElement(id, { position });
      }
    },
    [
      model.viewLevel,
      updateSystem,
      updateContainer,
      updateComponent,
      updateCodeElement,
    ]
  );

  return {
    systemNodes,
    containerNodes,
    componentNodes,
    codeNodes,
    currentNodes,
    handleNodePositionChange,
    getNodeById
  };
}
