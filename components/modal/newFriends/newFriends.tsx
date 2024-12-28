import { Heading } from '@/components/text/heading';
import { TextView } from '@/components/text/text';
import { Center, HStack, VStack } from '@/components/utils/stacks';
import { imageTransition } from '@/constants/vars';
import { useCometaStore } from '@/store/cometaStore';
import { AntDesign } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { FC } from 'react';
import { Modal, Pressable, TouchableOpacity, View } from 'react-native';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { create } from 'zustand';


export const NewFriendsModal: FC = () => {
  const { styles, theme } = useStyles(stylesheet);
  const { toggle, onToggle } = useNewFriendsModal();
  const targetUser = useCometaStore(state => state.targetUser);
  const currentUser = useCometaStore(state => state.userProfile);
  const currentEvent = useCometaStore(state => state.likedEvent);
  return (
    <Modal
      transparent={true}
      statusBarTranslucent={true}
      visible={toggle}
      animationType='fade'
      onRequestClose={onToggle}
    >
      <Pressable style={styles.backdrop}>
        <View style={styles.modal}>
          <HStack $x='flex-end' $y='center'>
            <TouchableOpacity
              onPress={onToggle}
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
              <Heading size='s8'>
                You&apos;ve made
              </Heading>
              <Heading size='s8'>
                a match 😍
              </Heading>
            </Center>

            <HStack $x='center' styles={styles.avatarContainer}>
              <View style={[
                styles.avatar,
                { marginRight: -theme.spacing.sp4, zIndex: 10, position: 'relative' }
              ]}>
                <Image
                  style={styles.img}
                  contentFit='cover'
                  transition={imageTransition}
                  source={{ uri: currentUser?.photos?.at(0)?.url }}
                  placeholder={{ thumbhash: currentUser?.photos?.at(0)?.placeholder }}
                />
              </View>
              <View style={styles.avatar}>
                <Image
                  style={styles.img}
                  contentFit='cover'
                  transition={imageTransition}
                  source={{ uri: targetUser?.photos?.at(0)?.url }}
                  placeholder={{ thumbhash: targetUser?.photos?.at(0)?.placeholder }}
                />
              </View>
            </HStack>

            <TextView>
              Write to <TextView bold={true}>{targetUser?.name}</TextView> to meet at
              <TextView bold={true}> {currentEvent?.name} </TextView>
              and <TextView bold={true}> 3 other</TextView> places in common.
            </TextView>
          </VStack>
        </View>
      </Pressable>
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
  imgBackground: {
    flex: 1,
    position: 'relative',
  },
  linearGradientTop: {
    position: 'absolute',
    top: 0,
    height: 310,
    width: '100%'
  },
  linearGradient: {
    position: 'absolute',
    bottom: 0,
    height: 290,
    width: '100%',
    justifyContent: 'flex-end'
  },
  buttonsContainer: {
    padding: theme.spacing.sp10,
    paddingBottom: theme.spacing.sp18 + runtime.insets.bottom
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
    position: 'relative',
    width: '100%',
    backgroundColor: theme.colors.blue100,
    padding: theme.spacing.sp10,
    borderRadius: theme.radius.md,
    minHeight: 300,
  },
  logo: {
    width: 48,
    aspectRatio: 1
  }
}));


type NewFriendsSlice = {
  toggle: boolean;
  onToggle: () => void;
};

export const useNewFriendsModal = create<NewFriendsSlice>((set, get) => ({
  toggle: false,
  onToggle: () => set({ toggle: !get().toggle }),
}));
