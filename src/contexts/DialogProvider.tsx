import { ConnectionInfo } from "@interfaces/connection";
import { useFlatC4Store } from "@store/flatC4Store";
import { FinalConnectionState } from "@xyflow/react";
import React, { useState } from "react";
import { DialogContext, DialogContextType } from "./DialogContext";

export const DialogProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { model } = useFlatC4Store();
  const [editId, setEditId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditingContainer, setIsEditingContainer] = useState(false);
  const [connectionDialogOpen, setConnectionDialogOpen] = useState(false);
  const [editingConnection, setEditingConnection] =
    useState<ConnectionInfo | null>(null);
  const [openConfirmReset, setOpenConfirmReset] = useState(false);
  const [notificationError, setNotificationError] = useState<string | null>(null);
  const [pendingConnection, setPendingConnection] = useState<{ event: MouseEvent | TouchEvent, connectionState: FinalConnectionState } | null>(null);

  const editingElement = editId
    ? (model.viewLevel === "code"
        ? model.codeElements.find((c) => c.id === editId)
        : model.viewLevel === "component"
        ? model.components.find((c) => c.id === editId)
        : isEditingContainer
        ? model.containers.find((c) => c.id === editId)
        : model.systems.find((s) => s.id === editId)) || null
    : null;

  const handleOpenResetDialog = () => setOpenConfirmReset(true);
  const handleCloseResetDialog = () => setOpenConfirmReset(false);

  const openEditDialog = (id: string, isContainer = false) => {
    setEditId(id);
    setIsEditingContainer(isContainer);
    setDialogOpen(true);
  };

  const closeEditDialog = () => {
    setDialogOpen(false);
    setEditId(null);
  };

  const openConnectionDialog = (connectionInfo: ConnectionInfo) => {
    setEditingConnection(connectionInfo);
    setConnectionDialogOpen(true);
  };

  const closeConnectionDialog = () => {
    setConnectionDialogOpen(false);
    setEditingConnection(null);
  };

  const contextValue: DialogContextType = {
    editId,
    dialogOpen,
    isEditingContainer,
    connectionDialogOpen,
    editingConnection,
    openConfirmReset,
    notificationError,
    editingElement,
    pendingConnection,
    
    setEditId,
    setDialogOpen,
    setIsEditingContainer,
    setConnectionDialogOpen,
    setEditingConnection,
    setOpenConfirmReset,
    setNotificationError,
    setPendingConnection,

    openEditDialog,
    closeEditDialog,
    openConnectionDialog,
    closeConnectionDialog,
    handleOpenResetDialog,
    handleCloseResetDialog,
  };

  return (
    <DialogContext.Provider value={contextValue}>
      {children}
    </DialogContext.Provider>
  );
};
