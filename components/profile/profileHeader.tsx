import { FC } from 'react';
import { Text, View } from '../Themed';
import { GetDetailedUserProfile } from '../../models/User';
import { calAge } from '../../helpers/calcAge';
import { FontAwesome } from '@expo/vector-icons';


interface ProfileHeaderProps {
  userProfile?: GetDetailedUserProfile;
}

export const ProfileHeader: FC<ProfileHeaderProps> = ({ userProfile }) => {
  if (!userProfile) return null;

  return (
    <View>
      <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
        {/* <FontAwesome size={16} name='user-circle-o' /> */}
        <Text>
          <Text style={{ fontSize: 18, fontWeight: '800' }}>{userProfile?.name}, </Text>
          <Text style={{ fontSize: 18, fontWeight: '800' }}>{userProfile?.birthday && calAge(new Date(userProfile?.birthday)) || 26}</Text>
        </Text>
      </View>
      <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
        <FontAwesome size={16} name='briefcase' />
        <Text style={{ color: 'gray', fontWeight: '600' }}>{userProfile?.occupation || 'Software Engineer'}</Text>
      </View>
    </View>
  );
};
