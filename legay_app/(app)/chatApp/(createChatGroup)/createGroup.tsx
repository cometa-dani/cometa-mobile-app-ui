import { StyleSheet, SafeAreaView, TextInput, Image, View as TransparentView } from 'react-native';
import { Text, View } from '../../../../legacy_components/Themed';
import { BaseButton, TouchableOpacity } from 'react-native-gesture-handler';
import { Stack, router } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { blue_100, gray_900, red_100 } from '../../../../constants/colors';
import { FlashList } from '@shopify/flash-list';
import { useCometaStore } from '../../../../store/cometaStore';
import { defaultImgPlaceholder } from '../../../../constants/vars';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMemo, useRef } from 'react';
import { UserMessagesData } from '../../../../store/slices/messagesSlices';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import * as Yup from 'yup';
import { If } from '../../../../legacy_components/utils';
import { AppLabelFeedbackMsg } from '../../../../legacy_components/textInput/AppTextInput';
import * as ImagePicker from 'expo-image-picker';
import { useMutationCreateChatGroup } from '../../../../queries/currentUser/chatGroupsHooks';
import uuid from 'react-native-uuid';
import { IChatGroup } from '../../../../models/ChatGroup';
import chatWithGroupService from '../../../../services/chatWithGroupService';


type Value = { name: string }

const validationSchemma = Yup.object<Value>({
  name: Yup.string().required('required group name'),
});

export function CreateChatGroupScreen(): JSX.Element {
  const chatGroupMembers = useCometaStore(state => state.chatGroupMembers);
  const setChatGroupMembers = useCometaStore(state => state.setChatGroupMembers);
  const imageRef = useCometaStore(state => state.imageRef);
  const setImageRef = useCometaStore(state => state.setImageRef);
  const formikRef = useRef<FormikProps<Value>>(null);
  const loggedInUserUUID = useCometaStore(state => state.uid);
  const createChatGroup = useMutationCreateChatGroup();

  const memoizedSearchedFriendsData: UserMessagesData[] = useMemo(() => (
    [...chatGroupMembers.values()]
  ), [chatGroupMembers.size]);


  // No permissions request is necessary for launching the image library
  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 4],
        quality: 1,
      });
      if (!result.canceled) {
        setImageRef({ url: result.assets[0].uri, uuid: result.assets[0].uri });
      }
    }
    catch (error) {
      // console.log(error);
    }
  };


  const handleCreateGroup = async (values: Value, actions: FormikHelpers<Value>) => {
    try {
      // 1 create the group in database
      const chatGroupMembersUUIDs = chatGroupMembers.keys();
      const res = await createChatGroup.mutateAsync({ groupName: values.name, members: [...chatGroupMembersUUIDs, loggedInUserUUID] }) as IChatGroup;

      // 2 create the group in firebase
      const groupUUID = res?.id;
      const messagePayload = {
        _id: uuid.v4().toString(),
        text: 'Bienvenidos al grupo',
        createdAt: new Date().toString(),
        user: {
          _id: loggedInUserUUID,
        }
      };
      const chatGroupInfo = { uuid: groupUUID, name: res?.name ?? '', photo: res?.photo?.url ?? '' };

      if (loggedInUserUUID) {
        await chatWithGroupService.addMembers(groupUUID, [...chatGroupMembersUUIDs, loggedInUserUUID]);
        await chatWithGroupService.writeMessage(messagePayload, loggedInUserUUID, [...chatGroupMembersUUIDs], chatGroupInfo);
        router.push(`/chatGroup/${groupUUID}`);
      }
      actions.setSubmitting(false);
    }
    catch (error) {
      // con
    }
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'New group',
          headerTitleAlign: 'center',
          headerRight() {
            return (
              <TouchableOpacity
                style={{ marginRight: 16 }}
                onPress={() => formikRef.current?.handleSubmit()}
              >
                <Text style={{ fontSize: 17, fontWeight: '700', color: red_100 }}>Create</Text>
              </TouchableOpacity>
            );
          },
        }}
      />
      <View style={styles.mainView}>
        <View style={styles.innerView}>
          <View style={styles.relativeView}>

            <BaseButton
              onPress={handlePickImage}
              style={{ backgroundColor: '#545454', borderRadius: 16, width: 68, height: 68, alignItems: 'center', justifyContent: 'center' }}
            >
              <If
                condition={imageRef?.url}
                render={(
                  <Image
                    source={{ uri: imageRef.url }}
                    style={{ width: 68, height: 68, borderRadius: 16 }}
                  />
                )}
                elseRender={(
                  <MaterialCommunityIcons
                    name="camera-plus-outline"
                    size={50}
                    color={blue_100}
                  />
                )}
              />
            </BaseButton>

            <Formik
              style={{ width: '100%', flex: 1 }}
              innerRef={formikRef}
              onSubmit={handleCreateGroup}
              validationSchema={validationSchemma}
              initialValues={{ name: '' }}
            >
              {({ touched, errors, handleBlur, handleChange, values }) => (
                <TransparentView style={{ position: 'relative', width: '100%' }}>
                  <TextInput
                    style={{ width: '100%' }}
                    keyboardType="ascii-capable"
                    onChangeText={handleChange('name')}
                    onBlur={handleBlur('name')}
                    value={values.name}
                    placeholder='Nombre del grupo'
                  />
                  <If
                    condition={touched.name && errors.name}
                    render={(
                      <TransparentView style={{ top: -23 }}>
                        <AppLabelFeedbackMsg text={errors.name} />
                      </TransparentView>
                    )}
                  />
                </TransparentView>
              )}
            </Formik>
          </View>
        </View>

        <FlashList
          data={memoizedSearchedFriendsData}
          estimatedItemSize={100}
          renderItem={({ item }) => {
            return (
              <BaseButton
                onPress={() => setChatGroupMembers(item)}
                style={styles.baseButton}
              >
                <TransparentView style={styles.transparentView1}>

                  <TransparentView style={styles.transparentView2}>
                    <Image
                      source={{ uri: item.user?.avatar?.toString() ?? defaultImgPlaceholder }}
                      style={styles.image}
                    />
                  </TransparentView>

                  <TransparentView style={styles.transparentView3}>
                    <TransparentView>
                      <Text
                        numberOfLines={1}
                        ellipsizeMode='tail'
                        style={styles.textBold}
                      >
                        {item.user.name}
                      </Text>
                      <Text
                        numberOfLines={1}
                        ellipsizeMode='tail'
                        style={styles.textGray}
                      >
                        {item.text}
                      </Text>
                    </TransparentView>
                    <FontAwesome5 style={styles.checkbox} name="user-check" size={20} color={gray_900} />
                  </TransparentView>
                </TransparentView>
              </BaseButton>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  baseButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 20
  },

  checkbox: {
    alignSelf: 'center',
    borderRadius: 5,
    position: 'absolute',
    right: 0,
    zIndex: 10
  },
  image: {
    height: 60,
    width: 60
  },
  innerView: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  mainView: {
    flex: 1
  },
  relativeView: {
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    borderRadius: 16,
    flexDirection: 'row',
    gap: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    position: 'relative'
  },
  safeArea: {
    flex: 1
  },
  textBold: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  textGray: {
    color: 'gray'
  },
  transparentView1: {
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1,
    gap: 20,
  },
  transparentView2: {
    borderRadius: 30,
    height: 60,
    overflow: 'hidden',
    width: 60
  },
  transparentView3: {
    flexDirection: 'row',
    flexGrow: 1,
    gap: 14,
    height: '100%',
    justifyContent: 'space-between',
    position: 'relative'
  },
});
