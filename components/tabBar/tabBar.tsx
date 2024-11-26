import { View } from 'react-native';
import { useLinkBuilder } from '@react-navigation/native';
import { Text, PlatformPressable } from '@react-navigation/elements';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { ReactNode } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';


export function TabBar({ state, descriptors, navigation }: BottomTabBarProps): ReactNode {
  const { styles } = useStyles(tabBarStylesheet);
  const { buildHref } = useLinkBuilder();
  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
              ? options.title
              : route.name;

        const isFocused = state.index === index;
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };
        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };
        return (
          <PlatformPressable
            key={route.key}
            href={buildHref(route.name, route.params)}
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarButtonTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            style={styles.tabBarPressable}
          >
            <Text style={styles.tabBarText}>
              {label as ReactNode}
            </Text>
          </PlatformPressable>
        );
      })}
    </View>
  );
}

const tabBarStylesheet = createStyleSheet((theme, runtime) => ({
  tabBarContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.gray900,
    flex: 1,
    borderTopEndRadius: theme.spacing.sp10,
    borderTopStartRadius: theme.spacing.sp10,
    overflow: 'hidden',
    paddingBottom: runtime.insets.bottom,
    bottom: 0,
    right: 0,
    left: 0
  },
  tabBarPressable: {
    height: 66,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.gray900,
    paddingHorizontal: theme.spacing.sp10,
  },
  tabBarText: {
    color: theme.colors.white100,
    fontSize: theme.text.size.s2,
    fontFamily: theme.text.fontMedium
  }
}));
