// Mock Blob constructor for FileOperations tests
global.Blob = jest.fn().mockImplementation((chunks: BlobPart[], options?: BlobPropertyBag) => ({
  chunks,
  options,
})) as jest.MockedClass<typeof Blob>;

// Mock URL for FileOperations tests
global.URL = {
  createObjectURL: jest.fn(() => 'blob:mock-url'),
  revokeObjectURL: jest.fn(),
} as unknown as typeof URL;

// Mock FileReader for FileOperations tests
global.FileReader = class MockFileReader {
  onload: ((event: ProgressEvent<FileReader>) => void) | null = null;
  readAsText = jest.fn();
  
  constructor() {
    setTimeout(() => {
      if (this.onload) {
        this.onload({
          target: { result: '{}' }
        } as ProgressEvent<FileReader>);
      }
    }, 0);
  }
} as unknown as typeof FileReader;

// Mock import.meta for manager tests
Object.defineProperty(globalThis, 'import', {
  value: {
    meta: {
      env: {}
    }
  },
  configurable: true
});

// Add TypeScript declarations for custom matchers
/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveTextContent(expected: string): R;
      toHaveAttribute(attr: string, value?: string): R;
      toHaveValue(expected: string): R;
      toHaveDisplayValue(expected: string): R;
    }
  }
}
/* eslint-enable @typescript-eslint/no-namespace */

// Add custom matchers
expect.extend({
  toBeInTheDocument(received) {
    const pass = received && received.nodeType === 1;
    return {
      message: () => `expected element ${pass ? 'not ' : ''}to be in the document`,
      pass: Boolean(pass),
    };
  },
  toHaveTextContent(received, expected) {
    const pass = received && received.textContent === expected;
    return {
      message: () => `expected element to have text content "${expected}" but got "${received?.textContent}"`,
      pass,
    };
  },
  toHaveAttribute(received, attr, value?) {
    const pass = received && received.hasAttribute && received.hasAttribute(attr) && 
      (value === undefined || received.getAttribute(attr) === value);
    return {
      message: () => `expected element ${pass ? 'not ' : ''}to have attribute "${attr}"${value ? ` with value "${value}"` : ''}`,
      pass,
    };
  },
  toHaveValue(received, expected) {
    const pass = received && received.value === expected;
    return {
      message: () => `expected element to have value "${expected}" but got "${received?.value}"`,
      pass,
    };
  },
  toHaveDisplayValue(received, expected) {
    const pass = received && (received.value === expected || received.textContent === expected);
    return {
      message: () => `expected element to have display value "${expected}"`,
      pass,
    };
  }
});