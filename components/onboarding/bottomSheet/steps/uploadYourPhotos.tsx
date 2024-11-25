import { FC } from 'react';
import { UnistylesRuntime, useStyles } from 'react-native-unistyles';
import { useCometaStore } from '@/store/cometaStore';
import { BottomSheetView as BsView } from '@gorhom/bottom-sheet';
import { Center, HStack } from '@/components/utils/stacks';
import { Heading } from '@/components/text/heading';
import { Text, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { Button } from '@/components/button/button';
import { createEmptyPlaceholders, PhotosGrid } from '../photosGrid/photosGrid';
import { MAX_NUMBER_PHOTOS } from '@/constants/vars';


const setInitialPlaceholders = () => createEmptyPlaceholders(MAX_NUMBER_PHOTOS);


interface IProps {
  onNextStep: () => void;
}
export const UploadYouPhotosForm: FC<IProps> = ({ onNextStep }) => {
  const { theme } = useStyles();
  const setOnboardingState = useCometaStore(state => state.setOnboarding);

  return (
    <>
      <BsView>
        <Center styles={{
          paddingTop: theme.spacing.sp12,
          paddingBottom: theme.spacing.sp2
        }}>
          <Heading size='s7'>Upload your Photos</Heading>
        </Center>
      </BsView>
      <BsView
        style={{
          paddingVertical: theme.spacing.sp8,
          paddingHorizontal: theme.spacing.sp10,
          gap: theme.spacing.sp12
        }}>

        <PhotosGrid
          setInitialPhotos={setInitialPlaceholders}
          onSelect={(values) => { console.log(values); }}
        />

        <HStack
          $y='center'
          $x='center'
          gap={theme.spacing.sp1}
          styles={{
            paddingLeft: theme.spacing.sp8
          }}
        >
          <AntDesign
            name={'exclamationcircleo'}
            size={theme.icons.xs}
            color={theme.colors.blue100}
          />
          <Text style={{ color: theme.colors.blue100 }}>
            Add at least 4 photos
          </Text>
        </HStack>

        <View style={{ paddingBottom: UnistylesRuntime.insets.bottom }}>
          <Button variant='primary' onPressed={onNextStep}>
            Next
          </Button>
        </View>
      </BsView>
    </>
  );
};

