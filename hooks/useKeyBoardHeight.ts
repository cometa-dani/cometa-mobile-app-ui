import { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';


export const useKeyboard = () => {
  const [height, setHeight] = useState(0);

  useEffect(() => {
    Keyboard.addListener('keyboardDidShow', (event) => {
      setHeight(event.endCoordinates.height);
    });
    Keyboard.addListener('keyboardDidHide', () => {
      setHeight(0);
    });
    return () => {
      if (!Keyboard) return;
      Keyboard?.removeAllListeners('keyboardDidShow');
      Keyboard?.removeAllListeners('keyboardDidHide');
    };
  }, []);

  return { height };
};
