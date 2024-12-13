import { Pressable } from 'react-native';
import { TextView } from './text';
import { Condition } from '../utils/ifElse';
import { FC, useReducer } from 'react';


interface IExpandableTextProps {
  children?: string;
  initialLines?: number;
  maxLines?: number;
}
export const ExpandableText: FC<IExpandableTextProps> = ({ children, initialLines = 2, maxLines = 30 }) => {
  const [numberOfLines, setNumberOfLines] = useReducer(prev => prev === initialLines ? maxLines : initialLines, initialLines);
  return (
    <Pressable onPress={setNumberOfLines}>
      <TextView
        numberOfLines={numberOfLines}
        ellipsis={true}
      >
        {children ?? 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis temporibus sed odit exercitationem, suscipit debitis quaerat laboriosam reprehenderit reiciendis dolore velit deserunt voluptates laudantium, accusamus dolorem cupiditate laborum natus facilis.'}
      </TextView>
      <Condition
        if={numberOfLines === initialLines}
        then={
          <TextView bold={true}>see more</TextView>
        }
      />
    </Pressable>
  );
};
