import { TextView } from '@/components/text/text';
import { useQueryGetLocations } from '@/queries/organization/locationHooks';
import { FlashList } from '@shopify/flash-list';
import { Stack } from 'expo-router';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { FontAwesome5 } from '@expo/vector-icons';
import { tabBarHeight } from '@/components/tabBar/tabBar';


export default function LocationsScreen() {
  const { styles, theme } = useStyles(stylesheet);
  const { data } = useQueryGetLocations();

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Locations',
          headerTitleAlign: 'center'
        }}
      />
      {/* <TextView>Locations</TextView> */}
      <FlashList
        data={data}
        estimatedItemSize={100}
        contentContainerStyle={{ padding: theme.spacing.sp6 }}
        ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
        ListFooterComponent={() => <View style={{ height: tabBarHeight * 2 }} />}
        renderItem={({ item }) => {
          return (
            <View style={styles.locationCard}>
              <View style={styles.locationInfo}>
                <TextView style={styles.locationName}>{item.name}</TextView>
                <TextView style={styles.locationUrl} numberOfLines={1}>{item.mapUrl}</TextView>
              </View>
              <FontAwesome5
                name="map-marker-alt"
                size={24}
                color={theme.colors.red100}
              />
            </View>
          );
        }}
      />
    </>
  );
}

const stylesheet = createStyleSheet((theme, rt) => ({
  locationCard: {
    backgroundColor: theme.colors.white100,
    borderRadius: theme.spacing.sp4,
    padding: theme.spacing.sp4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 2,
  },
  locationInfo: {
    flex: 1,
    marginRight: theme.spacing.sp4,
  },
  locationName: {
    fontSize: theme.text.size.s4,
    fontFamily: theme.text.fontSemibold,
    color: theme.colors.gray900,
    marginBottom: theme.spacing.sp1,
  },
  locationUrl: {
    fontSize: theme.text.size.s2,
    color: theme.colors.gray500,
  },
}));
