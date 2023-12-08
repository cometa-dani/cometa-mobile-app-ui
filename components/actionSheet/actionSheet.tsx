import { Dispatch, FC, SetStateAction } from 'react';
import { StyleSheet, ScrollView, Pressable } from 'react-native';
import { Text, View } from '../Themed';
import { LikedEvent } from '../../models/Event';
import { FontAwesome, Feather } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { getRegionForCoordinates } from '../../helpers/getRegionFromCoords';
import {
  Gesture,
  BaseButton,
  GestureDetector,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
  withTiming,
  SlideInDown,
  SlideOutDown,
  FadeIn,
  FadeOut,
} from 'react-native-reanimated';


const HEIGHT = 520;
const OVERDRAG = 20;
const BACKDROP_COLOR = 'rgba(0, 0, 0, 0.2)';
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);


interface ActionSheetProps {
  eventItem: LikedEvent,
  isOpen: boolean,
  setIsOpen: Dispatch<SetStateAction<boolean>>
}
export const EventActionSheet: FC<ActionSheetProps> = ({ eventItem, isOpen, setIsOpen }) => {
  const latitude: number = eventItem?.location?.latitude ?? 0;
  const longitude: number = eventItem?.location?.longitude ?? 0;
  const { latitudeDelta = 0, longitudeDelta = 0 } = getRegionForCoordinates([{ latitude, longitude }]);

  const offset = useSharedValue(0);

  const toggleSheet = () => {
    setIsOpen(prev => !prev);
    offset.value = 0;
  };

  const pan = Gesture.Pan()
    .onChange((event) => {
      const offsetDelta = event.changeY + offset.value;

      const clamp = Math.max(-OVERDRAG, offsetDelta);
      offset.value = offsetDelta > 0 ? offsetDelta : withSpring(clamp);
    })
    .onFinalize(() => {
      if (offset.value < HEIGHT / 3) {
        offset.value = withSpring(0);
      } else {
        offset.value = withTiming(HEIGHT, {}, () => {
          runOnJS(toggleSheet)();
        });
      }
    });

  const translateY = useAnimatedStyle(() => ({
    transform: [{ translateY: offset.value }],
  }));

  return (
    isOpen && (
      <>
        <AnimatedPressable
          style={styles.backdrop}
          entering={FadeIn}
          exiting={FadeOut}
          onPress={toggleSheet}
        />
        <Animated.View
          style={[styles.sheet, translateY]}
          entering={SlideInDown.springify().damping(15)}
          exiting={SlideOutDown}
        >
          <View style={styles.container}>
            <GestureDetector gesture={pan}>
              <View style={{ backgroundColor: 'transparent', paddingTop: 8, paddingBottom: 8, alignItems: 'center' }}>
                <BaseButton
                  style={{
                    backgroundColor: '#eee',
                    padding: 4,
                    width: 90,
                    borderRadius: 20
                  }} />
              </View>
            </GestureDetector>

            <ScrollView showsVerticalScrollIndicator={false} scrollEnabled>

              <View style={styles.containerList}>
                <View style={{ gap: 4 }}>
                  <Text style={styles.title}>{eventItem.name}</Text>

                  <View style={styles.textItem}>
                    <FontAwesome name='calendar-o' size={20} />
                    <Text>{new Date(eventItem.date).toDateString()} </Text>
                  </View>
                  <View style={styles.textItem}>
                    <FontAwesome name='clock-o' size={20} />
                    <Text>{new Date(eventItem.date).getHours().toFixed(2)}</Text>
                  </View>
                  <View style={styles.textItem}>
                    <Feather name='map-pin' size={20} />
                    <Text>{eventItem.location.name}</Text>
                  </View>
                </View>

                <View>
                  <Text>{eventItem.location.description}</Text>
                </View>
              </View>

              <View style={{ height: 200 }}>
                <MapView
                  style={styles.map}
                  provider='google'
                  zoomEnabled
                  zoomTapEnabled
                  minZoomLevel={8}
                  maxZoomLevel={15}
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
              </View>

            </ScrollView>
          </View>
        </Animated.View>
      </>
    )
  );
};


const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: BACKDROP_COLOR,
    zIndex: 1,
  },

  container: {
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    maxHeight: 440,
  },

  containerList: {
    backgroundColor: 'transparent',
    flexGrow: 1,
    gap: 22,
    padding: 24,
  },

  map: {
    flex: 1,
    height: '100%',
    width: '100%',
  },

  sheet: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    bottom: 0,
    // bottom: -OVERDRAG * 1.1,
    // height: HEIGHT,
    // padding: 16,
    position: 'absolute',
    width: '100%',
    zIndex: 1,
  },

  textItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12
  },

  title: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 16,
    textAlign: 'center'
  },
});
