import { C4Model } from '../types/c4';

export function exportModel(model: C4Model): string {
  return JSON.stringify(model, null, 2);
}

export function importModel(json: string): C4Model | null {
  try {
    const obj = JSON.parse(json);
    if (obj && Array.isArray(obj.systems)) {
      return obj as C4Model;
    }
    return null;
  } catch {
    return null;
  }
}
