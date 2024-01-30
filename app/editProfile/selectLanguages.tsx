import { StyleSheet, Text as TransparentText, View as TransparentView } from 'react-native';
import { Text, View } from '../../components/Themed';
import { Stack } from 'expo-router';
import { animationDuration } from '../../constants/vars';
import { FlashList } from '@shopify/flash-list';
import { FC, useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { useQueryGetAllLanguages } from '../../queries/editProfileHooks';
import { gray_50, gray_900 } from '../../constants/colors';
import ContentLoader, { Rect } from 'react-content-loader/native';
import Checkbox from 'expo-checkbox';
import { AppButton } from '../../components/buttons/buttons';
import { AppTextInput } from '../../components/textInput/AppTextInput';
import { RectButton } from 'react-native-gesture-handler';
import { If } from '../../components/helpers/ifElse';


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

const MAXIMUN_LANGUAGES = 5;


interface Props {
  onSelectLanguages: (languages: string[]) => void;
}

export function SelectLanguages({ onSelectLanguages }: Props): JSX.Element {
  const [inputValue, setInputValue] = useState('');
  const [selectedLanguages, setSelectLanguages] = useState<string[]>([]);
  const { data = [], isLoading } = useQueryGetAllLanguages();
  const filteredLanguagesData = data.filter(
    lang => lang?.toLowerCase().includes(inputValue?.toLowerCase())
  );

  const handleLanguageSelection = (language: string) => {
    setSelectLanguages(removeOrAddLanguage);

    /**
     *
     * @param {string[]} selectedLanguages  maximum 5 languages
     * @returns
     */
    function removeOrAddLanguage(selectedLanguages: string[]) {
      const isIncluded = selectedLanguages.includes(language);
      const isExceeding = selectedLanguages.length === MAXIMUN_LANGUAGES;

      if (isIncluded) {
        return selectedLanguages.filter(lang => lang !== language); // remove
      }
      else if (!isIncluded && isExceeding) {
        return selectedLanguages; // do nothing
      }
      else {
        return selectedLanguages.concat(language); // add
      }
    }
  };

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
            data={[''].concat(filteredLanguagesData)}
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
                <If
                  condition={index === 0}
                  render={(
                    <View style={{ padding: 20, zIndex: 1 }}>
                      <AppTextInput
                        iconName='search'
                        onChangeText={setInputValue}
                        value={inputValue}
                        placeholder='Search for a language'
                      />
                    </View>
                  )}
                  elseRender={(
                    <>
                      <LanguageItem
                        onCheck={handleLanguageSelection}
                        isChecked={selectedLanguages.includes(item)}
                        language={item}
                      />
                      <View style={{ height: 0.6, backgroundColor: gray_50, marginHorizontal: 20 }} />
                    </>
                  )}
                />
              </View>
            )}
          />
        }

        <View style={styles.buttonContainer}>
          <AppButton
            onPress={() => onSelectLanguages(selectedLanguages)}
            btnColor='black'
            text={`Save (${selectedLanguages.length}/5)`}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  language: {
    height: 70,
    width: '100%',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },

  languageContainer: {
    justifyContent: 'center',
  },

  checkbox: {
    borderRadius: 5,
    zIndex: 10,
    position: 'absolute',
    right: 20,
  },

  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    justifyContent: 'center',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: gray_50
  },

  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  }
});


interface LanguageItemProps {
  language: string;
  isChecked: boolean;
  onCheck: (language: string) => void;
}

const LanguageItem: FC<LanguageItemProps> = ({ language, onCheck, isChecked }) => {
  return (
    <TransparentView style={styles.languageContainer}>
      <RectButton
        onPress={() => onCheck(language)}
        style={styles.language}
      >
        <TransparentView style={styles.titleContainer}>
          <FontAwesome name='language' size={20} />
          <TransparentText style={{ fontWeight: '700' }}>
            {language}
          </TransparentText>
        </TransparentView>
      </RectButton>

      <Checkbox
        style={styles.checkbox}
        value={isChecked}
        onValueChange={() => onCheck(language)}
        color={isChecked ? gray_900 : undefined}
      />
    </TransparentView>
  );
};
