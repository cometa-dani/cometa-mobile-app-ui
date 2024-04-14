import { StyleSheet, SafeAreaView, Text, View } from 'react-native';
import { useColors } from '../../components/Themed';
import { Stack, useLocalSearchParams } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { Image } from 'expo-image';
import { BaseButton, RectButton, Swipeable } from 'react-native-gesture-handler';
import { FontAwesome } from '@expo/vector-icons';
import { gray_50, red_100 } from '../../constants/colors';


const data = [
  {
    img: 'https://randomuser.me/api/portraits/women/2.jpg',
    message: 'Cristina is your new match',
  },
  {
    img: 'https://randomuser.me/api/portraits/men/81.jpg',
    message: 'Mark is your new match',
  },
  {
    img: 'https://randomuser.me/api/portraits/women/21.jpg',
    message: 'Camila is your new match',
  },
  {
    img: 'https://randomuser.me/api/portraits/men/37.jpg',
    message: 'Johnny is your new match',
  }
];


export default function NotificationsScreen(): JSX.Element {
  // colors
  const { background } = useColors();
  const uuid = useLocalSearchParams<{ uuid: string }>()['uuid'];
  // const [toggleModal, setToggleModal] = useState(false);

  const handleDeleteNotification = () => { };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: background }}>
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerTitle: 'Notifications',
          headerTitleAlign: 'center'
        }}
      />
      <FlashList
        data={data}
        contentContainerStyle={{ paddingVertical: 20 }}
        keyExtractor={(item, index) => index.toString()}
        estimatedItemSize={77}
        renderItem={({ item }) => (
          <Swipeable
            renderRightActions={(_a, _b, swipeable) => (
              <RectButton
                onPress={() => {
                  swipeable?.close();
                  handleDeleteNotification();
                }}
                style={styles.deleteButton}
              >
                <FontAwesome name='trash-o' size={26} color={red_100} />
              </RectButton>
            )}>
            <BaseButton style={styles.container}>
              <View style={styles.imageContainer}>
                <Image source={{ uri: item.img }} style={styles.image} />
              </View>

              <Text>{item.message}</Text>
            </BaseButton>

          </Swipeable>
        )}
      />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    gap: 16
  },

  imageContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden'
  },

  image: { width: 50, height: 50 },

  deleteButton: {
    backgroundColor: gray_50,
    borderRadius: 18,
    justifyContent: 'center',
    marginRight: 20,
    padding: 20,
  },
});
