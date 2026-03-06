import { LineChart } from 'react-native-gifted-charts';
import { useColorScheme } from 'react-native';
import { Colors } from '../constants/Colors';

const ThemedLineChart = ({ data, ...props }) => {
  const colorScheme = useColorScheme() || 'light';
  const theme = Colors[colorScheme];

  const minValue = Math.min(...data.map(d => d.value));
  const yAxisOffset = Math.floor(minValue * 0.9);

  return (
    <LineChart
      data={data}
      width={260}
      height={240}
      color={Colors.primary}
      thickness={3}
      dataPointsColor={Colors.primary}
      dataPointsRadius={5}
      curved
      areaChart
      startFillColor={Colors.primary}
      endFillColor={Colors.primary}
      startOpacity={0.3}
      endOpacity={0.05}
      yAxisColor={theme.text + '40'}
      xAxisColor={theme.text + '40'}
      yAxisTextStyle={{ color: theme.text, fontSize: 11 }}
      xAxisLabelTextStyle={{ color: theme.text, fontSize: 10 }}
      yAxisOffset={yAxisOffset}
      initialSpacing={17}
      yAxisLabelWidth={45}
      formatYLabel={(value) => Math.round(value).toString()}
      noOfSections={5}
      spacing={50}
      {...props}
    />
  );
};

export default ThemedLineChart;