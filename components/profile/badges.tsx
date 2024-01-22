import { FC, ReactNode } from 'react';
import { Text, View } from 'react-native';
import { AppButton } from '../buttons/buttons';
import { profileStyles } from './profileStyles';
import { StyleSheet } from 'react-native';


interface BadgesProps {
  items: ReactNode[],
  title: string
}

export const Badges: FC<BadgesProps> = ({ items, title }) => {
  return (
    <View>
      <Text style={profileStyles.title}>{title}:</Text>

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
