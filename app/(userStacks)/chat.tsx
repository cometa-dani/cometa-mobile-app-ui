/* eslint-disable react/prop-types */
import { ReactNode, useCallback, useState } from 'react';
import { AvatarProps, Bubble, BubbleProps, GiftedChat, IMessage, InputToolbar, InputToolbarProps, Send } from 'react-native-gifted-chat';
import { View, RefreshControl, Platform, TextInput } from 'react-native';
import { Stack, useGlobalSearchParams } from 'expo-router';
import { HeaderBackButton } from '@react-navigation/elements';
import { Image } from 'expo-image';
import { Entypo, Feather } from '@expo/vector-icons';
import { useCometaStore } from '@/store/cometaStore';
import { Condition } from '@/components/utils/ifElse';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { HStack } from '@/components/utils/stacks';
import { useMessages } from '@/queries/chat/useMessages';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GradientHeading } from '@/components/text/gradientText';

// type ChatWithFriendMessage = Map<string | number, UserMessagesData>
// const take = 20;

export default function ChatWithFriendScreen(): ReactNode {
  const { theme, styles } = useStyles(styleSheet);
  const { friendshipId } = useGlobalSearchParams<{ friendshipId: string }>();
  const targetUser = useCometaStore(state => state.targetUser);
  const currentUser = useCometaStore(state => state.userProfile);
  const { messages, sendMessage } = useMessages(+friendshipId);
  const [isLoadingMore] = useState(false);

  const onSendMessage = useCallback(async (messages: IMessage[] = []) => {
    try {
      const senderMessage = messages[0];
      const messagePayload = {
        ...senderMessage,
        sent: true,
        received: false,
        user: {
          _id: currentUser?.id,
        }
      } as IMessage;
      sendMessage(messagePayload);
      // if (friendshipData?.chatuuid && loggedInUser && targetUser) {
      //   setMessages(prevMap => {
      //     const prevMapCopy = new Map(prevMap);
      //     prevMapCopy.set(messagePayload._id.toString(), messagePayload);
      //     return prevMapCopy;
      //   });
      //   await chatWithFriendService.writeMessage(
      //     friendshipData.chatuuid,
      //     { ...messagePayload, sent: true },
      //     loggedInUser,
      //     targetUser
      //   );
      // }
    }
    catch {
      return null;
    }
  }, [currentUser?.id]);

  const handleRefreshControl = () => { };

  // when the user has an unviewed new message
  // useFocusEffect(useCallback(() => {
  // if (messagesList.length) {
  //   const lastMessage = messagesList.at(-1);
  //   if (
  //     loggedInUserUuid !== lastMessage?.user?._id
  //     && lastMessage
  //     && !lastMessage?.received
  //     && friendshipData?.chatuuid
  //     && targetUser
  //   ) {
  //     chatWithFriendService.setMessageAsViewed(
  //       friendshipData?.chatuuid,
  //       loggedInUserUuid,
  //       targetUser,
  //       lastMessage,
  //       messagesList.filter(message => !message.received) ?? []
  //     );
  //   }
  // }
  // }, [messages]));

  const renderAvatar = useCallback((props: AvatarProps<IMessage>) => {
    const { currentMessage } = props;
    const { user } = currentMessage;
    const { _id } = user;
    const isCurrentUser = _id === currentUser?.id;
    const source = (
      isCurrentUser ?
        currentUser?.photos.at(0)?.url : targetUser?.photos.at(0)?.url
    );
    const placeholder = (
      isCurrentUser ?
        currentUser?.photos.at(0)?.placeholder : targetUser?.photos.at(0)?.placeholder
    );
    return (
      <Image
        style={styles.avatarImg}
        source={{ uri: source }}
        placeholder={{ thumbhash: placeholder }}
      />
    );
  }, [currentUser?.id, targetUser?.id]);

  const renderBubbleMessage = useCallback((props: BubbleProps<IMessage>) => {
    return (
      <Bubble
        {...props}
        user={props.user}
        renderTicks={(message) => (
          <Condition
            if={message.user._id == currentUser?.id}
            then={(
              <>
                <Entypo
                  name="check"
                  size={13.6}
                  color={theme.colors.white100} // TODO: when message is received=true, change the color to blue100
                />
                <Entypo
                  style={{ marginLeft: -6 }}
                  name="check"
                  size={13.6}
                  color={theme.colors.white100} // TODO: when message is received=true, change the color to blue100
                />
              </>
            )}
          />
        )}
        key={props.currentMessage?._id}
        textStyle={{
          right: styles.bubleTextStyleRight,
          left: styles.bubleTextStyleLeft
        }}
        wrapperStyle={{
          right: styles.bubleWrapperStyleRight,
          left: styles.bubleWrapperStyleLeft
        }}
      />
    );
  }, []);  // TODO:  when message is received=true, change the bubble color to blue100

  const renderInputToolbar = useCallback((_props: InputToolbarProps<IMessage>) => {
    return (
      <InputToolbar
        {..._props}
        renderSend={(props) => (
          <Send {...props} containerStyle={styles.inputToolbarSendContainer}>
            <Feather name="send" size={22} color={theme.colors.white100} />
          </Send>
        )}
        renderComposer={(props) => (
          <TextInput
            {...props}
            onChangeText={props.onTextChanged}
            value={props.text}
            style={styles.inputToolbarComposer}
            placeholder="Your message here..."
          />
        )}
        containerStyle={styles.inputToolbarContainer}
      />
    );
  }, []);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          header: (props) => {
            return (
              <SafeAreaView
                edges={{ bottom: 'off', top: 'additive' }}
                style={styles.headerSafeAreaView}
              >
                <View style={styles.headerView}>
                  <HeaderBackButton
                    onPress={() => props?.navigation?.goBack()}
                    style={styles.headerBackButton}
                  />
                  <HStack $x='center' $y='center' styles={{ gap: theme.spacing.sp1, flex: 1 }}>
                    <Image
                      style={styles.headerImg}
                      source={{ uri: targetUser?.photos.at(0)?.url }}
                      placeholder={{ thumbhash: targetUser?.photos.at(0)?.placeholder }}
                    />
                    <GradientHeading styles={[{ fontSize: theme.text.size.s6 }]}>
                      {targetUser?.name}
                    </GradientHeading>
                  </HStack>
                </View>
              </SafeAreaView>
            );
          },
        }}
      />
      <SafeAreaView
        edges={{ top: 'off', bottom: 'additive' }}
        style={{ flex: 1, backgroundColor: theme.colors.white100 }}
      >
        <GiftedChat
          messages={messages}
          onSend={(messages) => onSendMessage(messages)}
          showUserAvatar={true}
          // onLoadEarlier={() => {}}   // for loading more messages
          user={{
            _id: currentUser?.id ?? '',
            name: currentUser?.username ?? '',
            avatar: currentUser?.photos[0]?.url ?? ''
          }}
          scrollToBottom={true}
          loadEarlier={true}
          isStatusBarTranslucentAndroid={true}
          listViewProps={{
            refreshControl: (
              <RefreshControl
                refreshing={isLoadingMore}
                onRefresh={handleRefreshControl}
              />
            )
          }}
          alwaysShowSend={true}
          inverted={false}
          bottomOffset={-10}
          renderBubble={renderBubbleMessage}
          renderInputToolbar={renderInputToolbar}
          renderAvatar={renderAvatar}
        />
      </SafeAreaView>
    </>
  );
}


const styleSheet = createStyleSheet((theme) => ({
  headerSafeAreaView: {
    backgroundColor: theme.colors.white90,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.gray100
  },
  headerView: {
    height: Platform.select({ ios: 46, android: 60 }),
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative'
  },
  headerBackButton: {
    position: 'absolute',
    alignSelf: 'center',
    left: Platform.select({ ios: 12, android: 0 })
  },
  headerImg: {
    aspectRatio: 1,
    borderRadius: 99_999,
    height: 36,
    width: 36
  },
  bubleTextStyleLeft: {
    color: theme.colors.gray500,
    fontFamily: theme.text.fontRegular,
    fontSize: theme.text.size.s4
  },
  bubleTextStyleRight: {
    color: theme.colors.gray500,
    fontFamily: theme.text.fontRegular,
    fontSize: theme.text.size.s4
  },
  bubleWrapperStyleRight: {
    backgroundColor: '#B7EEFF',
    padding: 3,
    borderRadius: 18,
    minWidth: '50%',
    maxWidth: '85%'
  },
  bubleWrapperStyleLeft: {
    backgroundColor: theme.colors.white100,
    padding: 3,
    borderRadius: 18,
    borderColor: theme.colors.gray100,
    borderWidth: 1.4
  },
  inputToolbarSendContainer: {
    backgroundColor: theme.colors.red100,
    borderRadius: 99_999,
    width: 46,
    height: 46,
    justifyContent: 'center',
    alignItems: 'center'
  },
  inputToolbarComposer: {
    flex: 1,
    fontFamily: theme.text.fontRegular,
    fontSize: theme.text.size.s4,
    backgroundColor: theme.colors.slate75,
    paddingHorizontal: 20,
    borderRadius: 25,
    height: 50,
    marginRight: 16
  },
  inputToolbarContainer: {
    paddingTop: 10,
    marginLeft: 16,
    marginRight: 16,
    borderWidth: 0,
    shadowColor: 'transparent',
    borderTopWidth: 0,
    display: 'flex',
    justifyContent: 'center',
    borderRadius: 25,
  },
  avatarImg: {
    aspectRatio: 1,
    borderRadius: 99_999,
    height: 30,
    width: 30
  },
  avatarName: {
    marginBottom: -2,
    textTransform: 'capitalize'
  }
}));
