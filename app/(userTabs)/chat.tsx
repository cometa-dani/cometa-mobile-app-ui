import { Text, View } from 'react-native';
import { SystemBars } from 'react-native-edge-to-edge';
import { createStyleSheet, useStyles } from 'react-native-unistyles';


export default function ChatScreen() {
  const { styles } = useStyles(stylesheet);
  return (
    <>
      <SystemBars style='dark' />
      <View style={styles.container}>
        <Text>Chat</Text>
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
