import { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';


export const useKeyboard = () => {
  const [height, setHeight] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    Keyboard.addListener('keyboardWillShow', (event) => {
      setHeight(event.endCoordinates.height);
      setIsVisible(true);
    });
    Keyboard.addListener('keyboardWillHide', () => {
      setHeight(0);
      setIsVisible(false);
    });
    return () => {
      if (!Keyboard) return;
      Keyboard?.removeAllListeners('keyboardDidShow');
      Keyboard?.removeAllListeners('keyboardDidHide');
    };
  }, []);

  return { height, isVisible };
};
