import { useC4Store } from '@store/c4Store';
import { useMemo } from 'react';

export function useActiveElements() {
  const { model } = useC4Store();

  const activeSystem = useMemo(
    () =>
      model.activeSystemId
        ? model.systems.find((s) => s.id === model.activeSystemId)
        : undefined,
    [model.activeSystemId, model.systems]
  );

  const activeContainer = useMemo(() => {
    if (!activeSystem || !model.activeContainerId || !activeSystem.containers)
      return undefined;
    return activeSystem.containers.find(
      (c) => c.id === model.activeContainerId
    );
  }, [activeSystem, model.activeContainerId]);

  const activeComponent = useMemo(() => {
    if (
      !activeContainer ||
      !model.activeComponentId ||
      !activeContainer.components
    )
      return undefined;
    return activeContainer.components.find(
      (c) => c.id === model.activeComponentId
    );
  }, [activeContainer, model.activeComponentId]);

  return {
    activeSystem,
    activeContainer,
    activeComponent,
    viewLevel: model.viewLevel
  };
}
