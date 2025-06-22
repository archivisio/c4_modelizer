import { renderHook } from '@testing-library/react';
import { RefObject, createRef } from 'react';
import useOnClickOutside from '../useOnClickOutside';

describe('useOnClickOutside', () => {
  let mockHandler: jest.Mock;
  let mockElement: HTMLDivElement;
  let mockRef: RefObject<HTMLDivElement>;

  beforeEach(() => {
    mockHandler = jest.fn();
    mockElement = document.createElement('div');
    mockRef = { current: mockElement };
    
    // Add the element to the document body for contains() to work properly
    document.body.appendChild(mockElement);
  });

  afterEach(() => {
    jest.clearAllMocks();
    // Clean up the DOM
    document.body.removeChild(mockElement);
  });

  describe('Mouse Events', () => {
    it('should call handler when clicking outside the element', () => {
      renderHook(() => useOnClickOutside(mockRef, mockHandler));

      const outsideElement = document.createElement('div');
      document.body.appendChild(outsideElement);

      const mouseEvent = new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(mouseEvent, 'target', {
        value: outsideElement,
        enumerable: true,
      });

      document.dispatchEvent(mouseEvent);

      expect(mockHandler).toHaveBeenCalledTimes(1);
      expect(mockHandler).toHaveBeenCalledWith(mouseEvent);

      document.body.removeChild(outsideElement);
    });

    it('should not call handler when clicking inside the element', () => {
      renderHook(() => useOnClickOutside(mockRef, mockHandler));

      const mouseEvent = new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(mouseEvent, 'target', {
        value: mockElement,
        enumerable: true,
      });

      document.dispatchEvent(mouseEvent);

      expect(mockHandler).not.toHaveBeenCalled();
    });

    it('should not call handler when clicking on a child element', () => {
      const childElement = document.createElement('span');
      mockElement.appendChild(childElement);

      renderHook(() => useOnClickOutside(mockRef, mockHandler));

      const mouseEvent = new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(mouseEvent, 'target', {
        value: childElement,
        enumerable: true,
      });

      document.dispatchEvent(mouseEvent);

      expect(mockHandler).not.toHaveBeenCalled();
    });

    it('should handle null target gracefully', () => {
      renderHook(() => useOnClickOutside(mockRef, mockHandler));

      const mouseEvent = new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(mouseEvent, 'target', {
        value: null,
        enumerable: true,
      });

      document.dispatchEvent(mouseEvent);

      expect(mockHandler).toHaveBeenCalledTimes(1);
      expect(mockHandler).toHaveBeenCalledWith(mouseEvent);
    });
  });

  describe('Touch Events', () => {
    it('should call handler when touching outside the element', () => {
      renderHook(() => useOnClickOutside(mockRef, mockHandler));

      const outsideElement = document.createElement('div');
      document.body.appendChild(outsideElement);

      const touchEvent = new TouchEvent('touchstart', {
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(touchEvent, 'target', {
        value: outsideElement,
        enumerable: true,
      });

      document.dispatchEvent(touchEvent);

      expect(mockHandler).toHaveBeenCalledTimes(1);
      expect(mockHandler).toHaveBeenCalledWith(touchEvent);

      document.body.removeChild(outsideElement);
    });

    it('should not call handler when touching inside the element', () => {
      renderHook(() => useOnClickOutside(mockRef, mockHandler));

      const touchEvent = new TouchEvent('touchstart', {
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(touchEvent, 'target', {
        value: mockElement,
        enumerable: true,
      });

      document.dispatchEvent(touchEvent);

      expect(mockHandler).not.toHaveBeenCalled();
    });
  });

  describe('Keyboard Events', () => {
    it('should call handler when pressing Escape key outside the element', () => {
      renderHook(() => useOnClickOutside(mockRef, mockHandler));

      const outsideElement = document.createElement('div');
      document.body.appendChild(outsideElement);

      const keyEvent = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(keyEvent, 'target', {
        value: outsideElement,
        enumerable: true,
      });

      document.dispatchEvent(keyEvent);

      expect(mockHandler).toHaveBeenCalledTimes(1);
      expect(mockHandler).toHaveBeenCalledWith(keyEvent);

      document.body.removeChild(outsideElement);
    });

    it('should not call handler when pressing Escape key inside the element', () => {
      renderHook(() => useOnClickOutside(mockRef, mockHandler));

      const keyEvent = new KeyboardEvent('keydown', {
        key: 'Escape',
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(keyEvent, 'target', {
        value: mockElement,
        enumerable: true,
      });

      document.dispatchEvent(keyEvent);

      expect(mockHandler).not.toHaveBeenCalled();
    });

    it('should not call handler when pressing other keys outside the element', () => {
      renderHook(() => useOnClickOutside(mockRef, mockHandler));

      const outsideElement = document.createElement('div');
      document.body.appendChild(outsideElement);

      const keyEvent = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(keyEvent, 'target', {
        value: outsideElement,
        enumerable: true,
      });

      document.dispatchEvent(keyEvent);

      expect(mockHandler).not.toHaveBeenCalled();

      document.body.removeChild(outsideElement);
    });

    it('should handle various key codes correctly', () => {
      renderHook(() => useOnClickOutside(mockRef, mockHandler));

      const outsideElement = document.createElement('div');
      document.body.appendChild(outsideElement);

      const keys = ['Tab', 'Space', 'ArrowUp', 'ArrowDown', 'Enter'];
      
      keys.forEach(key => {
        const keyEvent = new KeyboardEvent('keydown', {
          key,
          bubbles: true,
          cancelable: true,
        });
        Object.defineProperty(keyEvent, 'target', {
          value: outsideElement,
          enumerable: true,
        });

        document.dispatchEvent(keyEvent);
      });

      expect(mockHandler).not.toHaveBeenCalled();

      document.body.removeChild(outsideElement);
    });
  });

  describe('Ref Handling', () => {
    it('should not call handler when ref.current is null', () => {
      const nullRef: RefObject<HTMLDivElement> = { current: null };
      renderHook(() => useOnClickOutside(nullRef, mockHandler));

      const outsideElement = document.createElement('div');
      document.body.appendChild(outsideElement);

      const mouseEvent = new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(mouseEvent, 'target', {
        value: outsideElement,
        enumerable: true,
      });

      document.dispatchEvent(mouseEvent);

      // Should NOT call handler when ref is null, because the hook doesn't know what element to check against
      expect(mockHandler).not.toHaveBeenCalled();
      
      document.body.removeChild(outsideElement);
    });

    it('should update behavior when ref changes', () => {
      const newElement = document.createElement('div');
      document.body.appendChild(newElement);

      const { rerender } = renderHook(
        ({ ref }) => useOnClickOutside(ref, mockHandler),
        { initialProps: { ref: mockRef } }
      );

      // Click outside first element
      const mouseEvent1 = new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(mouseEvent1, 'target', {
        value: newElement,
        enumerable: true,
      });

      document.dispatchEvent(mouseEvent1);
      expect(mockHandler).toHaveBeenCalledTimes(1);

      // Change ref to new element
      const newRef: RefObject<HTMLDivElement> = { current: newElement };
      rerender({ ref: newRef });

      // Click on the new element (should not trigger handler)
      const mouseEvent2 = new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(mouseEvent2, 'target', {
        value: newElement,
        enumerable: true,
      });

      document.dispatchEvent(mouseEvent2);
      expect(mockHandler).toHaveBeenCalledTimes(1); // Still 1, not called again

      document.body.removeChild(newElement);
    });
  });

  describe('Handler Changes', () => {
    it('should use updated handler function', () => {
      const handler1 = jest.fn();
      const handler2 = jest.fn();

      const { rerender } = renderHook(
        ({ handler }) => useOnClickOutside(mockRef, handler),
        { initialProps: { handler: handler1 } }
      );

      const outsideElement = document.createElement('div');
      document.body.appendChild(outsideElement);

      // First click with first handler
      const mouseEvent1 = new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(mouseEvent1, 'target', {
        value: outsideElement,
        enumerable: true,
      });

      document.dispatchEvent(mouseEvent1);
      expect(handler1).toHaveBeenCalledTimes(1);
      expect(handler2).not.toHaveBeenCalled();

      // Change handler
      rerender({ handler: handler2 });

      // Second click with new handler
      const mouseEvent2 = new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(mouseEvent2, 'target', {
        value: outsideElement,
        enumerable: true,
      });

      document.dispatchEvent(mouseEvent2);
      expect(handler1).toHaveBeenCalledTimes(1); // Still 1
      expect(handler2).toHaveBeenCalledTimes(1); // Called once

      document.body.removeChild(outsideElement);
    });
  });

  describe('Cleanup', () => {
    it('should remove event listeners on unmount', () => {
      const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
      const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');

      const { unmount } = renderHook(() => useOnClickOutside(mockRef, mockHandler));

      expect(addEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
      expect(addEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function));
      expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('mousedown', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('touchstart', expect.any(Function));
      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });

    it('should not trigger handler after unmount', () => {
      const { unmount } = renderHook(() => useOnClickOutside(mockRef, mockHandler));

      unmount();

      const outsideElement = document.createElement('div');
      document.body.appendChild(outsideElement);

      const mouseEvent = new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(mouseEvent, 'target', {
        value: outsideElement,
        enumerable: true,
      });

      document.dispatchEvent(mouseEvent);

      expect(mockHandler).not.toHaveBeenCalled();

      document.body.removeChild(outsideElement);
    });
  });

  describe('Type Safety', () => {
    it('should work with different element types', () => {
      const buttonElement = document.createElement('button');
      document.body.appendChild(buttonElement);
      const buttonRef: RefObject<HTMLButtonElement> = { current: buttonElement };

      const { unmount } = renderHook(() => useOnClickOutside(buttonRef, mockHandler));

      const mouseEvent = new MouseEvent('mousedown', {
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(mouseEvent, 'target', {
        value: buttonElement,
        enumerable: true,
      });

      document.dispatchEvent(mouseEvent);

      expect(mockHandler).not.toHaveBeenCalled();

      unmount();
      document.body.removeChild(buttonElement);
    });
  });
});