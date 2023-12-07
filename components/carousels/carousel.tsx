import { FC } from 'react';
import { StyleSheet, Image } from 'react-native';
import { AppCard } from '../card/card';
import { Text, View, useColors } from '../Themed';
import { FlatList } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';


interface Props {
  title: string,
  list: Array<{ id: string | number, img: string }>
  isLocked?: boolean
}

export const AppCarousel: FC<Props> = ({ list, title, isLocked = false }) => {
  const { gray50, gray200 } = useColors();

  return (
    isLocked ? (
      <AppCard style={[styles.lock, { backgroundColor: gray50 }]}>
        <FontAwesome
          name='lock'
          style={{ fontSize: 44, backgroundColor: gray50, color: gray200 }}
        />
      </AppCard>
    ) : (
      <AppCard>
        <View style={styles.cardWrapper}>
          <Text style={{ fontSize: 16, fontWeight: '700' }}>{title}</Text>

          {list.length === 0 ? (
            <View style={styles.bucketListImage}>
              <Text>No {title} available</Text>
            </View>
          ) : (
            <FlatList
              contentContainerStyle={{ gap: 12, justifyContent: 'center' }}
              showsHorizontalScrollIndicator={false}
              // pagingEnabled={true}
              horizontal={true}
              data={list}
              renderItem={({ item }) => (
                <Image
                  style={styles.bucketListImage}
                  key={item.id}
                  source={{ uri: item.img }}
                />
              )}
            />
          )}
        </View>
      </AppCard>
    )
  );
};

const styles = StyleSheet.create({
  bucketListImage: {
    borderRadius: 12,
    height: 84,
    width: 130
  },

  cardWrapper: {
    gap: 12
  },

  lock: {
    alignItems: 'center',
    flex: 1,
    height: 140,
    justifyContent: 'center',
    padding: 0
  }
});
