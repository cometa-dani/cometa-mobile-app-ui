import { FC } from 'react';
import { buttonsStyleSheet } from '@/styles/buttonsStyles';
import { createStyleSheet, UnistylesRuntime, useStyles } from 'react-native-unistyles';
import { useCometaStore } from '@/store/cometaStore';
import { BottomSheetView } from '@gorhom/bottom-sheet';
import { Center, HStack, VStack } from '@/components/utils/stacks';
import { Heading } from '@/components/text/heading';
import { FlatList, Pressable, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { AntDesign, FontAwesome6 } from '@expo/vector-icons';


interface IProps {
  onNextStep: () => void;
}

export const UploadYouPhotosForm: FC<IProps> = ({ onNextStep }) => {
  const { styles } = useStyles(uploadYourPhotosSheet);
  const { styles: buttonsStyles, theme } = useStyles(buttonsStyleSheet);
  const setOnboardingState = useCometaStore(state => state.setOnboarding);

  return (
    <>
      <BottomSheetView>
        <Center styles={{
          paddingTop: theme.spacing.sp12,
          paddingBottom: theme.spacing.sp2
        }}>
          <Heading size='s7'>Upload your Photos</Heading>
        </Center>
      </BottomSheetView>
      <BottomSheetView
        style={{
          paddingVertical: theme.spacing.sp8,
          paddingHorizontal: theme.spacing.sp10,
          gap: theme.spacing.sp12
        }}>

        <VStack gap={theme.spacing.sp2}>
          <Pressable style={({ pressed }) => styles.mainImageViewer(pressed)}>
            <Image />
            <FontAwesome6 name="add" size={theme.icons.md} color={theme.colors.gray300} />
            <View style={styles.imageNum}>
              <Text style={styles.imageNumText}>{1}</Text>
            </View>
          </Pressable>
          <FlatList
            data={[1, 2, 3, 4, 5, 6]} // replace with your actual data
            numColumns={3}
            columnWrapperStyle={{ gap: theme.spacing.sp2 }}
            contentContainerStyle={{ gap: theme.spacing.sp2 }}
            renderItem={({ item, index }) => (
              <Pressable style={({ pressed }) => styles.imageViewer(pressed)}>
                <Image />
                <FontAwesome6 name="add" size={theme.icons.md} color={theme.colors.gray300} />

                <View style={styles.imageNum}>
                  <Text style={styles.imageNumText}>{index + 2}</Text>
                </View>
              </Pressable>
            )}
            keyExtractor={(item) => item.toString()}
          />
        </VStack>

        <HStack
          v='center'
          h='center'
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
          <Pressable
            onPress={() => onNextStep()}
            // onPress={formProps.handleSubmit(handleNext)}
            style={({ pressed }) => buttonsStyles.buttonRed(pressed)}
          >
            {({ pressed }) => (
              <Text style={buttonsStyles.buttonRedText(pressed)}>
                Next
              </Text>
            )}
          </Pressable>
        </View>
      </BottomSheetView>
    </>
  );
};


const uploadYourPhotosSheet = createStyleSheet((theme) => ({
  mainImageViewer: (isPressed: boolean) => ({
    aspectRatio: 2.4,
    borderWidth: 2,
    backgroundColor: isPressed ? theme.colors.white80 : theme.colors.white100,
    borderColor: theme.colors.gray100,
    borderStyle: 'dashed',
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center'
  }),
  imageViewer: (isPressed: boolean) => ({
    position: 'relative',
    flex: 1,
    aspectRatio: 1.05,
    borderWidth: 2,
    backgroundColor: isPressed ? theme.colors.white80 : theme.colors.white100,
    borderColor: theme.colors.gray100,
    borderStyle: 'dashed',
    borderRadius: theme.radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  }),
  imageNum: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: theme.colors.white70,
    shadowColor: theme.colors.gray900,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 1,
    borderRadius: 9999,
    width: theme.spacing.sp7,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  imageNumText: {
    color: theme.colors.gray900,
    fontFamily: theme.text.fontSemibold,
    fontSize: theme.text.size.s2
  }
}));
