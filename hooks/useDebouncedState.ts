import { useState } from 'react';
import { useDebouncedCallback } from './useDebouncedCallback';


/**
 * Custom hook to manage state with a debounced value.
 *
 * @param initialValue - The initial state value.
 * @param time - The delay in milliseconds for the debounce (default is 1400ms).
 * @returns A tuple containing the debounced value and a function to update the state.
 */
export function useDebouncedState<T>(initialValue: T, time = 1_400): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState(initialValue);
  const [debouncedValue, setDebouncedValue] = useState(initialValue);

  useDebouncedCallback(() => setDebouncedValue(value), [value], time);

  return [debouncedValue, setValue];
}
