import { handleExportModel, handleImportModel } from '@components/FileOperations';
import { useC4Store } from '@store/c4Store';
import { useCallback } from 'react';

export function useFileOperations() {
  const { model, setModel } = useC4Store();

  const handleExport = useCallback(() => {
    handleExportModel(model);
  }, [model]);

  const handleImport = useCallback(
    (file: File, setImportError: (error: string | null) => void) => {
      handleImportModel(file, setModel, setImportError);
    },
    [setModel]
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, setImportError: (error: string | null) => void) => {
      const file = e.target.files?.[0];
      if (!file) return;
      handleImport(file, setImportError);
    },
    [handleImport]
  );

  return {
    handleExport,
    handleImport,
    handleFileInputChange
  };
}
