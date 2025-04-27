import { Button } from '@/components/button/button';
import { FieldText } from '@/components/input/textField';
import { tabBarHeight } from '@/components/tabBar/tabBar';
import { Heading } from '@/components/text/heading';
import { ErrorToast, InfoToast, SucessToast } from '@/components/toastNotification/toastNotification';
import { VStack } from '@/components/utils/stacks';
import { useMutationCreateLocation } from '@/queries/organization/locationHooks';
import { router } from 'expo-router';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { Notifier } from 'react-native-notifier';
import { useStyles } from 'react-native-unistyles';


interface IFormValues {
  name: string;
  mapUrl: string;
}

export default function CreateLocations() {
  const { theme } = useStyles();
  const createLocation = useMutationCreateLocation();
  const [isMutating, setIsMutating] = useState(false);
  const formProps = useForm({
    defaultValues: {
      name: '',
      mapUrl: '',
    },
  });

  const handleCreateLocation = async (values: IFormValues) => {
    try {
      setIsMutating(true);
      Notifier.showNotification({
        title: 'Saving...',
        description: 'your location is being saved',
        Component: InfoToast,
      });
      if (router.canDismiss()) {
        router.dismiss();
      }
      await createLocation.mutateAsync(values);
      Notifier.hideNotification();
      Notifier.showNotification({
        title: 'Done',
        description: 'your location was saved successfully',
        Component: SucessToast,
      });
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
          padding: theme.spacing.sp7,
          gap: theme.spacing.sp8,
          paddingBottom: tabBarHeight * 3
        }}
      >
        <VStack gap={theme.spacing.sp2}>
          <Heading size='s5' style={{ fontFamily: theme.text.fontSemibold }}>
            Pick a Location
          </Heading>
          <FieldText
            label='Map location'
            name='mapUrl'
            placeholder='Enter map url'
            iconName='map-marker'
            defaultErrMessage={'Please enter a valid url'}
          />
        </VStack>

        <VStack gap={theme.spacing.sp2}>
          <Heading size='s5' style={{ fontFamily: theme.text.fontSemibold }}>
            Location Name
          </Heading>
          <FieldText
            label='Location Name'
            name='name'
            placeholder='Enter location name'
            iconName='pencil'
            defaultErrMessage={'Please enter a valid name'}
          />
        </VStack>

        <Button
          showLoading={isMutating}
          variant='primary'
          onPress={formProps.handleSubmit(handleCreateLocation)}
        >
          Create Location
        </Button>
      </KeyboardAwareScrollView>
    </FormProvider>
  );
}
