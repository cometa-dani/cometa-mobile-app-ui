import React from 'react';
import { useFocusEffect } from '@react-navigation/native';


export function useRefreshOnFocus<T>(refetch: () => Promise<T>, isStaled: boolean) {
  const firstTimeRef = React.useRef(true);

  useFocusEffect(
    React.useCallback(() => {
      if (firstTimeRef.current) {
        firstTimeRef.current = false;
        return;
      }
      if (!isStaled) return;
      refetch();
    }, [refetch]),
  );
}
