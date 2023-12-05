import { FC } from 'react';
import { StyleSheet } from 'react-native';
import ActionSheet, { SheetProps } from 'react-native-actions-sheet';
import { Text, View } from '../Themed';
import { LikedEvent } from '../../models/Event';
import { FontAwesome, Feather } from '@expo/vector-icons';


interface ActionSheetProps extends SheetProps {
  payload: LikedEvent
}

export const EventActionSheet: FC<ActionSheetProps> = ({ sheetId, payload }) => {
  return (
    <ActionSheet id={sheetId}>
      <View style={styles.container}>
        <View style={styles.containerList}>
          <Text style={styles.title}>{payload.name}</Text>

          <View style={styles.textItem}>
            <FontAwesome name='calendar-o' size={21} />
            <Text>{new Date(payload.date).toDateString()} </Text>
          </View>
          <View style={styles.textItem}>
            <FontAwesome name='clock-o' size={21} />
            <Text>{new Date(payload.date).getHours().toFixed(2)}</Text>
          </View>
          <View style={styles.textItem}>
            <Feather name='map-pin' size={21} />
            <Text>{payload.location.name}</Text>
          </View>
        </View>
      </View>
    </ActionSheet>
  );
};


const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    height: 340,
  },

  containerList: {
    backgroundColor: 'transparent',
    gap: 16,
    padding: 24
  },

  textItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12
  },

  title: {
    fontWeight: '800',
    textAlign: 'center'
  }
});
