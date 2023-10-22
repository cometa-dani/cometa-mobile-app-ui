import { useEffect, useState } from 'react';
import { StyleSheet, Image, DimensionValue, Pressable } from 'react-native';
import { Text, View, useColors } from '../../components/Themed';
import { useCometaStore } from '../../store/cometaStore';
import { FlatList } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';


export default function HomeScreen(): JSX.Element {
  const { red100, tabIconDefault } = useColors();
  const { data } = useCometaStore(state => state.events); // list of events to render
  const fetchEvents = useCometaStore(state => state.fetchEvents);
  const [layoutHeight, setLayoutHeight] = useState<DimensionValue>('100%'); // sets the height of every item

  useEffect(() => {
    fetchEvents().then(); // fetches latest events from backend
  }, []);

  return (
    <View style={styles.container}>
      {/* latest events */}
      <FlatList
        pagingEnabled={true}
        onLayout={(e) => setLayoutHeight(e.nativeEvent.layout.height)}
        data={data.events}
        contentContainerStyle={styles.flatListContent}
        renderItem={({ item }) => (
          <View style={{
            alignItems: 'center',
            // backgroundColor: '#eee',
            height: layoutHeight,
            justifyContent: 'center',
            width: '100%',
          }}>
            {/* background image */}
            <Image
              source={{ uri: item.mediaUrl }}
              style={{ width: '100%', height: '100%' }}
            />
            {/* event title */}
            <Text lightColor='#fff' darkColor='#eee' style={styles.title}>{item.name}</Text>

            {/* positioned buttons  */}
            <View lightColor='transparent' darkColor='transparent' style={styles.positionedButtons}>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome name='heart' size={46} style={{ color: pressed ? red100 : tabIconDefault }} />
                )}
              </Pressable>
              <Pressable>
                {() => (
                  <FontAwesome name='commenting' size={46} style={{ color: tabIconDefault }} />
                )}
              </Pressable>
              <Pressable>
                {() => (
                  <FontAwesome name='send' size={46} style={{ color: tabIconDefault }} />
                )}
              </Pressable>
              <Pressable>
                {() => (
                  <FontAwesome name='chevron-down' size={46} style={{ color: tabIconDefault }} />
                )}
              </Pressable>
            </View>
            {/* positioned buttons /*}

            {/* organizer icon */}
            <View lightColor='transparent' darkColor='transparent' style={styles.organizerContainer}>
              <Image style={styles.img} source={require('@assets/images/asian-cup.jpeg')} />
              <Text lightColor='#fff' darkColor='#eee' style={styles.organizer}>Asian Cup</Text>
            </View>
          </View>
        )}
      />
      {/* latest events */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  flatListContent: {
    flexGrow: 1,
  },
  img: {
    borderRadius: 50,
    height: 60,
    overflow: 'hidden',
    width: 60,
  },
  organizer: {
    fontSize: 20,
  },
  organizerContainer: {
    alignItems: 'center',
    bottom: 30,
    flexDirection: 'row',
    gap: 12,
    left: 20,
    position: 'absolute'
  },
  positionedButtons: {
    bottom: 30,
    gap: 20,
    position: 'absolute',
    right: 20
  },

  title: {
    // title color should be come from backend
    fontSize: 30,
    position: 'absolute',
    textAlign: 'center',
    top: 40
  }
});
