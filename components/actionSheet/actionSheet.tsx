/* eslint-disable no-unused-vars */
import type { FC } from 'react';
import { StyleSheet, ScrollView, Pressable, Image } from 'react-native';
import { Text, View } from '../Themed';
import { LikedEvent } from '../../models/Event';
import { FontAwesome, Feather } from '@expo/vector-icons';
// import MapView, { Marker } from 'react-native-maps';
import { getRegionForCoordinates } from '../../helpers/getRegionFromCoords';
import {
  Gesture,
  BaseButton,
  GestureDetector,
  PanGesture,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
  SlideInDown,
  SlideOutDown,
  FadeIn,
  FadeOut,
  // withTiming,
} from 'react-native-reanimated';
import { Dimensions } from 'react-native';
import { backDrop } from '../../constants/colors';

const TOTAL_HEIGHT = Dimensions.get('window').height;
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const initialOffSetY = (TOTAL_HEIGHT / 2) + 50;


interface EventActionSheetProps {
  eventItem: LikedEvent,
  isOpen: boolean,
  setIsOpen: (openOrClose: boolean) => void
}
export const EventActionSheet: FC<EventActionSheetProps> = ({ eventItem, isOpen, setIsOpen }) => {
  // const latitude: number = eventItem?.location?.latitude ?? 0;
  // const longitude: number = eventItem?.location?.longitude ?? 0;
  // const { latitudeDelta = 0, longitudeDelta = 0 } = getRegionForCoordinates([{ latitude, longitude }]);

  const offsetY = useSharedValue(initialOffSetY);

  const closeActionSheet = (): void => {
    setIsOpen(false);
    setTimeout(() => {
      offsetY.value = initialOffSetY;
    }, 300);
  };

  const panGestureHandler: PanGesture = (
    Gesture.Pan()
      .onChange((event) => {
        const offsetDelta = event.changeY + offsetY.value;
        offsetY.value = offsetDelta;
      })
      .onTouchesUp(() => {
        if (offsetY.value < TOTAL_HEIGHT / 3) {
          offsetY.value = withSpring(0); // opens all the actionSheet
        }
        else {
          runOnJS(closeActionSheet)();
          // offsetY.value = withTiming(initialOffSetY, {}, () => {
          // });
        }
      })
  );

  // animation
  const transformY = useAnimatedStyle(() => ({
    transform: [{ translateY: offsetY.value }],
  }));

  return (
    isOpen && (
      <>
        <AnimatedPressable
          style={styles.backdrop}
          entering={FadeIn}
          exiting={FadeOut}
          onPressOut={closeActionSheet}
        />
        <Animated.View
          style={[styles.sheet, transformY]}
          entering={
            SlideInDown
              .springify()
              .restSpeedThreshold(2).stiffness(86).mass(0.5)
          }
          exiting={SlideOutDown.springify()}
        >
          <View style={styles.container}>
            <GestureDetector gesture={panGestureHandler}>
              <View style={{ backgroundColor: 'transparent', paddingTop: 9, paddingBottom: 9, alignItems: 'center' }}>
                <BaseButton
                  style={{
                    backgroundColor: '#eee',
                    height: 6,
                    width: 80,
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

              <View style={{ height: 280 }}>
                <Image
                  style={{ flex: 1, width: '100%' }}
                  source={require('../../assets/images/Placeholder-Map-Image-768x409.png')}
                />
                {/* {nodeEnv === 'development' ? (
                ) : (
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
                )} */}
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
    backgroundColor: backDrop,
    zIndex: 2,
  },

  container: {
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
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
    height: '96%',
    position: 'absolute',
    width: '100%',
    zIndex: 2,
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
