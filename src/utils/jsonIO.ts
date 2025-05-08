import { FlatC4Model } from '@interfaces/flatC4Model';
import { useFlatC4Store } from '@store/flatC4Store';

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
    if (obj &&
      Array.isArray(obj.systems) &&
      Array.isArray(obj.containers) &&
      Array.isArray(obj.components) &&
      Array.isArray(obj.codeElements)) {
      if (typeof obj.schemaVersion === "number" && obj.schemaVersion === CURRENT_SCHEMA_VERSION) {
        const store = useFlatC4Store.getState();
        store.setModel(obj as FlatC4Model);
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
