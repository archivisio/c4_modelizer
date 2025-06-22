import { handleExportModel, handleImportModel } from '@components/FileOperations';
import { act, renderHook } from '@testing-library/react';
import { useFileOperations } from '../useFileOperations';

// Mock the FileOperations module
jest.mock('@components/FileOperations', () => ({
  handleExportModel: jest.fn(),
  handleImportModel: jest.fn(),
}));

const mockHandleExportModel = handleExportModel as jest.MockedFunction<typeof handleExportModel>;
const mockHandleImportModel = handleImportModel as jest.MockedFunction<typeof handleImportModel>;

describe('useFileOperations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Hook Return Values', () => {
    it('should return stable function references', () => {
      const { result, rerender } = renderHook(() => useFileOperations());

      const firstResult = result.current;

      rerender();

      const secondResult = result.current;

      // Functions should be the same reference due to useCallback
      expect(firstResult.handleExport).toBe(secondResult.handleExport);
      expect(firstResult.handleImport).toBe(secondResult.handleImport);
      expect(firstResult.handleFileInputChange).toBe(secondResult.handleFileInputChange);
    });

    it('should return expected function names', () => {
      const { result } = renderHook(() => useFileOperations());

      expect(typeof result.current.handleExport).toBe('function');
      expect(typeof result.current.handleImport).toBe('function');
      expect(typeof result.current.handleFileInputChange).toBe('function');
    });
  });

  describe('handleExport', () => {
    it('should call handleExportModel when executed', () => {
      const { result } = renderHook(() => useFileOperations());

      act(() => {
        result.current.handleExport();
      });

      expect(mockHandleExportModel).toHaveBeenCalledTimes(1);
      expect(mockHandleExportModel).toHaveBeenCalledWith();
    });

    it('should handle multiple export calls', () => {
      const { result } = renderHook(() => useFileOperations());

      act(() => {
        result.current.handleExport();
        result.current.handleExport();
        result.current.handleExport();
      });

      expect(mockHandleExportModel).toHaveBeenCalledTimes(3);
    });
  });

  describe('handleImport', () => {
    it('should call handleImportModel with correct parameters', () => {
      const { result } = renderHook(() => useFileOperations());

      const mockFile = new File(['{"test": "data"}'], 'test.json', { type: 'application/json' });
      const mockSetNotificationError = jest.fn();

      act(() => {
        result.current.handleImport(mockFile, mockSetNotificationError);
      });

      expect(mockHandleImportModel).toHaveBeenCalledTimes(1);
      expect(mockHandleImportModel).toHaveBeenCalledWith(mockFile, mockSetNotificationError);
    });

    it('should handle different file types', () => {
      const { result } = renderHook(() => useFileOperations());

      const jsonFile = new File(['{"systems": []}'], 'model.json', { type: 'application/json' });
      const textFile = new File(['{"systems": []}'], 'model.txt', { type: 'text/plain' });
      const mockSetError = jest.fn();

      act(() => {
        result.current.handleImport(jsonFile, mockSetError);
      });

      expect(mockHandleImportModel).toHaveBeenCalledWith(jsonFile, mockSetError);

      act(() => {
        result.current.handleImport(textFile, mockSetError);
      });

      expect(mockHandleImportModel).toHaveBeenCalledWith(textFile, mockSetError);
      expect(mockHandleImportModel).toHaveBeenCalledTimes(2);
    });
  });

  describe('handleFileInputChange', () => {
    let mockSetNotificationError: jest.Mock;

    beforeEach(() => {
      mockSetNotificationError = jest.fn();
    });

    it('should handle file input change with valid file', () => {
      const { result } = renderHook(() => useFileOperations());

      const mockFile = new File(['{"test": "data"}'], 'test.json', { type: 'application/json' });
      const mockEvent = {
        target: {
          files: [mockFile],
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      act(() => {
        result.current.handleFileInputChange(mockEvent, mockSetNotificationError);
      });

      expect(mockHandleImportModel).toHaveBeenCalledTimes(1);
      expect(mockHandleImportModel).toHaveBeenCalledWith(mockFile, mockSetNotificationError);
    });

    it('should handle file input change with no files', () => {
      const { result } = renderHook(() => useFileOperations());

      const mockEvent = {
        target: {
          files: null,
        },
      } as React.ChangeEvent<HTMLInputElement>;

      act(() => {
        result.current.handleFileInputChange(mockEvent, mockSetNotificationError);
      });

      expect(mockHandleImportModel).not.toHaveBeenCalled();
    });

    it('should handle multiple files by using only the first one', () => {
      const { result } = renderHook(() => useFileOperations());

      const file1 = new File(['{"test": "data1"}'], 'test1.json', { type: 'application/json' });
      const file2 = new File(['{"test": "data2"}'], 'test2.json', { type: 'application/json' });

      const mockEvent = {
        target: {
          files: [file1, file2],
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>;

      act(() => {
        result.current.handleFileInputChange(mockEvent, mockSetNotificationError);
      });

      expect(mockHandleImportModel).toHaveBeenCalledTimes(1);
      expect(mockHandleImportModel).toHaveBeenCalledWith(file1, mockSetNotificationError);
    });
  });

  describe('Integration Scenarios', () => {
    it('should work in export-import workflow', () => {
      const { result } = renderHook(() => useFileOperations());

      // Export first
      act(() => {
        result.current.handleExport();
      });

      expect(mockHandleExportModel).toHaveBeenCalledTimes(1);

      // Then import
      const mockFile = new File(['{}'], 'exported.json');
      const mockSetError = jest.fn();

      act(() => {
        result.current.handleImport(mockFile, mockSetError);
      });

      expect(mockHandleImportModel).toHaveBeenCalledWith(mockFile, mockSetError);
    });

    it('should handle rapid successive operations', () => {
      const { result } = renderHook(() => useFileOperations());

      const mockFile1 = new File(['{}'], 'file1.json');
      const mockFile2 = new File(['{}'], 'file2.json');
      const mockSetError = jest.fn();

      act(() => {
        result.current.handleExport();
        result.current.handleImport(mockFile1, mockSetError);
        result.current.handleExport();
        result.current.handleImport(mockFile2, mockSetError);
      });

      expect(mockHandleExportModel).toHaveBeenCalledTimes(2);
      expect(mockHandleImportModel).toHaveBeenCalledTimes(2);
      expect(mockHandleImportModel).toHaveBeenNthCalledWith(1, mockFile1, mockSetError);
      expect(mockHandleImportModel).toHaveBeenNthCalledWith(2, mockFile2, mockSetError);
    });
  });
});