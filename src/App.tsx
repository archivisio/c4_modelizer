import { Box } from "@mui/material";
import { ReactFlowProvider } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import React, { useRef } from "react";
import CodeEditDialog from "./components/CodeEditDialog";
import ConfirmDialog from "./components/common/ConfirmDialog";
import ComponentEditDialog from "./components/ComponentEditDialog";
import ConnectionEditDialog from "./components/ConnectionEditDialog";
import ContainerEditDialog from "./components/ContainerEditDialog";
import ErrorNotification from "./components/ErrorNotification";
import FlowCanvas from "./components/FlowCanvas";
import NavBar from "./components/NavBar";
import SystemEditDialog from "./components/SystemEditDialog";
import Toolbar from "./components/Toolbar";
import { useDialogs } from "./contexts/DialogContext";
import { useActiveElements } from "./hooks/useActiveElements";
import { useEdges } from "./hooks/useEdges";
import { useFileOperations } from "./hooks/useFileOperations";
import { useModelActions } from "./hooks/useModelActions";
import { useNavigation } from "./hooks/useNavigation";
import { useNodes } from "./hooks/useNodes";
import "./i18n";
import {
  CodeBlock,
  ComponentBlock,
  ContainerBlock,
  SystemBlock,
} from "./types/c4";

function App() {
  const resetButtonRef = useRef<HTMLButtonElement>(null);
  const { navigateToContainer, navigateToComponent, navigateToCode } =
    useNavigation();
  const {
    dialogOpen,
    isEditingContainer,
    connectionDialogOpen,
    editingConnection,
    openConfirmReset,
    importError,
    editingElement,
    setImportError,
    closeEditDialog,
    closeConnectionDialog,
    handleOpenResetDialog,
    handleCloseResetDialog,
  } = useDialogs();

  const { activeSystem, activeContainer, activeComponent } =
    useActiveElements();

  const { currentNodes, handleNodePositionChange } = useNodes();

  const {
    edges,
    onConnect,
    handleEdgeClick,
    handleConnectionSave,
    handleConnectionDelete,
  } = useEdges();

  const {
    model,
    resetStore,
    handleAddElement,
    handleElementSave,
    handleNodeDelete,
  } = useModelActions();

  const { handleExport, handleFileInputChange } = useFileOperations();

  const handleNodeDoubleClick = (nodeId: string) => {
    if (model.viewLevel === "system") {
      navigateToContainer(nodeId);
    } else if (model.viewLevel === "container" && model.activeSystemId) {
      navigateToComponent(model.activeSystemId, nodeId);
    } else if (
      model.viewLevel === "component" &&
      model.activeSystemId &&
      model.activeContainerId
    ) {
      navigateToCode(model.activeSystemId, model.activeContainerId, nodeId);
    }
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    handleFileInputChange(e, setImportError);
  };

  const handleCloseReset = () => {
    handleCloseResetDialog();
    resetButtonRef.current?.focus();
  };

  return (
    <ReactFlowProvider>
      <Box sx={{ height: "100vh", bgcolor: "#0a1929", color: "#fff" }}>
        <Toolbar
          onAddSystem={handleAddElement}
          onExport={handleExport}
          onImport={handleImport}
          onReset={handleOpenResetDialog}
          model={model}
          ref={resetButtonRef}
        />
        <ConfirmDialog
          open={openConfirmReset}
          title="Reset model ?"
          content="This action will delete your entire diagram and reset the application. Are you sure you want to continue?"
          onCancel={handleCloseReset}
          onConfirm={() => {
            resetStore();
            handleCloseReset();
          }}
          confirmText="Yes, reset"
          cancelText="Cancel"
        />

        <NavBar
          systemName={activeSystem?.name}
          containerName={activeContainer?.name}
          componentName={activeComponent?.name}
        />

        <FlowCanvas
          nodes={currentNodes}
          edges={edges}
          onConnect={onConnect}
          onNodePositionChange={handleNodePositionChange}
          viewLevel={model.viewLevel}
          onNodeDoubleClick={handleNodeDoubleClick}
          onEdgeClick={handleEdgeClick}
        />

        {model.viewLevel === "system" && editingElement && (
          <SystemEditDialog
            open={dialogOpen}
            initialName={editingElement.name}
            initialDescription={editingElement.description || ""}
            initialTechnology={(editingElement as SystemBlock).technology || ""}
            initialUrl={editingElement.url || ""}
            onSave={(name, description, technology, url) => {
              handleElementSave(editingElement.id, {
                name,
                description,
                technology,
                url,
              });
              closeEditDialog();
            }}
            onDelete={() => {
              handleNodeDelete(editingElement.id);
              closeEditDialog();
            }}
            onClose={closeEditDialog}
          />
        )}

        {isEditingContainer && editingElement && (
          <ContainerEditDialog
            open={dialogOpen}
            initialName={editingElement.name}
            initialDescription={editingElement.description || ""}
            initialTechnology={
              (editingElement as ContainerBlock).technology || ""
            }
            initialUrl={editingElement.url || ""}
            onSave={(name, description, technology, url) => {
              handleElementSave(editingElement.id, {
                name,
                description,
                technology,
                url,
              });
              closeEditDialog();
            }}
            onDelete={() => {
              handleNodeDelete(editingElement.id);
              closeEditDialog();
            }}
            onClose={closeEditDialog}
          />
        )}

        {model.viewLevel === "component" && editingElement && (
          <ComponentEditDialog
            open={dialogOpen}
            initialName={editingElement.name}
            initialDescription={editingElement.description || ""}
            initialTechnology={
              (editingElement as ComponentBlock).technology || ""
            }
            initialUrl={editingElement.url || ""}
            onSave={(name, description, technology, url) => {
              handleElementSave(editingElement.id, {
                name,
                description,
                technology,
                url,
              });
              closeEditDialog();
            }}
            onDelete={() => {
              handleNodeDelete(editingElement.id);
              closeEditDialog();
            }}
            onClose={closeEditDialog}
          />
        )}

        {model.viewLevel === "code" && editingElement && (
          <CodeEditDialog
            open={dialogOpen}
            initialName={editingElement.name}
            initialDescription={editingElement.description || ""}
            initialCodeType={(editingElement as CodeBlock).codeType || "class"}
            initialLanguage={(editingElement as CodeBlock).language || ""}
            initialCode={(editingElement as CodeBlock).code || ""}
            initialUrl={editingElement.url || ""}
            onSave={(name, description, codeType, language, code, url) => {
              handleElementSave(editingElement.id, {
                name,
                description,
                codeType,
                language,
                code,
                url,
              });
              closeEditDialog();
            }}
            onDelete={() => {
              handleNodeDelete(editingElement.id);
              closeEditDialog();
            }}
            onClose={closeEditDialog}
          />
        )}

        <ErrorNotification message={importError} />

        {connectionDialogOpen && (
          <ConnectionEditDialog
            open={connectionDialogOpen}
            connection={editingConnection}
            onClose={closeConnectionDialog}
            onSave={handleConnectionSave}
            onDelete={handleConnectionDelete}
          />
        )}
      </Box>
    </ReactFlowProvider>
  );
}

export default App;
