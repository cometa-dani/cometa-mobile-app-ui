import { Platform, View } from 'react-native';
import { useLinkBuilder } from '@react-navigation/native';
import { Text, PlatformPressable } from '@react-navigation/elements';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { ReactNode } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';


export const tabBarHeight = Platform.select({ ios: 60, android: 66 }) ?? 66;


export function TabBar({ state, descriptors, navigation }: BottomTabBarProps): ReactNode {
  const { styles, theme } = useStyles(tabBarStylesheet);
  const { buildHref } = useLinkBuilder();
  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route, index, arr) => {
        const { options } = descriptors[route.key];
        const Icon = options.tabBarIcon;
        const activeTintColor = options.tabBarActiveTintColor ?? theme.colors.red100;
        const inactiveTintColor = options.tabBarInactiveTintColor ?? theme.colors.gray300;
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
            style={styles.tabBarPressable(index, arr.length)}
          >
            {Icon &&
              Icon({
                color: isFocused ? activeTintColor : inactiveTintColor,
                focused: isFocused,
                size: 24
              })
            }
            <Text style={[styles.tabBarText, { color: isFocused ? activeTintColor : inactiveTintColor }]}>
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
    backgroundColor: theme.colors.white100,
    flex: 1,
    borderTopEndRadius: theme.spacing.sp10 * runtime.fontScale,
    borderTopStartRadius: theme.spacing.sp10 * runtime.fontScale,
    borderColor: theme.colors.white60,
    borderWidth: 1.4,
    paddingHorizontal: 0,
    margin: 0,
    paddingBottom: runtime.insets.bottom,
    width: '100%',
    bottom: 0,
    right: 0,
    left: 0,
    overflow: 'hidden'
  },
  tabBarPressable: (index: number, length: number) => ({
    height: tabBarHeight,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderTopStartRadius: (index === 0) ? theme.spacing.sp10 * runtime.fontScale : 0,
    borderTopEndRadius: (index === length - 1) ? theme.spacing.sp10 * runtime.fontScale : 0,
    backgroundColor: theme.colors.white100,
  }),
  tabBarText: {
    color: theme.colors.gray900,
    fontSize: theme.text.size.s2,
    fontFamily: theme.text.fontMedium
  }
}));
