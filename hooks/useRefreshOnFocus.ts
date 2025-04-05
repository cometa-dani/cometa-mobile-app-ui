import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { RefetchOptions } from '@tanstack/react-query';


export function useRefreshOnFocus<T>(refetch: (options?: RefetchOptions) => Promise<T>) {
  useFocusEffect(
    useCallback(() => {
      refetch()
        .then()
        .catch();
      return () => { };
    }, [refetch]),
  );
}
