import { useEffect, RefObject } from 'react';

type Handler = (event: MouseEvent | TouchEvent | KeyboardEvent) => void;

function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  handler: Handler
): void {
  useEffect(() => {
    const mouseListener = (event: MouseEvent | TouchEvent) => {
      const el = ref.current;
      if (!el || el.contains((event.target as Node) || null)) {
        return;
      }

      handler(event);
    };

    const keyListener = (event: KeyboardEvent) => {
      const el = ref.current;
      if (!el || el.contains((event.target as Node) || null)) {
        return;
      }

      if(event.key === "Escape" ) {
        handler(event);
      }
    };

    document.addEventListener('mousedown', mouseListener);
    document.addEventListener('touchstart', mouseListener);
    document.addEventListener('keydown', keyListener);

    return () => {
      document.removeEventListener('mousedown', mouseListener);
      document.removeEventListener('touchstart', mouseListener);
      document.removeEventListener('keydown', keyListener);
    };
  }, [ref, handler]);
}

export default useOnClickOutside;
