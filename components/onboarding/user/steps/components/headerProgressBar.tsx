import { ProgressBar } from '@/components/progressBar/progressBar';
import { Heading } from '@/components/text/heading';
import { VStack } from '@/components/utils/stacks';
import { FC } from 'react';
import { useStyles } from 'react-native-unistyles';


interface IProps {
  activePage: number,
  title: string
}
export const HeaderProgressBar: FC<IProps> = ({ activePage, title }) => {
  const { theme } = useStyles();
  return (
    <VStack
      gap={theme.spacing.sp11}
      $x='center'
      styles={{
        paddingHorizontal: theme.spacing.sp10,
        paddingBottom: theme.spacing.sp10
      }}>
      <ProgressBar
        height={6}
        value={(activePage) * 33.3333}
      />
      <Heading size='s7'>{title}</Heading>
    </VStack>
  );
};
