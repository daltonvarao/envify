import { useEffect } from "react";

export const useClickOutsideRef = <T extends HTMLElement>(
  ref: React.RefObject<T>,
  onClickOutside: () => void
) => {
  useEffect(() => {
    function listener(ev: MouseEvent) {
      const target = ev.target as HTMLDivElement;

      if (ref) {
        if (!ref.current?.contains(target)) {
          onClickOutside();
        }
      }
    }

    document.addEventListener("click", listener);

    return () => {
      document.removeEventListener("click", listener);
    };
  }, []);
};
