import { Button } from '@/components/button/button';
import { Heading } from '@/components/text/heading';
import { Center, HStack, VStack } from '@/components/utils/stacks';
import { AntDesign } from '@expo/vector-icons';
import { FC } from 'react';
import { Modal, TouchableOpacity, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';


interface IProps {
  open: boolean;
  onClose: () => void,
  onUnFollow: () => void
}
export const UnFollowModal: FC<IProps> = ({ onClose, open, onUnFollow }) => {
  const { styles, theme } = useStyles(stylesheet);
  return (
    <Modal
      transparent={true}
      statusBarTranslucent={true}
      visible={open}
      animationType='fade'
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.modal}>
          <HStack $x='flex-end' $y='center'>
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
            >
              <AntDesign
                name="closecircle"
                size={theme.icons.md}
                color={theme.colors.gray900}
              />
            </TouchableOpacity>
          </HStack>
          <VStack
            gap={theme.spacing.sp6}
            styles={{ marginTop: theme.spacing.sp8 }}
          >
            <Center>
              <Heading size='s7'>
                Are you sure you want to unfollow this profile?
              </Heading>
            </Center>

            <HStack $x='center' gap={theme.spacing.sp2} >
              <Button
                style={{ flex: 1 / 2 }}
                onPress={onClose}
                variant='gray-alt'
              >
                Cancel
              </Button>
              <Button
                style={{ flex: 1 / 2 }}
                onPress={onUnFollow}
                variant='primary'
              >
                Unfollow
              </Button>
            </HStack>
          </VStack>
        </View>
      </View>
    </Modal>
  );
};


const stylesheet = createStyleSheet((theme, runtime) => ({
  avatarContainer: {
    shadowColor: theme.colors.white100,
    shadowOffset: {
      width: 12,
      height: 10,
    },
    shadowOpacity: 0.8,
    shadowRadius: 30,
    elevation: 20,
    position: 'relative',
  },
  avatar: {
    aspectRatio: 1,
    borderColor: theme.colors.red100,
    borderRadius: 99_9999,
    overflow: 'hidden',
    borderWidth: 2,
    height: 120,
  },
  img: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0
  },
  backdrop: {
    flex: 1,
    backgroundColor: theme.colors.backDrop,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.sp7,
    paddingBottom: runtime.insets.bottom,
  },
  modal: {
    backgroundColor: theme.colors.white100,
    padding: theme.spacing.sp10,
    width: '100%',
    borderRadius: theme.radius.md,
    position: 'relative',
  }
}));
