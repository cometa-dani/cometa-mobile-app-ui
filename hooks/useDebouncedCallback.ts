import { useEffect, useState } from 'react';


/**
 * Custom hook to debounce a callback function.
 *
 * @param callback - The function to be debounced.
 * @param deps - The dependency array that will trigger the debounce effect when changed.
 * @param time - The delay in milliseconds for the debounce (default is 1400ms).
 */
export function useDebouncedCallback(callback: () => void, deps: React.DependencyList, time = 1_600) {
  const [firstRender, setFirstRender] = useState(false);
  useEffect(
    () => {
      if (!firstRender) {
        setFirstRender(true);
        return;
      }
      const timeOutId = setTimeout(callback, time);
      return () => clearTimeout(timeOutId);
    },
    deps
  );
}
