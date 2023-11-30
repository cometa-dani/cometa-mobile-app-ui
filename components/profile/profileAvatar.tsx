import { FC } from 'react';
import { Image } from 'react-native';
import { View, useColors, Text } from '../Themed';
import { profileStyles } from './profileStyles';


interface Props {
  avatar?: string,
  name: string,
  biography: string
}

export const AppProfileAvatar: FC<Props> = ({ avatar, biography, name }) => {
  const { gray500 } = useColors();
  return (
    <View style={profileStyles.avatarFigure}>
      {avatar ? (
        <Image style={profileStyles.avatar} source={{ uri: avatar }} />
      ) : (
        <View style={profileStyles.avatar} />
      )}

      <Text style={profileStyles.title}>
        {name}
      </Text>

      <Text style={{ color: gray500, padding: 0 }}>
        {biography}
      </Text>

    </View>
  );
};
