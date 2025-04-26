import { Button } from '@/components/button/button';
import { SelectField } from '@/components/input/selectField';
import { FieldText } from '@/components/input/textField';
import { IPhotoPlaceholder } from '@/components/onboarding/photosGrid/photoGrid';
import { PhotosGrid2 } from '@/components/onboarding/photosGrid/photoGrid2';
import { tabBarHeight } from '@/components/tabBar/tabBar';
import { Heading } from '@/components/text/heading';
import { TextView } from '@/components/text/text';
import { VStack } from '@/components/utils/stacks';
import { categoriesOptions } from '@/constants/categories';
import { EventCategory } from '@/models/Event';
import Checkbox from 'expo-checkbox';
import { FC, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { createStyleSheet, useStyles } from 'react-native-unistyles';

interface IFormValues {
  name: string;
  date: string;
  locationId: number;
  categories: string[];
}

export default function PostsScreen() {
  const { theme } = useStyles();
  const formProps = useForm({
    defaultValues: {
      name: '',
      date: '',
      locationId: -1,
      categories: [],
    },
    // resolver: yupResolver<IFormValues>(validationSchema),
  });

  const handlePhotosPickUp = (photos: IPhotoPlaceholder[]) => {
    console.log(photos);
    // const filteredPhotos = photos.filter(isFromFileSystem);
  };

  const handleCreateEvent = (values: IFormValues) => {
    console.log({ values });
  };

  return (
    <>
      <FormProvider  {...formProps}>
        <KeyboardAwareScrollView
          showsVerticalScrollIndicator={false}
          bottomOffset={theme.spacing.sp10}
          bounces={false}
          style={{ flex: 1 }}
          contentContainerStyle={{
            padding: theme.spacing.sp6,
            gap: theme.spacing.sp8,
            paddingBottom: tabBarHeight * 3
          }}
        >
          <VStack gap={theme.spacing.sp2}>
            <Heading size='s5' style={{ fontFamily: theme.text.fontSemibold }}>
              Select a Photo
            </Heading>
            <PhotosGrid2
              mode='create'
              onSelect={handlePhotosPickUp}
              maxPhotos={3}
              isHorizontal={true}
            />
          </VStack>

          <VStack gap={theme.spacing.sp2}>
            <Heading size='s5' style={{ fontFamily: theme.text.fontSemibold }}>
              Pick a Date
            </Heading>
            <FieldText
              isDateTimePicker={true}
              label='Date'
              name='date'
              placeholder='Enter event date'
              iconName='calendar-o'
              editable={false}
              defaultErrMessage={'Please enter a valid date'}
            />
          </VStack>

          <VStack gap={theme.spacing.sp2}>
            <Heading size='s5' style={{ fontFamily: theme.text.fontSemibold }}>
              Event Name
            </Heading>
            <FieldText
              label='Event Name'
              name='name'
              placeholder='Enter event name'
              iconName='pencil'
              editable={false}
              defaultErrMessage={'Please enter a valid date'}
            />
          </VStack>

          <VStack gap={theme.spacing.sp2}>
            <Heading size='s5' style={{ fontFamily: theme.text.fontSemibold }}>
              Select a Location
            </Heading>
            <SelectField
              initialValue='eng'
              options={[
                { label: 'English', value: 1 },
                { label: 'French', value: 2 },
                { label: 'Spanish', value: 3 },
              ]}
            />
          </VStack>

          <VStack gap={theme.spacing.sp2}>
            <Heading size='s5' style={{ fontFamily: theme.text.fontSemibold }}>
              Select a Category
            </Heading>
            <View style={{
              flex: 1,
              flexWrap: 'wrap',
              flexDirection: 'row',
              paddingHorizontal: theme.spacing.sp2
            }}>
              {categoriesOptions.map((item, index) => (
                <Item
                  key={index}
                  title={item}
                />
              ))}
            </View>
          </VStack>

          <Button
            variant='primary'
            onPress={formProps.handleSubmit(handleCreateEvent)}
          >
            Create Event
          </Button>
        </KeyboardAwareScrollView>
      </FormProvider>
    </>
  );
}


interface ItemProps {
  title: EventCategory;
  isChecked?: boolean;
  onSelectOption?: (category: EventCategory) => void;
}

const Item: FC<ItemProps> = ({ title, isChecked, onSelectOption }) => {
  const { styles, theme } = useStyles(styleSheet);
  return (
    <TouchableOpacity
      // onPress={() => onSelectOption(title)}
      style={styles.option}
    >
      <Checkbox
        style={styles.checkbox}
        value={isChecked}
        color={isChecked ? theme.colors.red100 : undefined}
      />
      <View style={styles.titleContainer}>
        <TextView>
          {title}
        </TextView>
      </View>
    </TouchableOpacity>
  );
};


const styleSheet = createStyleSheet((theme) => ({
  city: {
    flex: 1,
    flexDirection: 'row',
    height: theme.spacing.sp22,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  checkbox: {
    borderRadius: 5,
    pointerEvents: 'none',
  },
  option: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.sp2,
    paddingVertical: theme.spacing.sp2,
    width: '50%',
  },
  titleContainer: {
    alignItems: 'center',
    gap: 8
  }
}));
