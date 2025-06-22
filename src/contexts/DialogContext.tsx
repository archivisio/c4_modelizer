import type {
  CodeBlock,
  ComponentBlock,
  ContainerBlock,
  SystemBlock,
  ConnectionInfo,
} from "c4-modelizer-sdk/core";
import { FinalConnectionState } from "@xyflow/react";
import { createContext, useContext } from "react";

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
  notificationError: string | null;
  editingElement: EditingElement;
  pendingConnection: { event: MouseEvent | TouchEvent, connectionState: FinalConnectionState } | null;

  setEditId: (id: string | null) => void;
  setDialogOpen: (open: boolean) => void;
  setIsEditingContainer: (isContainer: boolean) => void;
  setConnectionDialogOpen: (open: boolean) => void;
  setEditingConnection: (connection: ConnectionInfo | null) => void;
  setOpenConfirmReset: (open: boolean) => void;
  setNotificationError: (error: string | null) => void;
  setPendingConnection: (connection: { event: MouseEvent | TouchEvent, connectionState: FinalConnectionState } | null) => void;

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
