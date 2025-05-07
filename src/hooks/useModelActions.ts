import { CodeBlock } from '@interfaces/c4';
import { useC4Store } from '@store/c4Store';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export function useModelActions() {
  const {
    model,
    addSystem,
    addContainer,
    addComponent,
    addCodeElement,
    updateSystem,
    updateContainer,
    updateComponent,
    updateCodeElement,
    removeSystem,
    removeContainer,
    removeComponent,
    removeCodeElement,
    setModel,
  } = useC4Store();

  const { t } = useTranslation();

  const resetStore = useCallback(() => {
    useC4Store.persist.clearStorage();
    setModel({
      viewLevel: 'system',
      systems: [],
      activeSystemId: undefined,
      activeContainerId: undefined,
      activeComponentId: undefined,
    });
  }, [setModel]);

  const AddElement = (properties: Record<string, unknown> = {}) => {
    const randomPosition = {
      x: Math.random() * 400 + 100,
      y: Math.random() * 300 + 100,
    };

    if (model.viewLevel === 'system') {
      addSystem({
        name: t('new_system'),
        description: '',
        position: randomPosition,
        connections: [],
        technology: '',
        url: '',
        type: 'system',
        ...properties,
      });
    } else if (model.viewLevel === 'container' && model.activeSystemId) {
      addContainer(model.activeSystemId, {
        name: t('new_container'),
        description: '',
        position: randomPosition,
        connections: [],
        technology: '',
        url: '',
        type: 'container',
        ...properties,
      });
    } else if (
      model.viewLevel === 'component' &&
      model.activeSystemId &&
      model.activeContainerId
    ) {
      addComponent(model.activeSystemId, model.activeContainerId, {
        name: t('new_component'),
        description: '',
        position: randomPosition,
        connections: [],
        technology: '',
        url: '',
        type: 'component',
        ...properties,
      });
    } else if (
      model.viewLevel === 'code' &&
      model.activeSystemId &&
      model.activeContainerId &&
      model.activeComponentId
    ) {
      addCodeElement(
        model.activeSystemId,
        model.activeContainerId,
        model.activeComponentId,
        {
          name: t('new_code'),
          description: '',
          position: randomPosition,
          codeType: 'class',
          technology: '',
          code: '',
          url: '',
          connections: [],
          type: 'code',
          ...properties,
        }
      );
    }
  }

  const handleAddElement = useCallback(() => {
    AddElement();
  }, [
    model.viewLevel,
    model.activeSystemId,
    model.activeContainerId,
    model.activeComponentId,
    t,
    addSystem,
    addContainer,
    addComponent,
    addCodeElement,
  ]);

  const handleElementSave = useCallback(
    (id: string, data: Record<string, unknown>) => {
      const { name, description, technology, codeType, code, url } = data as {
        name: string;
        description?: string;
        technology?: string;
        codeType?: CodeBlock['codeType'];
        code?: string;
        url?: string;
      };

      if (model.viewLevel === 'code' && model.activeSystemId && model.activeContainerId && model.activeComponentId) {
        updateCodeElement(
          model.activeSystemId,
          model.activeContainerId,
          model.activeComponentId,
          id,
          {
            name,
            description,
            codeType: codeType || 'other',
            technology,
            code,
            url,
          }
        );
      } else if (model.viewLevel === 'component' && model.activeSystemId && model.activeContainerId) {
        updateComponent(model.activeSystemId, model.activeContainerId, id, {
          name,
          description,
          technology,
          url,
        });
      } else if (model.viewLevel === 'container' && model.activeSystemId) {
        updateContainer(model.activeSystemId, id, {
          name,
          description,
          technology,
          url,
        });
      } else if (model.viewLevel === 'system') {
        updateSystem(id, { name, description, technology, url });
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

  const handleNodeDelete = useCallback(
    (id: string) => {
      const { viewLevel, activeSystemId, activeContainerId, activeComponentId } = model;

      if (viewLevel === 'system') {
        removeSystem(id);
      } else if (viewLevel === 'container' && activeSystemId) {
        removeContainer(activeSystemId, id);
      } else if (viewLevel === 'component' && activeSystemId && activeContainerId) {
        removeComponent(activeSystemId, activeContainerId, id);
      } else if (viewLevel === 'code' && activeSystemId && activeContainerId && activeComponentId) {
        removeCodeElement(activeSystemId, activeContainerId, activeComponentId, id);
      }
    },
    [
      model,
      removeSystem,
      removeContainer,
      removeComponent,
      removeCodeElement,
    ]
  );

  return {
    model,
    resetStore,
    AddElement,
    handleAddElement,
    handleElementSave,
    handleNodeDelete,
  };
}
