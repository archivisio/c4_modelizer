import { exportModel, importModel } from "@utils/jsonIO";

export const handleExportModel = (): void => {
  const json = exportModel();
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "c4model.json";
  a.click();
  URL.revokeObjectURL(url);
};

export const handleImportModel = (
  file: File,
  setNotificationError: (error: string | null) => void
): void => {
  const reader = new FileReader();
  reader.onload = (evt) => {
    try {
      const json = evt.target?.result as string;
      const success = importModel(json);
      if (success) {
        setNotificationError(null);
      } else {
        setNotificationError("Invalid JSON file.");
      }
    } catch {
      setNotificationError("Error reading file.");
    }
  };
  reader.readAsText(file);
};
