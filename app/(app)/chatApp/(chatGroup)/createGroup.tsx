import { StyleSheet, SafeAreaView, TextInput, Image, View as TransparentView } from 'react-native';
import { Text, View } from '../../../../components/Themed';
import { BaseButton, TouchableOpacity } from 'react-native-gesture-handler';
import { Stack, router } from 'expo-router';
import { FontAwesome5 } from '@expo/vector-icons';
import { blue_100, red_100 } from '../../../../constants/colors';
import { FlashList } from '@shopify/flash-list';
import { useCometaStore } from '../../../../store/cometaStore';
import { defaultImgPlaceholder } from '../../../../constants/vars';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useMemo, useRef } from 'react';
import { UserMessagesData } from '../../../../store/slices/messagesSlices';
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import { If } from '../../../../components/utils';
import { AppLabelFeedbackMsg } from '../../../../components/textInput/AppTextInput';
import * as ImagePicker from 'expo-image-picker';


type Value = { name: string }

const validationSchemma = Yup.object<Value>({
  name: Yup.string().required('Required group name'),
});

export default function CreateChatGroupScreen(): JSX.Element {
  const chatGroupMembers = useCometaStore(state => state.chatGroupMembers);
  const setChatGroupMembers = useCometaStore(state => state.setChatGroupMembers);
  const imageRef = useCometaStore(state => state.imageRef);
  const setImageRef = useCometaStore(state => state.setImageRef);
  const formikRef = useRef<FormikProps<Value>>(null);

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
              onSubmit={(values) => console.log(values)}
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
                    <FontAwesome5 style={styles.checkbox} name="user-check" size={20} color="black" />
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

  checkbox: {
    borderRadius: 5,
    zIndex: 10,
    position: 'absolute',
    right: 0,
    alignSelf: 'center'
  },

  safeArea: {
    flex: 1
  },
  mainView: {
    flex: 1
  },
  innerView: {
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  relativeView: {
    position: 'relative',
    alignItems: 'center',
    gap: 20,
    backgroundColor: '#F2F2F2',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    flexDirection: 'row'
  },
  // input: {
  //   backgroundColor: '#F4F4F4',
  //   borderRadius: 50,
  //   paddingVertical: 10,
  //   paddingHorizontal: 20,
  //   paddingLeft: 56
  // },
  // pressable: {
  //   position: 'absolute',
  //   zIndex: 30,
  //   left: 20,
  //   backgroundColor: blue_100,
  //   borderRadius: 50,
  //   padding: 4.4
  // },
  baseButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 24
  },
  transparentView1: {
    flexDirection: 'row',
    gap: 20,
    alignItems: 'center',
    flex: 1,
  },
  transparentView2: {
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden'
  },
  image: {
    width: 60,
    height: 60
  },
  transparentView3: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexGrow: 1,
    position: 'relative',
    height: '100%',
    gap: 14
  },
  // messagesCount: {
  //   backgroundColor: messages.ok,
  //   width: 22,
  //   height: 22,
  //   borderRadius: 50,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  //   alignSelf: 'center'
  // },
  // messagesCountText: {
  //   color: '#fff',
  //   fontWeight: '900',

  // },
  textBold: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  textGray: {
    color: 'gray'
  },
  // transparentView4: {
  //   alignSelf: 'center',
  //   gap: 4,
  //   height: '100%'
  // }
});
