import { StyleSheet, TextInput, Pressable } from 'react-native';
import { BaseButton, ScrollView } from 'react-native-gesture-handler';
import { Text, View } from '../../components/Themed';
import { Stack } from 'expo-router';
import { animationDuration } from '../../constants/vars';
import { FlashList } from '@shopify/flash-list';
import { FC, useRef, useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { useQueryGetAllLanguages } from '../../queries/editProfileHooks';
import { gray_50, gray_900, red_100 } from '../../constants/colors';
import ContentLoader, { Rect } from 'react-content-loader/native';
import ExpoCheckbox from 'expo-checkbox/build/ExpoCheckbox';
import Checkbox from 'expo-checkbox';
import { AppButton } from '../../components/buttons/buttons';
import { AppTextInput } from '../../components/textInput/AppTextInput';


const FadingLoader = () => {
  return (
    <View>
      <FadingLoaderCard1 />
      <FadingLoaderCard2 />
      <FadingLoaderCard3 />
      <FadingLoaderCard4 />
      <FadingLoaderCard5 />
    </View>
  );
};

const FadingLoaderCard1 = () => {
  return (
    <ContentLoader
      width={400}
      height={40}
      backgroundColor="#ababab"
      foregroundColor="#fafafa"
    >
      <Rect x="70" y="15" rx="5" ry="5" width="300" height="15" />
      <Rect x="70" y="39" rx="5" ry="5" width="220" height="9" />
      <Rect x="20" y="10" rx="0" ry="0" width="40" height="40" />
    </ContentLoader>
  );
};

const FadingLoaderCard2 = () => {
  return (
    <ContentLoader
      width={400}
      height={40}
      backgroundColor="#bfbfbf"
      foregroundColor="#fafafa"
    >
      <Rect x="70" y="15" rx="5" ry="5" width="300" height="15" />
      <Rect x="70" y="39" rx="5" ry="5" width="220" height="9" />
      <Rect x="20" y="10" rx="0" ry="0" width="40" height="40" />
    </ContentLoader>
  );
};

const FadingLoaderCard3 = () => {
  return (
    <ContentLoader
      width={400}
      height={40}
      backgroundColor="#dadada"
      foregroundColor="#fafafa"
    >
      <Rect x="70" y="15" rx="5" ry="5" width="300" height="15" />
      <Rect x="70" y="39" rx="5" ry="5" width="220" height="9" />
      <Rect x="20" y="10" rx="0" ry="0" width="40" height="40" />
    </ContentLoader>
  );
};

const FadingLoaderCard4 = () => {
  return (
    <ContentLoader
      width={400}
      height={40}
      backgroundColor="#ececec"
      foregroundColor="#fafafa"
    >
      <Rect x="70" y="15" rx="5" ry="5" width="300" height="15" />
      <Rect x="70" y="39" rx="5" ry="5" width="220" height="9" />
      <Rect x="20" y="10" rx="0" ry="0" width="40" height="40" />
    </ContentLoader>
  );
};

const FadingLoaderCard5 = () => {
  return (
    <ContentLoader
      width={400}
      height={40}
      backgroundColor="#f7f7f7"
      foregroundColor="#fafafa"
    >
      <Rect x="70" y="15" rx="5" ry="5" width="300" height="15" />
      <Rect x="70" y="39" rx="5" ry="5" width="220" height="9" />
      <Rect x="20" y="10" rx="0" ry="0" width="40" height="40" />
    </ContentLoader>
  );
};

interface Props {
  // eslint-disable-next-line no-unused-vars
  onSelectLanguages: (language: string) => void;
}

export function SelectLanguages({ onSelectLanguages }: Props): JSX.Element {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<TextInput>(null);
  const { data, isFetching, isLoading } = useQueryGetAllLanguages();

  return (
    <>
      <Stack.Screen
        options={{
          presentation: 'fullScreenModal',
          headerTitleAlign: 'left',
          headerTitle: 'Your languages',
          animationDuration: animationDuration,
        }}
      />

      <View style={{ flex: 1 }}>
        {isLoading ?
          <FadingLoader />
          :
          <FlashList
            stickyHeaderHiddenOnScroll={true}
            stickyHeaderIndices={[0]}
            estimatedItemSize={70}
            data={[''].concat(data || [])}
            ListHeaderComponent={() => (
              <View style={{ gap: 12, paddingTop: 20, paddingHorizontal: 20 }}>
                <Text style={{ fontSize: 22, fontWeight: '700' }}>What Languages do you know?</Text>
                <Text>
                  We&apos;ll show these on your profile
                  and use them to connect you with great
                  matches who know your language.
                </Text>
              </View>
            )}
            renderItem={({ item, index }) => (
              <View key={index}>
                {index === 0 ?
                  <View style={{ padding: 20, zIndex: 1 }}>
                    <AppTextInput
                      iconName='search'
                      onChangeText={setInputValue}
                      value={inputValue}
                      placeholder='Search for a language'
                    />
                  </View>
                  :
                  <>
                    <LanguageItem language={item} />
                    <View style={{ height: 0.6, backgroundColor: gray_50, marginHorizontal: 20 }} />
                  </>
                }
              </View>
            )}
          />
        }

        <View style={{ justifyContent: 'center', padding: 20, borderTopWidth: 1, borderTopColor: gray_50 }}>
          <AppButton btnColor='black' text='Save' />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  language: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 70,
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  checkbox: {
    margin: 8,
    borderRadius: 5,
  },
});


interface LanguageItemProps {
  language: string;
}

const LanguageItem: FC<LanguageItemProps> = ({ language }) => {
  const [isChecked, setChecked] = useState(false);

  return (
    <View
      style={styles.language}
    >
      <View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={{ fontWeight: '700' }}>
            {language}
          </Text>
          <FontAwesome name='language' size={20} />
        </View>
      </View>
      <View>
        <Checkbox
          style={styles.checkbox}
          value={isChecked}
          onValueChange={setChecked}
          color={isChecked ? gray_900 : undefined}
        />
      </View>
    </View>
  );
};
