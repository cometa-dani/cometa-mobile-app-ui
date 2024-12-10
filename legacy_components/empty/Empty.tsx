import { TouchableOpacity } from 'react-native-gesture-handler';
import { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { Heading } from '@/components/text/heading';
import { TextView } from '@/components/text/text';


interface Props {
  onPress?: () => void
  title: string,
  subtitle?: string
}

export const EmptyMessage: FC<Props> = ({ onPress, title, subtitle }) => (
  <View style={styles.notFoundContainer}>
    <Heading size='s6'>
      {title}
    </Heading>

    <TouchableOpacity
      style={{ alignItems: 'center' }}
      onPress={onPress}
    >
      <TextView>
        {subtitle}
      </TextView>
    </TouchableOpacity>
  </View>
);


const styles = StyleSheet.create({
  notFoundContainer: {
    alignItems: 'center',
    flex: 1,
    gap: 12,
    justifyContent: 'center'
  },
});
