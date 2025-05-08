import { useDialogs } from '@contexts/DialogContext';
import { useFlatC4Store, useFilteredEntities } from '@store/flatC4Store';
import { Node } from '@xyflow/react';
import { useCallback, useMemo } from 'react';

export function useFlatNodes() {
  const { model, updateSystem, updateContainer, updateComponent, updateCodeElement } = useFlatC4Store();
  const { openEditDialog } = useDialogs();
  const { containers, components, codeElements } = useFilteredEntities();

  // Create system nodes from the model
  const systemNodes: Node[] = useMemo(
    () =>
      model.systems.map((sys) => ({
        id: sys.id,
        type: 'system',
        position: sys.position,
        data: {
          name: sys.name,
          description: sys.description,
          technology: sys.technology,
          url: sys.url,
          type: sys.type,
          original: sys.original,
          onEdit: () => openEditDialog(sys.id, false),
        },
      })),
    [model.systems, openEditDialog]
  );

  // Create container nodes if a system is active
  const containerNodes: Node[] = useMemo(() => {
    if (!model.activeSystemId) return [];
    
    return containers.map((container) => ({
      id: container.id,
      type: 'container',
      position: container.position,
      data: {
        name: container.name,
        description: container.description,
        technology: container.technology,
        url: container.url,
        type: container.type,
        original: container.original,
        onEdit: () => openEditDialog(container.id, true),
      },
    }));
  }, [containers, model.activeSystemId, openEditDialog]);

  // Create component nodes if a container is active
  const componentNodes: Node[] = useMemo(() => {
    if (!model.activeContainerId) return [];
    
    return components.map((component) => ({
      id: component.id,
      type: 'component',
      position: component.position,
      data: {
        name: component.name,
        description: component.description,
        technology: component.technology,
        url: component.url,
        type: component.type,
        original: component.original,
        onEdit: () => openEditDialog(component.id, false),
      },
    }));
  }, [components, model.activeContainerId, openEditDialog]);

  // Create code nodes if a component is active
  const codeNodes: Node[] = useMemo(() => {
    if (!model.activeComponentId) return [];
    
    return codeElements.map((codeElement) => ({
      id: codeElement.id,
      type: 'code',
      position: codeElement.position,
      data: {
        name: codeElement.name,
        description: codeElement.description,
        codeType: codeElement.codeType,
        technology: codeElement.technology,
        code: codeElement.code,
        url: codeElement.url,
        type: codeElement.type,
        original: codeElement.original,
        onEdit: () => openEditDialog(codeElement.id, false),
      },
    }));
  }, [
    codeElements,
    model.activeComponentId,
    openEditDialog
  ]);

  // Get the current nodes based on the view level
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

  // Handle node position changes
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
    handleNodePositionChange
  };
}
