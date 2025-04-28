import { Button } from '@/components/button/button';
import { SelectField } from '@/components/input/selectField';
import { FieldText } from '@/components/input/textField';
import { IPhotoPlaceholder } from '@/components/onboarding/photosGrid/photoGrid';
import { isFromFileSystem, PhotosGrid2 } from '@/components/onboarding/photosGrid/photoGrid2';
import { tabBarHeight } from '@/components/tabBar/tabBar';
import { Heading } from '@/components/text/heading';
import { TextView } from '@/components/text/text';
import { HStack, VStack } from '@/components/utils/stacks';
import { categoriesOptions } from '@/constants/categories';
import { EventCategory } from '@/models/Event';
import { useQueryGetLocations } from '@/queries/organization/locationHooks';
import { Feather } from '@expo/vector-icons';
import Checkbox from 'expo-checkbox';
import { router } from 'expo-router';
import { FC, useState } from 'react';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';
import { TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { Controller } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutateCreateEvent, useMutationUploadEventsPhotos } from '@/queries/organization/eventHooks';
import { Notifier } from 'react-native-notifier';
import { ErrorToast, InfoToast, SucessToast } from '@/components/toastNotification/toastNotification';


interface ICreateEventForm {
  name: string;
  date: string;
  locationId: number;
  categories: string[];
  description: string;
}

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required('Event name is required')
    .min(3, 'Event name must be at least 3 characters')
    .max(100, 'Event name must not exceed 100 characters'),

  date: Yup.string().optional(),

  locationId: Yup.number()
    .required('Location is required')
    .min(1, 'Please select a valid location')
    .typeError('Please select a location'),

  categories: Yup.array()
    .of(Yup.string())
    .min(1, 'Please select at least one category')
    .required('At least one category is required'),

  description: Yup.string()
    .required('Description is required')
    .min(3, 'Description must be at least 3 characters')
    .max(1000, 'Description must not exceed 1000 characters'),
}) as Yup.ObjectSchema<ICreateEventForm>;


export default function PostsScreen() {
  const { theme } = useStyles();
  const { data: locations } = useQueryGetLocations();
  const createEvent = useMutateCreateEvent();
  const uploadPhotos = useMutationUploadEventsPhotos();
  const [pickedPhotos, setPickedPhotos] = useState<IPhotoPlaceholder[]>([]);
  const [isMutating, setIsMutating] = useState(false);
  const formProps = useForm({
    defaultValues: {
      name: '',
      date: '',
      locationId: -1,
      categories: [],
      description: '',
    },
    resolver: yupResolver(validationSchema),
  });

  const handleCreateEvent = async (values: ICreateEventForm) => {
    try {
      setIsMutating(true);
      Notifier.showNotification({
        title: 'Saving...',
        description: 'your event is being saved',
        Component: InfoToast,
      });
      if (pickedPhotos.length === 0) {
        Notifier.showNotification({
          title: 'Error',
          description: 'Please add at least one photo',
          Component: ErrorToast,
        });
        return;
      }
      const createdEvent = await createEvent.mutateAsync({
        name: values.name,
        date: values.date,
        locationId: values.locationId,
        categories: values.categories as EventCategory[],
        description: values.description,
      });
      formProps.reset();
      if (createdEvent?.id) {
        try {
          await uploadPhotos.mutateAsync({
            eventId: createdEvent.id,
            pickedImgFiles: pickedPhotos.filter(isFromFileSystem),
          });
          Notifier.hideNotification();
          Notifier.showNotification({
            title: 'Done',
            description: 'your event was saved successfully',
            Component: SucessToast,
          });
          setPickedPhotos([]);
        } catch (uploadError) {
          Notifier.showNotification({
            title: 'Warning',
            description: 'Event created but photos failed to upload. Please try adding photos later.',
            Component: ErrorToast,
          });
        }
      }
    } catch (error) {
      Notifier.hideNotification();
      Notifier.showNotification({
        title: 'Error',
        description: 'something went wrong, try again',
        Component: ErrorToast,
      });
    }
    finally {
      setIsMutating(false);
    }
  };

  return (
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
            onSelect={setPickedPhotos}
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
            editable={false}
            label='Date'
            name='date'
            placeholder='Enter event date'
            iconName='calendar-o'
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
            defaultErrMessage={'Please enter a valid name'}
          />
        </VStack>

        <VStack gap={theme.spacing.sp2}>
          <Heading size='s5' style={{ fontFamily: theme.text.fontSemibold }}>
            Description
          </Heading>
          <FieldText
            label='Description'
            multiline={true}
            name='description'
            placeholder='Enter your description'
            iconName='text-height'
            defaultErrMessage={'Please enter a valid description'}
          />
        </VStack>

        <VStack gap={theme.spacing.sp2}>
          <HStack $x='space-between'>
            <Heading size='s5' style={{ fontFamily: theme.text.fontSemibold }}>
              Select a Location
            </Heading>
            <TouchableOpacity
              onPress={() => router.push('/(companyStacks)/locations')}
              style={{ flexDirection: 'row', gap: theme.spacing.sp1, alignItems: 'center' }}
            >
              <TextView>
                Add New
              </TextView>
              <Feather
                size={theme.spacing.sp9}
                name='plus-circle'
                color={theme.colors.gray400}
              />
            </TouchableOpacity >
          </HStack>
          <Controller
            name="locationId"
            control={formProps.control}
            render={({ field: { onChange, value } }) => (
              <SelectField
                initialValue={value}
                onValueChange={onChange}
                options={
                  locations?.map((location) => ({
                    label: location.name,
                    value: location.id
                  })) || []
                }
              />
            )}
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
          showLoading={isMutating}
          variant='primary'
          onPress={formProps.handleSubmit(handleCreateEvent)}
        >
          Create Event
        </Button>
      </KeyboardAwareScrollView>
    </FormProvider>
  );
}


interface ItemProps {
  title: EventCategory;
}

const Item: FC<ItemProps> = ({ title }) => {
  const { styles, theme } = useStyles(styleSheet);
  const { setValue, watch } = useFormContext();
  const categories = watch('categories') as string[];
  const isChecked = categories.includes(title);

  const handleToggle = () => {
    const newCategories = isChecked
      ? categories.filter(cat => cat !== title)
      : [...categories, title];
    setValue('categories', newCategories, { shouldValidate: true });
  };

  return (
    <TouchableOpacity
      onPress={handleToggle}
      style={styles.option}
    >
      <Checkbox
        style={styles.checkbox}
        value={isChecked}
        onValueChange={handleToggle}
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
