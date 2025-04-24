import { C4Model } from '../types/c4';

export const CURRENT_SCHEMA_VERSION = 1;

export function exportModel(model: C4Model): string {
  const modelWithVersion = {
    ...model,
    schemaVersion: CURRENT_SCHEMA_VERSION,
  };
  return JSON.stringify(modelWithVersion, null, 2);
}

export function importModel(json: string): C4Model | null {
  try {
    const obj = JSON.parse(json);
    if (obj && Array.isArray(obj.systems)) {
      if (typeof obj.schemaVersion === "number" && obj.schemaVersion === CURRENT_SCHEMA_VERSION) {
        return obj as C4Model;
      } else {
        return null;
      }
    }
    return null;
  } catch {
    return null;
  }
}
