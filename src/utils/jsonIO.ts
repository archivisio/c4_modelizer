import { C4Model, FlatC4Model, useFlatC4Store } from 'c4-modelizer-sdk/core';

export const CURRENT_SCHEMA_VERSION = 2;

export function exportModel(): string {
  const store = useFlatC4Store.getState();
  const modelWithVersion = {
    ...store.model,
    schemaVersion: CURRENT_SCHEMA_VERSION,
  };
  return JSON.stringify(modelWithVersion, null, 2);
}

export function importModel(json: string): boolean {
  try {
    const obj = JSON.parse(json);
    if (obj && Array.isArray(obj.systems)) {
      const store = useFlatC4Store.getState();

      // Version 2 (Flat structure)
      if (typeof obj.schemaVersion === "number" && obj.schemaVersion === CURRENT_SCHEMA_VERSION &&
        Array.isArray(obj.containers) &&
        Array.isArray(obj.components) &&
        Array.isArray(obj.codeElements)) {
        store.setModel(obj as FlatC4Model);
        return true;
      }
      // Version 1 (Nested structure) - Automatic conversion
      else if (typeof obj.schemaVersion === "number" && obj.schemaVersion === 1) {
        const flatModel = convertToFlatModel(obj as C4Model);
        store.setModel(flatModel);
        return true;
      } else {
        return false;
      }
    }
    return false;
  } catch {
    return false;
  }
}

export const convertToFlatModel = (nestedModel: C4Model): FlatC4Model => {
  const flatModel: FlatC4Model = {
    systems: [],
    containers: [],
    components: [],
    codeElements: [],
    viewLevel: nestedModel.viewLevel || 'system',
    activeSystemId: nestedModel.activeSystemId,
    activeContainerId: nestedModel.activeContainerId,
    activeComponentId: nestedModel.activeComponentId,
  };

  nestedModel.systems.forEach(system => {
    flatModel.systems.push({
      ...system,
      connections: [...system.connections],
    });
    if (system.containers) {
      system.containers.forEach(container => {
        flatModel.containers.push({
          ...container,
          connections: [...container.connections],
        });

        if (container.components) {
          container.components.forEach(component => {
            flatModel.components.push({
              ...component,
              connections: [...component.connections],
            });

            if (component.codeElements) {
              component.codeElements.forEach(codeElement => {
                flatModel.codeElements.push({
                  ...codeElement,
                  connections: [...codeElement.connections],
                });
              });
            }
          });
        }
      });
    }
  });

  return flatModel;
};