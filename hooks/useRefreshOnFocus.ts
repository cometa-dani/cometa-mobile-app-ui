import React, { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { RefetchOptions } from '@tanstack/react-query';


export function useRefreshOnFocus<T>(refetch: (options?: RefetchOptions) => Promise<T>) {
  const firstTimeRef = React.useRef(true);

  useFocusEffect(
    useCallback(() => {
      if (firstTimeRef.current) {
        firstTimeRef.current = false;
        return;
      }
      // if the query has a refetch interval, it will be refetched again and again
      // on screen focus, but when the screen is unfocused, it will not be refetched
      refetch();
      return () => { };
    }, [refetch]),
  );
}
