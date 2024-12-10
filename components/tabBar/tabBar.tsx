import { View } from 'react-native';
import { useLinkBuilder } from '@react-navigation/native';
import { Text, PlatformPressable } from '@react-navigation/elements';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { ReactNode } from 'react';
import { createStyleSheet, useStyles } from 'react-native-unistyles';


export function TabBar({ state, descriptors, navigation }: BottomTabBarProps): ReactNode {
  const { styles, theme } = useStyles(tabBarStylesheet);
  const { buildHref } = useLinkBuilder();
  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route, index) => {
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
            style={styles.tabBarPressable}
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
    borderTopEndRadius: theme.spacing.sp10,
    borderTopStartRadius: theme.spacing.sp10,
    overflow: 'hidden',
    paddingBottom: runtime.insets.bottom,
    bottom: 0,
    right: 0,
    left: 0,
    shadowColor: theme.colors.gray900,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: -5 },
    shadowRadius: 5,
    elevation: 5,
    zIndex: 1
  },
  tabBarPressable: {
    height: 66,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.white100,
    paddingHorizontal: theme.spacing.sp10,
  },
  tabBarText: {
    color: theme.colors.gray900,
    fontSize: theme.text.size.s2,
    fontFamily: theme.text.fontMedium
  }
}));
