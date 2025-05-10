import { handleExportModel, handleImportModel } from '@components/FileOperations';
import { useCallback } from 'react';

export function useFileOperations() {
  const handleExport = useCallback(() => {
    handleExportModel();
  }, []);

  const handleImport = useCallback(
    (file: File, setNotificationError: (error: string | null) => void) => {
      handleImportModel(file, setNotificationError);
    },
    []
  );

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>, setNotificationError: (error: string | null) => void) => {
      const file = e.target.files?.[0];
      if (!file) return;
      handleImport(file, setNotificationError);
    },
    [handleImport]
  );

  return {
    handleExport,
    handleImport,
    handleFileInputChange
  };
}
