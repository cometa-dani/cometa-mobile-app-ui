import { Pressable } from 'react-native';
import { TextView } from './text';
import { FC, useReducer } from 'react';


const reducer = (initialLines: number, maxLines: number) => {
  return (prev: number) => {
    return prev === initialLines ? maxLines : initialLines;
  };
};


interface IExpandableTextProps {
  children?: string;
  initialLines?: number;
  maxLines?: number;
}
export const ExpandableText: FC<IExpandableTextProps> = ({ children, initialLines = 2, maxLines = 30 }) => {
  const [numberOfLines, setNumberOfLines] = useReducer(reducer(initialLines, maxLines), initialLines);
  return (
    <Pressable onPress={setNumberOfLines}>
      <TextView
        numberOfLines={numberOfLines}
        ellipsis={true}
      >
        {children ?? ('\
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis \
          temporibus sed odit exercitationem, suscipit debitis quaerat laboriosam \
          reprehenderit reiciendis dolore velit deserunt voluptates laudantium, accusamus \
          dolorem cupiditate laborum natus facilis.'
        )}
      </TextView>

      <TextView bold={true}>
        {numberOfLines === initialLines ? 'show more' : 'show less'}
      </TextView>
    </Pressable>
  );
};
