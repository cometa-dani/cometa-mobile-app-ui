import { FC } from 'react';
import { View } from '../Themed';
import { BaseButton } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import { Pressable } from 'react-native';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { IPhoto } from '../../models/Photo';
import { If } from '../utils';


interface CustomHeaderProps {
  user1?: IPhoto;
  user2?: IPhoto;
}

export const CustomHeader: FC<CustomHeaderProps> = ({ user1, user2 }) => {
  return (
    <View style={{ height: 84, zIndex: 1, position: 'relative', justifyContent: 'center', alignItems: 'flex-start' }} >
      <BaseButton
        onPress={() => router.back()}
        style={{ position: 'relative', top: 14, left: 16, borderRadius: 50, padding: 1 }}
      >
        <MaterialIcons name="arrow-back" size={25} color="black" />
      </BaseButton>

      <Pressable
        style={{
          position: 'absolute',
          top: 42,
          zIndex: 1000,
          alignSelf: 'center',
          flexDirection: 'row',
          gap: user2 && user1 ? -20 : 0
        }}
      >
        <If
          condition={user2 && user1}
          render={(
            <>
              <Image
                style={{
                  width: 76,
                  height: 76,
                  borderRadius: 50,
                }}
                placeholder={{ thumbhash: user1?.placeholder }}
                source={{ uri: user1?.url }}
              />
              <Image
                style={{
                  width: 76,
                  height: 76,
                  borderRadius: 50,
                }}
                placeholder={{ thumbhash: user2?.placeholder }}
                source={{ uri: user2?.url }}
              />
            </>
          )}
          elseRender={(
            <Image
              style={{
                width: 76,
                height: 76,
                borderRadius: 50,
              }}
              placeholder={{ thumbhash: user1?.placeholder }}
              source={{ uri: user1?.url }}
            />
          )}
        />
      </Pressable>
    </View>
  );
};
