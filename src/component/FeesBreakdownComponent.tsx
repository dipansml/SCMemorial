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

// 🔹 Types
export type FeeItem = {
  id: string;
  title: string;
  subtitle: string;
  amount: string;
  status: 'Paid' | 'Unpaid' | 'Pending';
};

type Props = {
  data: FeeItem[];
};

// 🔹 Component
class FeesBreakdownComponent extends Component<Props> {

  getStatusStyle = (status: FeeItem['status']) => {
    switch (status) {
      case 'Paid':
        return { backgroundColor: Colors.light_green, textColor: Colors.textColorInpuHeader };
      case 'Unpaid':
        return { backgroundColor: Colors.yellow, textColor: Colors.textColorInpuHeader };
      case 'Pending':
        return { backgroundColor: Colors.light_red, textColor: Colors.textColorInpuHeader };
      default:
        return { backgroundColor: Colors.iconBackGrey, textColor: Colors.textColorInpuHeader };
    }
  };

  getIcon = (title: string) => {
  switch (title) {
    case 'Tuition Fee':
      return require('../assets/images/icons/academic.png');

    case 'Admission Fee':
      return require('../assets/images/icons/admission.png');

    case 'Exam Fee':
      return require('../assets/images/icons/exam.png');

    case 'Library Fee':
      return require('../assets/images/icons/library.png');

    case 'Transport Fee':
      return require('../assets/images/icons/transport.png');

    default:
      return require('../assets/images/icons/academic.png');
  }
};

  renderItem = ({ item }: { item: FeeItem }) => {
    const statusStyle = this.getStatusStyle(item.status);

    return (
      <View style={styles.itemContainer}>
        
        {/* LEFT */}
        <View style={styles.leftSection}>
          <View style={styles.iconBack}>
            <Image
                source={this.getIcon(item.title)}
                style={styles.icon}
                resizeMode="contain"/>
          </View>  

          <View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
        </View>

        {/* RIGHT */}
        <View style={styles.rightSection}>
          <Text style={styles.amount}>₹{item.amount}</Text>

          <View style={[styles.statusBadge, { backgroundColor: statusStyle.backgroundColor }]}>
            <Text style={[styles.statusText, { color: statusStyle.textColor }]}>
              {item.status}
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
        keyExtractor={(item) => item.id}
        renderItem={this.renderItem}
        ItemSeparatorComponent={this.renderSeparator}
        scrollEnabled={false} // parent ScrollView handles scroll
      />
    );
  }
}

export default FeesBreakdownComponent;

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