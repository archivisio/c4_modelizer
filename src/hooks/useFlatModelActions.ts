import { CodeBlock } from '../types/c4';
import { useFlatC4Store } from '@store/flatC4Store';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

export function useFlatModelActions() {
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
  } = useFlatC4Store();

  const { t } = useTranslation();

  const resetStore = useCallback(() => {
    useFlatC4Store.persist.clearStorage();
    setModel({
      viewLevel: 'system',
      systems: [],
      containers: [],
      components: [],
      codeElements: [],
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
      model.activeContainerId
    ) {
      const container = model.containers.find(c => c.id === model.activeContainerId);
      if (container) {
        addComponent(model.activeContainerId, {
          name: t('new_component'),
          description: '',
          position: randomPosition,
          connections: [],
          technology: '',
          url: '',
          type: 'component',
          ...properties,
        });
      }
    } else if (
      model.viewLevel === 'code' &&
      model.activeComponentId
    ) {
      addCodeElement(
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
    AddElement
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

      if (model.viewLevel === 'code') {
        updateCodeElement(
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
      } else if (model.viewLevel === 'component') {
        updateComponent(id, {
          name,
          description,
          technology,
          url,
        });
      } else if (model.viewLevel === 'container') {
        updateContainer(id, {
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
      updateSystem,
      updateContainer,
      updateComponent,
      updateCodeElement,
    ]
  );

  const handleNodeDelete = useCallback(
    (id: string) => {
      const { viewLevel } = model;

      if (viewLevel === 'system') {
        removeSystem(id);
      } else if (viewLevel === 'container') {
        removeContainer(id);
      } else if (viewLevel === 'component') {
        removeComponent(id);
      } else if (viewLevel === 'code') {
        removeCodeElement(id);
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
