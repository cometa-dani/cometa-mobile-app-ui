import { FC } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { AppCard } from '../card/card';
import { Text, View, useColors } from '../Themed';
import { FontAwesome } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';


interface Props {
  title: string,
  list: Array<{ id: string | number, img: string, placeholder?: string }>
  isLocked?: boolean,
  isLoading?: boolean,
  onPress?: (eventIndex: number) => void
}

export const AppCarousel: FC<Props> = ({ list, title, isLocked = false, onPress }) => {
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
          <Text style={{ fontSize: 18, fontWeight: '700' }}>{title}</Text>

          {list.length === 0 ? (
            <View style={styles.bucketListImage}>
              <Text>No {title} available</Text>
            </View>
          ) : (
            <FlashList
              showsHorizontalScrollIndicator={false}
              estimatedItemSize={130}
              ListFooterComponent={() => <View style={{ width: 20 }} />}
              ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
              horizontal={true}
              data={list}
              renderItem={({ item, index }) => {
                return (
                  item?.img ? (
                    <Pressable onPress={() => onPress && onPress(index)}>
                      <Image
                        placeholder={{ thumbhash: item.placeholder }}
                        style={styles.bucketListImage}
                        key={item.id}
                        source={{ uri: item.img }}
                      />
                    </Pressable>
                  ) : (
                    <View key={item.id} style={[styles.bucketListImage, { backgroundColor: '#eee', padding: 12, alignItems: 'center', flex: 1 }]} >
                      <Text>Photo not available</Text>
                    </View>
                  )
                );
              }}
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
