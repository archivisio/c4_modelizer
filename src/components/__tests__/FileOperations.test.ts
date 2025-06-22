import { handleExportModel, handleImportModel } from '../FileOperations';
import { exportModel, importModel } from '@utils/jsonIO';

// Mock the utils
jest.mock('@utils/jsonIO', () => ({
  exportModel: jest.fn(),
  importModel: jest.fn(),
}));

const mockExportModel = exportModel as jest.MockedFunction<typeof exportModel>;
const mockImportModel = importModel as jest.MockedFunction<typeof importModel>;

describe('FileOperations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('handleExportModel', () => {
    it('should export model and trigger download', () => {
      const mockJsonData = '{"test": "data"}';
      mockExportModel.mockReturnValue(mockJsonData);

      const mockAnchor = {
        href: '',
        download: '',
        click: jest.fn(),
      };
      
      jest.spyOn(document, 'createElement').mockReturnValue(mockAnchor as any);

      handleExportModel();

      expect(mockExportModel).toHaveBeenCalledTimes(1);
      expect(global.Blob).toHaveBeenCalledWith([mockJsonData], { type: 'application/json' });
      expect(global.URL.createObjectURL).toHaveBeenCalledWith(expect.objectContaining({
        chunks: [mockJsonData],
        options: { type: 'application/json' }
      }));
      expect(document.createElement).toHaveBeenCalledWith('a');
      expect(mockAnchor.href).toBe('blob:mock-url');
      expect(mockAnchor.download).toBe('c4model.json');
      expect(mockAnchor.click).toHaveBeenCalledTimes(1);
      expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock-url');
    });
  });

  describe('handleImportModel', () => {
    let mockFile: File;
    let mockSetNotificationError: jest.Mock;

    beforeEach(() => {
      mockFile = new File(['{"test": "data"}'], 'test.json', { type: 'application/json' });
      mockSetNotificationError = jest.fn();
    });

    it('should successfully import valid JSON file', async () => {
      mockImportModel.mockReturnValue(true);

      handleImportModel(mockFile, mockSetNotificationError);

      // Wait for the FileReader to process
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(mockImportModel).toHaveBeenCalledWith('{}');
      expect(mockSetNotificationError).toHaveBeenCalledWith(null);
    });

    it('should handle invalid JSON file', async () => {
      mockImportModel.mockReturnValue(false);

      handleImportModel(mockFile, mockSetNotificationError);

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(mockImportModel).toHaveBeenCalledWith('{}');
      expect(mockSetNotificationError).toHaveBeenCalledWith('Invalid JSON file.');
    });
  });
});