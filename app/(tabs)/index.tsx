/* eslint-disable react-native/no-color-literals */
import { useEffect, useState } from 'react';
import { StyleSheet, Image, DimensionValue } from 'react-native';
import { Text, View } from '../../components/Themed';
import { useCometaStore } from '../../store/cometaStore';
import { FlatList } from 'react-native-gesture-handler';


export default function HomeScreen(): JSX.Element {
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatListContent: {
    flexGrow: 1,
  }
});
