import { FC, ReactNode } from 'react';
import { Text, View } from 'react-native';
import { AppButton } from '../buttons/buttons';
import { profileStyles } from './profileStyles';
import { StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';


interface BadgesProps {
  items: ReactNode[],
  title: string,
  iconName: React.ComponentProps<typeof FontAwesome>['name'];
}

export const Badges: FC<BadgesProps> = ({ items, title, iconName }) => {
  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        {iconName && <FontAwesome name={iconName} size={20} />}
        <Text style={profileStyles.title}>{title}:</Text>
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

const badgesStyles = StyleSheet.create({
  badge: {
    alignItems: 'center', justifyContent: 'center', minWidth: 'auto'
  }
});
