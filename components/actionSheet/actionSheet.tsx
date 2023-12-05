import ActionSheet, { SheetProps } from 'react-native-actions-sheet';
import { Text, View } from '../Themed';


export function ExampleSheet(props: SheetProps) {
  return (
    <ActionSheet id={props.sheetId}>
      <View>
        <Text>Hello World</Text>
        <Text>{props.payload}</Text>
      </View>
    </ActionSheet>
  );
}
