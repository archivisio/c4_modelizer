import { C4Model } from '../types/c4';
import { exportModel, importModel } from '../utils/jsonIO';

export const handleExportModel = (model: C4Model): void => {
  const json = exportModel(model);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'c4model.json';
  a.click();
  URL.revokeObjectURL(url);
};

export const handleImportModel = (
  file: File,
  setModel: (model: C4Model) => void,
  setImportError: (error: string | null) => void
): void => {
  const reader = new FileReader();
  reader.onload = (evt) => {
    try {
      const json = evt.target?.result as string;
      const imported = importModel(json);
      if (imported) {
        setModel(imported);
        setImportError(null);
      } else {
        setImportError('Fichier JSON invalide.');
      }
    } catch {
      setImportError('Erreur lors de la lecture du fichier.');
    }
  };
  reader.readAsText(file);
};
