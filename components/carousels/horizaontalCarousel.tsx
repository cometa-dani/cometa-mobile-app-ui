import { FC } from 'react';
import { StyleSheet, Image } from 'react-native';
import { CoCard } from '../card/card';
import { Text, View } from '../Themed';
import { FlatList } from 'react-native-gesture-handler';


interface Props {
  title: string,
  list: Array<{ id: string | number, img: string }>
}

export const HorizontalCarousel: FC<Props> = ({ list, title }) => {
  return (
    <CoCard>
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
    </CoCard>
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
});
