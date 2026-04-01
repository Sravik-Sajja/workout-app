import { LineChart } from 'react-native-gifted-charts';
import { useColorScheme, ScrollView } from 'react-native';
import { Colors } from '../constants/Colors';

const SPACING = 50;
const MIN_WIDTH = 260;

const ThemedLineChart = ({ data, ...props }) => {
  const colorScheme = useColorScheme() || 'light';
  const theme = Colors[colorScheme];

  const minValue = Math.min(...data.map(d => d.value));
  const yAxisOffset = Math.floor(minValue * 0.9);

  const chartWidth = Math.max(MIN_WIDTH, data.length * SPACING);
  const isScrollable = chartWidth > MIN_WIDTH;

  return (
    <ScrollView
      horizontal
      scrollEnabled={isScrollable}
      showsHorizontalScrollIndicator={isScrollable}
    >
      <LineChart
        data={data}
        width={chartWidth}
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
        spacing={SPACING}
        {...props}
      />
    </ScrollView>
  );
};

export default ThemedLineChart;