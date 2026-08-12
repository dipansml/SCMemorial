import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import { FontFamily, FontSize } from '../theme/fonts_dimen';
import Colors from '../theme/colors';
import { FeeBreakdownItem } from '../Model/FeesStructure/FeeBreakdownItem';

// 🔹 Types


type Props = {
  data: FeeBreakdownItem[];
};

// 🔹 Component
class FeesBreakdownComponent extends Component<Props> {

  getStatusStyle = (status: FeeBreakdownItem['status']) => {
    switch (status) {
      case 'paid':
        return { backgroundColor: Colors.light_green, textColor: Colors.textColorInpuHeader };
      case 'unpaid':
        return { backgroundColor: Colors.yellow, textColor: Colors.textColorInpuHeader };
      case 'pending':
        return { backgroundColor: Colors.light_red, textColor: Colors.textColorInpuHeader };
      default:
        return { backgroundColor: Colors.iconBackGrey, textColor: Colors.textColorInpuHeader };
    }
  };

  getIcon = (title: string) => {
  switch (title) {
    case 'tuition_fee':
      return require('../assets/images/icons/academic.png');

    case 'admission_fee':
      return require('../assets/images/icons/admission.png');

    case 'exam_fee':
      return require('../assets/images/icons/exam.png');

    case 'library_fee':
      return require('../assets/images/icons/book.png');

    case 'bus_services':
      return require('../assets/images/icons/transport.png');

    default:
      return require('../assets/images/icons/exam.png');
  }
};

  renderItem = ({ item }: { item: FeeBreakdownItem }) => {
    const statusStyle = this.getStatusStyle(item.status);

    return (
      <View style={styles.itemContainer}>
        
        {/* LEFT */}
        <View style={styles.leftSection}>
          <View style={styles.iconBack}>
            <Image
                source={this.getIcon(item.fee_type)}
                style={styles.icon}
                resizeMode="contain"/>
          </View>  

          <View>
            <Text style={styles.title}>{formatTitle(item.fee_type)}</Text>
            {/* <Text style={styles.subtitle}>{item.subtitle}</Text> */}
          </View>
        </View>

        {/* RIGHT */}
        <View style={styles.rightSection}>
          <Text style={styles.amount}>₹{item.amount}</Text>

          <View style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor }]}>
            <Text style={[styles.statusText, { color: statusStyle.textColor }]}>
              {formatTitle(item.status)}
            </Text>
          </View>
        </View>

      </View>
    );
  };

  renderSeparator = () => <View style={styles.separator} />;

  render() {
    return (
      <FlatList
        data={this.props.data}
        keyExtractor={(item) => item.fee_type}
        renderItem={this.renderItem}
        ItemSeparatorComponent={this.renderSeparator}
        scrollEnabled={false} // parent ScrollView handles scroll
      />
    );
  }
}

export default FeesBreakdownComponent;

export const formatTitle = (value: string): string => {
  if (!value.includes('_')) {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }

  return value
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

// 🔹 Styles
const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },

  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconBack: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.iconBackGrey,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    fontSize: FontSize.medium,
    fontFamily: FontFamily.medium,
  },

  subtitle: {
    fontSize: FontSize.small,
    color: Colors.text_light,
    fontFamily: FontFamily.regular,
  },

  rightSection: {
    alignItems: 'flex-end',
  },

  amount: {
    fontSize: FontSize.medium,
    fontFamily: FontFamily.bold,
  },

  statusBadge: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 3,
  },

  statusText: {
    fontSize: FontSize.small,
    fontFamily: FontFamily.medium,
  },

  separator: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  icon: {
    width: 22,
    height: 22,
    tintColor: Colors.theme_color,
},
});