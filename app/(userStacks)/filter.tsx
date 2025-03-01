import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { FC, ReactNode } from 'react';
import { TextView } from '@/components/text/text';
import { createStyleSheet, useStyles } from 'react-native-unistyles';
import { EventCategory } from '@/models/Event';
import { useCometaStore } from '@/store/cometaStore';
import Checkbox from 'expo-checkbox';
import { FormProvider, useForm } from 'react-hook-form';
import { SelectField } from '@/components/input/selectField';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { FieldText } from '@/components/input/textField';
import Slider from '@react-native-community/slider';
import { Button } from '@/components/button/button';
import { tabBarHeight } from '@/components/tabBar/tabBar';


const filterOptions = [
  EventCategory.EDUCATIONAL,
  EventCategory.CULTURAL,
  EventCategory.SPORTS,
  EventCategory.PARTY,
  EventCategory.CINEMA,
  EventCategory.SHOWS,
  EventCategory.GALLERY,
  EventCategory.PARK,
  EventCategory.EXHIBITION,
  EventCategory.MUSEUM,
  EventCategory.THEATRE,
  EventCategory.FESTIVAL,
  EventCategory.CAFE,
  EventCategory.CLUB,
  EventCategory.RESTAURANT,
  EventCategory.CONCERT,
  EventCategory.BRUNCH,
];

type IFormValues = {
  date?: string;
  location?: string;
  distance?: number;
}

const validationSchema = Yup.object<IFormValues>().shape({
  date: Yup.string().optional(),
  location: Yup.string().optional(),
  distance: Yup.number().optional(),
});

const defaultValues: IFormValues = {
  date: '',
  location: '',
  distance: 5,
};

export default function FilterScreen(): ReactNode {
  const router = useRouter();
  const { theme } = useStyles(styleSheet);
  const formProps = useForm({
    defaultValues,
    resolver: yupResolver<IFormValues>(validationSchema),
  });
  const storedSearchFilters = useCometaStore(state => state.searchFilters);
  const setStoredSearchFilters = useCometaStore(state => state.AddOrDeleteSearchFilter);

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerBackTitle: '',
          headerTitle: 'Filter'
        }}
      />
      <ScrollView style={{
        paddingVertical: theme.spacing.sp4,
        paddingHorizontal: theme.spacing.sp8,
        backgroundColor: theme.colors.white100,
      }}>
        <FormProvider  {...formProps}>
          <View style={{ flex: 1, flexWrap: 'wrap', flexDirection: 'row' }}>
            {filterOptions.map((item, index) => (
              <Item
                key={index}
                title={item}
                isChecked={!!storedSearchFilters[item]}
                onSelectOption={setStoredSearchFilters}
              />
            ))}
          </View>

          <View style={{ gap: theme.spacing.sp6, marginTop: theme.spacing.sp4 }}>
            <SelectField
              disabled={true}
              initialValue='qatar'
              options={[
                { label: 'Qatar', value: 'qatar' },
                // { label: 'French', value: 'fr' },
              ]}
            />
            <View>
              <TextView style={{ fontSize: theme.text.size.s4 }}>
                Distance
              </TextView>
              <Slider
                disabled={true}
                style={{ width: 'auto', height: 40 }}
                value={30}
                minimumValue={0}
                maximumValue={100}
                minimumTrackTintColor={theme.colors.blue100}
                maximumTrackTintColor={theme.colors.gray200}
              />
            </View>
            <FieldText
              isDateTimePicker={true}
              label='Date'
              name='date'
              placeholder='Enter your date'
              editable={false}
              defaultErrMessage={'Birthday is required'}
            />
            <Button
              style={{
                marginTop: theme.spacing.sp10,
                marginBottom: tabBarHeight * 3
              }}
              variant='primary'
              onPress={formProps.handleSubmit(() => router.back())}
            >
              Apply
            </Button>
          </View>
        </FormProvider>
      </ScrollView>
    </>
  );
}


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
  },
  option: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.spacing.sp4,
    height: 50,
    width: '50%',
  },
  titleContainer: {
    alignItems: 'center',
    gap: 8
  }
}));


interface ItemProps {
  title: EventCategory;
  isChecked: boolean;
  onSelectOption: (category: EventCategory) => void;
}

const Item: FC<ItemProps> = ({ title, isChecked, onSelectOption }) => {
  const { styles, theme } = useStyles(styleSheet);
  return (
    <TouchableOpacity
      onPress={() => onSelectOption(title)}
      style={styles.option}
    >
      <Checkbox
        style={styles.checkbox}
        value={isChecked}
        color={isChecked ? theme.colors.red100 : undefined}
      />
      <View style={styles.titleContainer}>
        <Text>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
