import { TouchableOpacity } from 'react-native-gesture-handler';
import { Text, View } from '../Themed';
import { FC } from 'react';
import { StyleSheet } from 'react-native';


interface Props {
  onPress?: () => void
  title: string,
  subtitle?: string
}

export const EmptyMessage: FC<Props> = ({ onPress, title, subtitle }) => (
  <View style={styles.notFoundContainer}>
    <Text style={{ fontWeight: '600', fontSize: 18, textAlign: 'center' }}>
      {title}
    </Text>

    <TouchableOpacity
      style={{ alignItems: 'center' }}
      onPress={onPress}
    >
      <Text style={{ fontSize: 14, marginTop: 6 }}>
        {subtitle}
      </Text>
    </TouchableOpacity>
  </View>
);


const styles = StyleSheet.create({
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12
  },
});
