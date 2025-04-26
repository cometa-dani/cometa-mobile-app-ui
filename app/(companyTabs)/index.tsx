import { TextView } from '@/components/text/text';
import { useQueryGetCompanyProfile } from '@/queries/organization/organizationHooks';
import { View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';


export default function HomeScreen() {
  const { styles } = useStyles(stylesheet);
  const { data: companyProfile } = useQueryGetCompanyProfile();
  return (
    <>
      <View style={styles.container}>
        <TextView>Dashboard</TextView>
      </View>
    </>
  );
}

const stylesheet = createStyleSheet((theme, rt) => ({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
}));
