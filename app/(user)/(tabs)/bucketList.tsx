import { Text, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';


export default function BucketListScreen() {
  const { styles } = useStyles(stylesheet);
  return (
    <>
      <View style={styles.container}>
        <Text>Bucket List</Text>
      </View>
    </>
  );
}

const stylesheet = createStyleSheet((theme, rt) => ({
  container: {
    // backgroundColor: theme.colors.white100,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
}));
