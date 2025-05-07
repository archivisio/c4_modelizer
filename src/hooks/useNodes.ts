import { useDialogs } from '@contexts/DialogContext';
import { useC4Store } from '@store/c4Store';
import { Node } from '@xyflow/react';
import { useCallback, useMemo } from 'react';

export function useNodes() {
  const { model, updateSystem, updateContainer, updateComponent, updateCodeElement } = useC4Store();
  const { openEditDialog } = useDialogs();

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
          type: 'system',
          onEdit: () => openEditDialog(sys.id, false),
        },
      })),
    [model.systems, openEditDialog]
  );

  // Create container nodes if a system is active
  const containerNodes: Node[] = useMemo(() => {
    if (!model.activeSystemId) return [];

    const activeSystem = model.systems.find(s => s.id === model.activeSystemId);
    if (!activeSystem || !activeSystem.containers) return [];

    return activeSystem.containers.map((container) => ({
      id: container.id,
      type: 'container',
      position: container.position,
      data: {
        name: container.name,
        description: container.description,
        technology: container.technology,
        url: container.url,
        type: 'container',
        onEdit: () => openEditDialog(container.id, true),
      },
    }));
  }, [model.systems, model.activeSystemId, openEditDialog]);

  // Create component nodes if a container is active
  const componentNodes: Node[] = useMemo(() => {
    if (!model.activeSystemId || !model.activeContainerId) return [];

    const activeSystem = model.systems.find(s => s.id === model.activeSystemId);
    if (!activeSystem || !activeSystem.containers) return [];

    const activeContainer = activeSystem.containers.find(c => c.id === model.activeContainerId);
    if (!activeContainer || !activeContainer.components) return [];

    return activeContainer.components.map((component) => ({
      id: component.id,
      type: 'component',
      position: component.position,
      data: {
        name: component.name,
        description: component.description,
        technology: component.technology,
        url: component.url,
        type: 'component',
        onEdit: () => openEditDialog(component.id, false),
      },
    }));
  }, [model.systems, model.activeSystemId, model.activeContainerId, openEditDialog]);

  // Create code nodes if a component is active
  const codeNodes: Node[] = useMemo(() => {
    if (!model.activeSystemId || !model.activeContainerId || !model.activeComponentId) return [];

    const activeSystem = model.systems.find(s => s.id === model.activeSystemId);
    if (!activeSystem || !activeSystem.containers) return [];

    const activeContainer = activeSystem.containers.find(c => c.id === model.activeContainerId);
    if (!activeContainer || !activeContainer.components) return [];

    const activeComponent = activeContainer.components.find(c => c.id === model.activeComponentId);
    if (!activeComponent || !activeComponent.codeElements) return [];

    return activeComponent.codeElements.map((codeElement) => ({
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
        type: 'code',
        onEdit: () => openEditDialog(codeElement.id, false),
      },
    }));
  }, [
    model.systems,
    model.activeSystemId,
    model.activeContainerId,
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
      } else if (model.viewLevel === 'container' && model.activeSystemId) {
        updateContainer(model.activeSystemId, id, { position });
      } else if (
        model.viewLevel === 'component' &&
        model.activeSystemId &&
        model.activeContainerId
      ) {
        updateComponent(model.activeSystemId, model.activeContainerId, id, {
          position,
        });
      } else if (
        model.viewLevel === 'code' &&
        model.activeSystemId &&
        model.activeContainerId &&
        model.activeComponentId
      ) {
        updateCodeElement(
          model.activeSystemId,
          model.activeContainerId,
          model.activeComponentId,
          id,
          { position }
        );
      }
    },
    [
      model.viewLevel,
      model.activeSystemId,
      model.activeContainerId,
      model.activeComponentId,
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
