import { FC } from 'react';
import { StyleSheet, Image } from 'react-native';
import { AppCard } from '../card/card';
import { Text, View, useColors } from '../Themed';
import { FlatList } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';


interface Props {
  title: string,
  list: Array<{ id: string | number, img: string }>
  isFriend?: boolean
}

export const AppCarousel: FC<Props> = ({ list, title, isFriend = true }) => {
  const { gray50, gray200 } = useColors();
  return (
    isFriend ? (
      <AppCard>
        <View style={styles.cardWrapper}>
          <Text style={{ fontSize: 17, fontWeight: '700' }}>{title}</Text>

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
    ) : (
      <AppCard style={[styles.lock, { backgroundColor: gray50 }]}>
        <FontAwesome style={{ fontSize: 48, backgroundColor: gray50, color: gray200 }} name='lock' />
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
    // backgroundColor: '#f0f0f0',
    flex: 1,
    height: 140,
    justifyContent: 'center',
    padding: 0
  }
});
