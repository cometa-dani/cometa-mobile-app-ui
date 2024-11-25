import { FC } from 'react';
import { Text, View } from '../Themed';
import { IGetDetailedUserProfile } from '../../models/User';
import { calAge } from '../../helpers/calcAge';
import { FontAwesome } from '@expo/vector-icons';
import { If } from '../utils/ifElse';
import ContentLoader, { Rect } from 'react-content-loader/native';

const width = 300;
const height = 34;

const SkeletonLoader: FC = () => (
  <ContentLoader
    speed={1}
    width={width}
    height={height}
    viewBox={`0 0 ${width} ${height}`}
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
  >
    <Rect x="6" y="0" rx="6" ry="6" width="140" height="12" />
    <Rect x="6" y="18" rx="6" ry="6" width="100" height="12" />
  </ContentLoader>
);

interface ProfileHeaderProps {
  userProfile?: IGetDetailedUserProfile;
  isLoading?: boolean;
}

export const ProfileTitle: FC<ProfileHeaderProps> = ({ userProfile, isLoading = false }) => {
  return (
    <View>
      <If condition={isLoading || !userProfile}
        render={<SkeletonLoader />}
        elseRender={(
          <>
            <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
              <Text>
                <Text size='xl'>{userProfile?.name}, </Text>
                <Text size='xl'>{userProfile?.birthday && calAge(new Date(userProfile?.birthday)) || 26}</Text>
              </Text>
            </View>
            <If condition={userProfile?.occupation}
              render={(
                <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                  <FontAwesome size={20} name='briefcase' />
                  <Text style={{ color: 'gray', fontWeight: '600', fontSize: 18 }}>{userProfile?.occupation}</Text>
                </View>
              )}
            />
          </>
        )}
      />
    </View>
  );
};
