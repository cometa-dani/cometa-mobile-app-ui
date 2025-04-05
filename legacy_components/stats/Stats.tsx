import { FC } from 'react';
import { Text, View, useColors } from '../Themed';
import { profileStyles } from '../profile/profileStyles';


interface Props {
  totalEvents: number,
  totalFriends: number
}

export const AppStats: FC<Props> = ({ totalEvents, totalFriends }) => {
  const { gray500 } = useColors();
  return (
    < View style={profileStyles.stats} >
      <View>
        <Text style={profileStyles.statsNumber}>
          {totalEvents}
        </Text>
        <Text style={{ color: gray500 }}>events</Text>
      </View>
      <View>
        <Text style={profileStyles.statsNumber}>
          {totalFriends}
        </Text>
        <Text style={{ color: gray500 }}>friends</Text>
      </View>
    </View >
  );
};
