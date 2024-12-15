import { FC } from 'react';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { TextView } from '../text/text';
import { FontAwesome } from '@expo/vector-icons';


interface IBadgeProps {
  children?: React.ReactNode;
  width?: number;
  radius?: number;
}
export const Badge: FC<IBadgeProps> = ({ children, radius = 10, width = 205 }) => {
  const { styles, theme } = useStyles(stylesheet);
  return (
    <View style={[styles.badge, { maxWidth: width, borderRadius: radius }]}>
      <FontAwesome name='map-marker' size={16} color={theme.colors.gray900} />
      <TextView ellipsis={true}>{children}</TextView>
    </View>
  );
};


const stylesheet = createStyleSheet((theme) => ({
  badge: {
    flexDirection: 'row',
    gap: theme.spacing.sp1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: theme.spacing.sp4,
    right: theme.spacing.sp4 * 2.2,
    backgroundColor: theme.colors.white70,
    shadowColor: theme.colors.gray900,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 1,
    paddingHorizontal: theme.spacing.sp2,
    paddingVertical: 2
  }
}));
