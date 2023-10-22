/* eslint-disable react-native/no-color-literals */
import { useEffect, useState } from 'react';
import { StyleSheet, Image, DimensionValue, Pressable } from 'react-native';
import { Text, View, useColors } from '../../components/Themed';
import { useCometaStore } from '../../store/cometaStore';
import { FlatList } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';


export default function HomeScreen(): JSX.Element {
  const { red100, tabIconDefault } = useColors();
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
            <Text style={styles.title}>{item.name}</Text>
          </View>
        )}
      />

      <View style={styles.positionedButtons}>
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
    gap: 20,
    position: 'absolute',
    right: 24
  },
  title: {
    color: '#fff',
    fontSize: 30,
    position: 'absolute',
    textAlign: 'center',
    top: 40
  }
});
