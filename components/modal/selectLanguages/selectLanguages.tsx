import { ActivityIndicator, TextInput, TouchableOpacity, View } from 'react-native';
import { Stack } from 'expo-router';
import { FlashList } from '@shopify/flash-list';
import { FC, ReactNode, useEffect, useRef, useState } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import { useQueryGetAllLanguages } from '../../../queries/currentUser/editProfileHooks';
import Checkbox from 'expo-checkbox';
import { Heading } from '@/components/text/heading';
import { TextView } from '@/components/text/text';
import { Condition } from '@/components/utils/ifElse';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Center, HStack } from '@/components/utils/stacks';
import { MAXIMUN_LANGUAGES, useSelectLanguages } from './hook';
import { SearchField } from '@/components/input/searchField';
import { KeyboardEvents } from 'react-native-keyboard-controller';


export function SelectLanguages(): ReactNode {
  const { theme } = useStyles(styleSheet);
  const [inputValue, setInputValue] = useState('');
  const { selectedLanguages, setSelectedLanguages } = useSelectLanguages();
  const { data = [], isFetched } = useQueryGetAllLanguages();
  const filteredLanguagesData = data.filter(lang => lang?.toLowerCase().includes(inputValue?.toLowerCase()));
  const listRef = useRef<FlashList<string>>(null);
  const [isFirstItemVisible, setIsFirstItemVisible] = useState(true);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (!isFirstItemVisible) return;
    const show = KeyboardEvents.addListener('keyboardWillShow', (e) => {
      listRef.current?.scrollToIndex({ index: 0, animated: true });
      setTimeout(() => {
        inputRef.current?.focus();
      }, 500);
    });
    const hide = KeyboardEvents.addListener('keyboardWillHide', () => {
      listRef.current?.scrollToOffset({ offset: -20, animated: true });
    });
    return () => {
      hide.remove();
      show.remove();
    };
  }, [isFirstItemVisible]);

  const renderItem = ({ item, index }: { item: string, index: number }) => (
    <Condition
      if={index === 0}
      then={(
        <HStack gap={theme.spacing.sp4} $y='center' styles={{
          paddingHorizontal: theme.spacing.sp8,
          paddingVertical: theme.spacing.sp4,
          backgroundColor: theme.colors.white100,
          zIndex: 10,
        }}>
          <SearchField
            ref={inputRef}
            onSearch={setInputValue}
            placeholder='Search for a language'
          />
          <HStack $x='flex-end' styles={{ width: theme.spacing.sp14 }}>
            <TextView bold={true}>{selectedLanguages.length} / {MAXIMUN_LANGUAGES}</TextView>
          </HStack>
        </HStack>
      )}
      else={(
        <LanguageItem
          onCheck={setSelectedLanguages}
          isChecked={selectedLanguages.includes(item)}
          language={item}
        />
      )}
    />
  );

  return (
    <>
      <Stack.Screen
        options={{
          headerTitleAlign: 'center',
          headerTitle: 'Your languages',
          animation: 'default',
        }}
      />
      <View style={{ flex: 1, flexGrow: 1 }}>
        <Condition
          if={isFetched}
          then={(
            <Condition
              if={data.length === 0}
              then={(
                <TextView style={{ padding: theme.spacing.sp8, textAlign: 'center' }}>
                  No cities found
                </TextView>
              )}
              else={
                <FlashList
                  ref={listRef}
                  data={[''].concat(filteredLanguagesData)}
                  bounces={false}
                  estimatedItemSize={theme.spacing.sp20}
                  stickyHeaderIndices={[0]}
                  contentContainerStyle={{ padding: theme.spacing.sp8 }}
                  onViewableItemsChanged={({ viewableItems, changed }) => {
                    const firstItem = viewableItems[0];
                    if (firstItem?.index !== 0) {
                      setIsFirstItemVisible(false);
                    }
                    else {
                      setIsFirstItemVisible(true);
                    }
                  }}
                  ListHeaderComponent={() => (
                    <View style={{
                      gap: 12,
                      paddingTop: theme.spacing.sp8,
                      paddingHorizontal: theme.spacing.sp8,
                      backgroundColor: theme.colors.white100
                    }}>
                      <Heading size='s6'>What Languages do you know?</Heading>
                      <TextView>
                        We&apos;ll show these on your profile
                        and use them to connect you with great
                        matches who know your language.
                      </TextView>
                    </View>
                  )}
                  ListFooterComponentStyle={{ height: theme.spacing.sp11 * 10 }} // 280px height
                  renderItem={renderItem}
                />
              }
            />
          )}
          else={(
            <Center styles={{ flex: 1 }}>
              <ActivityIndicator
                size="large"
                style={{ marginTop: -theme.spacing.sp8 }}
                color={theme.colors.red100}
              />
            </Center>
          )}
        />
      </View>
    </>
  );
}


const styleSheet = createStyleSheet((theme, runtime) => ({
  checkbox: {
    borderRadius: 6,
  },
  language: {
    height: theme.spacing.sp22,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8
  }
}));


interface LanguageItemProps {
  language: string;
  isChecked: boolean;
  onCheck: (language: string) => void;
}
const LanguageItem: FC<LanguageItemProps> = ({ language, onCheck, isChecked }) => {
  const { styles, theme } = useStyles(styleSheet);
  return (
    <TouchableOpacity
      onPress={() => onCheck(language)}
      style={styles.language}
    >
      <View style={styles.titleContainer}>
        <FontAwesome name='language' size={20} />
        <TextView>
          {language}
        </TextView>
      </View>

      <Checkbox
        style={styles.checkbox}
        value={isChecked}
        onValueChange={() => onCheck(language)}
        color={isChecked ? theme.colors.blue100 : undefined}
      />
    </TouchableOpacity>
  );
};
