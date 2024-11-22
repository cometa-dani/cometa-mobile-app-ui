import { FC, ReactNode } from 'react';
import { View } from 'react-native';
import { AppButton } from '../buttons/buttons';
// import { profileStyles } from './profileStyles';
import { StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Text } from '../Themed';


interface BadgesProps {
  items: ReactNode[],
  title: string,
  iconName: React.ComponentProps<typeof FontAwesome>['name'];
}

export const Badges: FC<BadgesProps> = ({ items, title, iconName }) => {
  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        {iconName && <FontAwesome name={iconName} size={20} />}
        <Text size='lg'>{title}:</Text>
      </View>

      <View style={{ flexWrap: 'wrap', flexDirection: 'row', gap: 16 }}>
        {items.map((item, index) => (
          <AppButton
            key={index}
            btnColor='white'
            style={badgesStyles.badge}
          >
            <Text>{item}</Text>
          </AppButton>
        ))}
      </View>
    </View>
  );
};

export const badgesStyles = StyleSheet.create({
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 'auto',
    textTransform: 'capitalize',
  }
});
