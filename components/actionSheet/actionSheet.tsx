import { FC } from 'react';
import { StyleSheet } from 'react-native';
import ActionSheet, { SheetProps } from 'react-native-actions-sheet';
import { Text, View } from '../Themed';
import { LikedEvent } from '../../models/Event';
import { FontAwesome, Feather } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { getRegionForCoordinates } from '../../helpers/getRegionFromCoords';


interface ActionSheetProps extends SheetProps {
  payload: LikedEvent
}

export const EventActionSheet: FC<ActionSheetProps> = ({ sheetId, payload }) => {
  const { latitude, longitude } = payload.location;
  const { latitudeDelta, longitudeDelta } = getRegionForCoordinates([{ latitude, longitude }]);
  return (
    <ActionSheet id={sheetId}>
      <View style={styles.container}>
        <View style={styles.containerList}>
          <Text style={styles.title}>{payload.name}</Text>

          <View style={styles.textItem}>
            <FontAwesome name='calendar-o' size={20} />
            <Text>{new Date(payload.date).toDateString()} </Text>
          </View>
          <View style={styles.textItem}>
            <FontAwesome name='clock-o' size={20} />
            <Text>{new Date(payload.date).getHours().toFixed(2)}</Text>
          </View>
          <View style={styles.textItem}>
            <Feather name='map-pin' size={20} />
            <Text>{payload.location.name}</Text>
          </View>
        </View>

        <MapView
          style={styles.map}
          provider='google'
          zoomEnabled
          zoomTapEnabled
          minZoomLevel={8}
          maxZoomLevel={14}
          region={{
            latitude: latitude,
            longitude: longitude,
            longitudeDelta: longitudeDelta,
            latitudeDelta: latitudeDelta
          }}
        >
          <Marker
            coordinate={{ latitude: latitude, longitude: longitude }}
          />
        </MapView>

        <View style={styles.containerList}>
          <Text>
            {payload.description}
          </Text>
        </View>
      </View>
    </ActionSheet>
  );
};


const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    maxHeight: 600,
    minHeight: 520
  },

  containerList: {
    backgroundColor: 'transparent',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 22
  },

  map: {
    flex: 1,
    height: '100%',
    width: '100%',
  },

  textItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12
  },

  title: {
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center'
  }
});
