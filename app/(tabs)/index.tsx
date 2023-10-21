/* eslint-disable react-native/no-color-literals */
import { useEffect, useState } from 'react';
import { StyleSheet, Image, DimensionValue, Pressable, useColorScheme } from 'react-native';
import { Text, View } from '../../components/Themed';
import { useCometaStore } from '../../store/cometaStore';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { Colors } from 'react-native/Libraries/NewAppScreen';


export default function HomeScreen(): JSX.Element {

  const colorScheme = useColorScheme() ?? 'light';
  const { data } = useCometaStore(state => state.events);
  const fetchEvents = useCometaStore(state => state.fetchEvents);
  const [layoutHeight, setLayoutHeight] = useState<DimensionValue>('100%');

  useEffect(() => {
    fetchEvents().then();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        onLayout={(e) => setLayoutHeight(e.nativeEvent.layout.height)}
        data={data.events}
        contentContainerStyle={styles.flatListContent}
        renderItem={({ item }) => (
          <View style={{
            alignItems: 'center',
            backgroundColor: '#eee',
            height: layoutHeight,
            justifyContent: 'center',
            width: '100%',
          }}>
            <Image
              source={{ uri: item.mediaUrl }}
              style={{ width: '100%', height: '100%' }}
            />
            {/* <Text>{item.name}</Text> */}
          </View>
        )}
      />

      <View style={styles.positionedButtons}>
        <Link href="/modal" asChild>
          <Pressable>
            {({ pressed, hovered }) => (
              <FontAwesome
                name="heart"
                size={54}
                color={'red'}
              // style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
              />
            )}
          </Pressable>
        </Link>
        {/* <TouchableOpacity>
          <FontAwesome name='heart' size={54} style={{ color: 'red' }} />
        </TouchableOpacity> */}
        <TouchableOpacity>
          <FontAwesome name='commenting' size={54} style={{ color: 'red' }} />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome name='send' size={54} style={{ color: 'red' }} />
        </TouchableOpacity>
        <TouchableOpacity>
          <FontAwesome name='chevron-down' size={54} style={{ color: 'red' }} />
        </TouchableOpacity>
      </View>
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
  positionedButtons: {
    backgroundColor: 'transparent',
    bottom: 44,
    gap: 18,
    position: 'absolute',
    right: 24
  }
});
