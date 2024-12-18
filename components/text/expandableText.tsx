import { Pressable } from 'react-native';
import { TextView } from './text';
import { FC, useReducer, useState } from 'react';
import { Condition } from '../utils/ifElse';


const reducer = (initialLines: number, maxLines: number) => {
  return (prev: number) => {
    return prev === initialLines ? maxLines : initialLines;
  };
};


interface IExpandableTextProps {
  children?: string;
  minLines?: number;
  maxLines?: number;
}
export const ExpandableText: FC<IExpandableTextProps> = ({ children, minLines = 2, maxLines = 30 }) => {
  const [numberOfLines, setNumberOfLines] = useReducer(reducer(minLines, maxLines), minLines);
  const [isOverMinLines, setIsOverMinLines] = useState(false);
  return (
    <Pressable onPress={setNumberOfLines}>
      <TextView
        onTextLayout={({ nativeEvent: { lines } }) => {
          lines?.length > minLines && setIsOverMinLines(true);
        }}
        numberOfLines={numberOfLines}
        ellipsis={true}
      >
        {children}
      </TextView>

      <Condition
        if={isOverMinLines}
        then={
          <TextView bold={true}>
            {numberOfLines === minLines ? 'show more' : 'show less'}
          </TextView>
        }
      />
    </Pressable>
  );
};
