import type { FlatC4Model } from "@archivisio/c4-modelizer-sdk";
import { useFlatC4Store } from "@archivisio/c4-modelizer-sdk";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { useDialogs } from "../DialogContext";
import { DialogProvider } from "../DialogProvider";

// Mock the store
jest.mock("@archivisio/c4-modelizer-sdk", () => ({
  useFlatC4Store: jest.fn(),
}));

const mockUseFlatC4Store = useFlatC4Store as jest.MockedFunction<typeof useFlatC4Store>;

// Test component to access context
const TestComponent: React.FC = () => {
  const {
    editId,
    dialogOpen,
    editingElement,
    openEditDialog,
    closeEditDialog,
  } = useDialogs();

  return (
    <div>
      <div data-testid="edit-id">{editId || "null"}</div>
      <div data-testid="dialog-open">{dialogOpen.toString()}</div>
      <div data-testid="editing-element">{editingElement?.id || "null"}</div>
      <button onClick={() => openEditDialog("test-id")}>Open Dialog</button>
      <button onClick={closeEditDialog}>Close Dialog</button>
    </div>
  );
};

describe("DialogProvider", () => {
  let mockModel: FlatC4Model;

  beforeEach(() => {
    mockModel = {
      systems: [{ id: "sys1", name: "System 1", connections: [], type: "system", position: { x: 0, y: 0 } }],
      containers: [
        { id: "cont1", name: "Container 1", systemId: "sys1", connections: [], type: "container", position: { x: 0, y: 0 } },
      ],
      components: [
        {
          id: "comp1",
          name: "Component 1",
          containerId: "cont1",
          systemId: "sys1",
          connections: [],
          type: "component",
          position: { x: 0, y: 0 },
        },
      ],
      codeElements: [
        { 
          id: "code1", 
          name: "Code 1", 
          componentId: "comp1", 
          containerId: "cont1",
          systemId: "sys1",
          connections: [], 
          codeType: "class",
          type: "code",
          position: { x: 0, y: 0 }
        },
      ],
      viewLevel: "system",
      activeSystemId: "sys1",
      activeContainerId: "cont1",
      activeComponentId: "comp1",
    };

    (mockUseFlatC4Store as jest.MockedFunction<typeof useFlatC4Store>).mockReturnValue({ model: mockModel });
  });

  describe("Basic Functionality", () => {
    it("should provide default values", () => {
      render(
        <DialogProvider>
          <TestComponent />
        </DialogProvider>
      );

      expect(screen.getByTestId("edit-id")).toHaveTextContent("null");
      expect(screen.getByTestId("dialog-open")).toHaveTextContent("false");
      expect(screen.getByTestId("editing-element")).toHaveTextContent("null");
    });

    it("should open and close dialogs", () => {
      render(
        <DialogProvider>
          <TestComponent />
        </DialogProvider>
      );

      fireEvent.click(screen.getByText("Open Dialog"));
      expect(screen.getByTestId("edit-id")).toHaveTextContent("test-id");
      expect(screen.getByTestId("dialog-open")).toHaveTextContent("true");

      fireEvent.click(screen.getByText("Close Dialog"));
      expect(screen.getByTestId("edit-id")).toHaveTextContent("null");
      expect(screen.getByTestId("dialog-open")).toHaveTextContent("false");
    });

    it("should handle element finding based on view level", () => {
      mockModel.viewLevel = "system";
      (mockUseFlatC4Store as jest.MockedFunction<typeof useFlatC4Store>).mockReturnValue({ model: mockModel });

      const TestElementComponent: React.FC = () => {
        const { openEditDialog, editingElement } = useDialogs();
        return (
          <div>
            <div data-testid="editing-element">
              {editingElement?.id || "null"}
            </div>
            <button onClick={() => openEditDialog("sys1")}>
              Open System Dialog
            </button>
          </div>
        );
      };

      render(
        <DialogProvider>
          <TestElementComponent />
        </DialogProvider>
      );

      fireEvent.click(screen.getByText("Open System Dialog"));
      expect(screen.getByTestId("editing-element")).toHaveTextContent("sys1");
    });
  });

  describe("Context Error", () => {
    it("should throw error when useDialogs is used outside provider", () => {
      const TestComponentOutsideProvider: React.FC = () => {
        useDialogs();
        return <div>Should not render</div>;
      };

      const originalError = console.error;
      console.error = jest.fn();

      expect(() => {
        render(<TestComponentOutsideProvider />);
      }).toThrow("useDialogs must be used within a DialogProvider");

      console.error = originalError;
    });
  });
});
