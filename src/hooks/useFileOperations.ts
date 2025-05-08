import { handleExportModel, handleImportModel } from '@components/FileOperations';
import { useCallback } from 'react';

export function useFileOperations() {
  const handleExport = useCallback(() => {
    handleExportModel();
  }, []);

  const handleImport = useCallback(
    (file: File, setImportError: (error: string | null) => void) => {
      handleImportModel(file, setImportError);
    },
    []
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
