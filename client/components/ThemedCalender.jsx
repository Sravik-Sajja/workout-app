import { Calendar } from 'react-native-calendars';
import { useColorScheme } from 'react-native';
import { Colors } from '../constants/Colors';

const ThemedCalendar = ({ markedDates, selectedDate, ...props }) => {
  const colorScheme = useColorScheme() || 'light';
  const theme = Colors[colorScheme];

  return (
    <Calendar
      markedDates={{
        ...markedDates,
        [selectedDate]: {
          ...markedDates?.[selectedDate],
          selected: true,
          selectedColor: Colors.primary
        }
      }}
      theme={{
        backgroundColor: 'transparent',
        calendarBackground: 'transparent',
        textSectionTitleColor: theme.text,
        selectedDayBackgroundColor: Colors.primary,
        selectedDayTextColor: theme.title,
        todayTextColor: Colors.primary,
        dayTextColor: theme.title,
        textDisabledColor: theme.text + '30',
        arrowColor: Colors.primary,
        monthTextColor: theme.title,
        textMonthFontWeight: '700',
        textDayFontSize: 14,
        textMonthFontSize: 16,
      }}
      {...props}
    />
  );
};

export default ThemedCalendar;