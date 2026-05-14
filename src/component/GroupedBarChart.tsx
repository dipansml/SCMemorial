import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '../theme/colors';
import { FontFamily, FontSize } from '../theme/fonts_dimen';

type ChartItem = {
  subject: string;
  halfYearly: number;
  annual: number;
};

type Props = {
  data: ChartItem[];
};

type State = {
  hasError: boolean;
};

const MAX_VALUE = 100;

const clampToMax = (value: number) => Math.max(0, Math.min(value ?? 0, MAX_VALUE));

const SimpleBar = ({ value, color }: { value: number; color: string }) => {
  const safeValue = clampToMax(value);
  const percentage = (safeValue / MAX_VALUE) * 100;

  return (
    <View style={styles.singleBarBlock}>
      <Text style={styles.valueLabel}>{safeValue}</Text>
      <View
        style={[
          styles.bar,
          {
            height: `${percentage}%`,
            backgroundColor: color,
          },
        ]}
      />
    </View>
  );
};

class GroupedBarChart extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  componentDidCatch(error: Error) {
    console.warn('GroupedBarChart Error:', error);
    this.setState({ hasError: true });
  }

  render() {
    const { data } = this.props;
    const { hasError } = this.state;

    if (!data || data.length === 0) {
      return (
        <View style={styles.container}>
          <Text style={styles.emptyText}>No Data</Text>
        </View>
      );
    }

    if (hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.emptyText}>Unable to load chart</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.chartArea}>
          {data.map((item, index) => (
            <View key={`${item.subject}-${index}`} style={styles.subjectGroup}>
              <View style={styles.groupBarsRow}>
                <SimpleBar value={item.halfYearly ?? 0} color = {Colors.orange} />
                <SimpleBar value={item.annual ?? 0} color = {Colors.primary} />
              </View>
              <Text 
                style={styles.subjectName}
                numberOfLines={1}
              >
                {item.subject ?? ''}
              </Text>
              <Text style={styles.maxLabel}>{MAX_VALUE}</Text>
            </View>
          ))}
        </View>

        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: Colors.orange}]} />
            <Text style={styles.legendText}>Half-Yearly</Text>
          </View>

          <View style={styles.legendItem}>
            <View style={[styles.dot, { backgroundColor: Colors.primary}]} />
            <Text style={styles.legendText}>Annual</Text>
          </View>
        </View>
      </View>
    );
  }
}

export default GroupedBarChart;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },

  emptyText: {
    textAlign: 'center',
    color: '#666',
    padding: 16,
  },

  chartArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    minHeight: 215,
  },

  subjectGroup: {
    flex: 1,
    alignItems: 'center',
  },

  groupBarsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: 165,
    width: '100%',
    borderBottomWidth: 2,
    borderBottomColor: '#D9D9D9',
  },

  singleBarBlock: {
    width: 16,
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginHorizontal: 1,
  },

  valueLabel: {
    fontSize: FontSize.very_small,
    lineHeight: 11,
    color: Colors.bar_max_text,
    fontFamily: FontFamily.regular,
    marginBottom: 2,
  },

  bar: {
    width: 14,
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },

  subjectName: {
    fontSize: FontSize.very_small,
    color: Colors.textColorInpuHeader,
    fontFamily: FontFamily.medium,
    marginTop: 6,
    textAlign: 'center',
  },

  maxLabel: {
    fontSize: FontSize.vv_small,
    color: Colors.bar_max_text,
    marginTop: 2,
  },

  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },

  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },

  dot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginRight: 6,
  },

  legendText: {
    fontSize: FontSize.very_small,
    color: Colors.textColorInpuHeader,
    fontFamily: FontFamily.semiBold,
  },
});