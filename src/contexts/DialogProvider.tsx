import { ConnectionInfo } from "@interfaces/connection";
import { useC4Store } from "@store/c4Store";
import React, { useState } from "react";
import { DialogContext, DialogContextType } from "./DialogContext";

export const DialogProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { model } = useC4Store();
  const [editId, setEditId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditingContainer, setIsEditingContainer] = useState(false);
  const [connectionDialogOpen, setConnectionDialogOpen] = useState(false);
  const [editingConnection, setEditingConnection] =
    useState<ConnectionInfo | null>(null);
  const [openConfirmReset, setOpenConfirmReset] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const activeSystem = model.systems.find((s) => s.id === model.activeSystemId);
  const activeContainer = activeSystem?.containers?.find(
    (c) => c.id === model.activeContainerId
  );
  const activeComponent = activeContainer?.components?.find(
    (c) => c.id === model.activeComponentId
  );

  const editingElement = editId
    ? (model.viewLevel === "code" && activeComponent?.codeElements
        ? activeComponent.codeElements.find((c) => c.id === editId)
        : model.viewLevel === "component" && activeContainer?.components
        ? activeContainer.components.find((c) => c.id === editId)
        : isEditingContainer && activeSystem?.containers
        ? activeSystem.containers.find((c) => c.id === editId)
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
    importError,
    editingElement,

    setEditId,
    setDialogOpen,
    setIsEditingContainer,
    setConnectionDialogOpen,
    setEditingConnection,
    setOpenConfirmReset,
    setImportError,

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
