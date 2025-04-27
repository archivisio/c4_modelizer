import { createContext, useContext } from "react";
import {
  CodeBlock,
  ComponentBlock,
  ContainerBlock,
  SystemBlock,
} from "../types/c4";
import { ConnectionInfo } from "../types/connection";

export type EditingElement =
  | SystemBlock
  | ContainerBlock
  | ComponentBlock
  | CodeBlock
  | null;

export interface DialogContextType {
  editId: string | null;
  dialogOpen: boolean;
  isEditingContainer: boolean;
  connectionDialogOpen: boolean;
  editingConnection: ConnectionInfo | null;
  openConfirmReset: boolean;
  importError: string | null;
  editingElement: EditingElement;

  setEditId: (id: string | null) => void;
  setDialogOpen: (open: boolean) => void;
  setIsEditingContainer: (isContainer: boolean) => void;
  setConnectionDialogOpen: (open: boolean) => void;
  setEditingConnection: (connection: ConnectionInfo | null) => void;
  setOpenConfirmReset: (open: boolean) => void;
  setImportError: (error: string | null) => void;

  openEditDialog: (id: string, isContainer?: boolean) => void;
  closeEditDialog: () => void;
  openConnectionDialog: (connectionInfo: ConnectionInfo) => void;
  closeConnectionDialog: () => void;
  handleOpenResetDialog: () => void;
  handleCloseResetDialog: () => void;
}

export const DialogContext = createContext<DialogContextType | undefined>(
  undefined
);

export const useDialogs = (): DialogContextType => {
  const context = useContext(DialogContext);
  if (context === undefined) {
    throw new Error("useDialogs must be used within a DialogProvider");
  }
  return context;
};
