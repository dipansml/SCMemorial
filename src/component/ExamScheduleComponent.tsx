import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import Colors from '../theme/colors';
import { card, FontFamily, FontSize, iconBox } from '../theme/fonts_dimen';

type ExamItem = {
  id: string;
  subject: string;
  date: string;
  time: string;
  status: string;
};

type ExamScheduleProps = {
  examList: ExamItem[];
};

class ExamScheduleComponent extends Component<ExamScheduleProps> {

  getStatusStyle = (status : any) => {
    switch (status) {
      case 'Today':
        return { backgroundColor: Colors.yellow, color: Colors.textColorInpuHeader };
      case 'Upcoming':
        return { backgroundColor: Colors.iconBackGrey, color: Colors.textColorInpuHeader };
      case 'Completed':
        return { backgroundColor: Colors.absent, color: Colors.textColorInpuHeader };
      default:
        return {};
    }
  };

  renderItem = ({ item }: { item: any }) => {
    const statusStyle = this.getStatusStyle(item.status);

    return (
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.icon}>
             <Image
                source={require('../assets/images/icons/book.png')}
                style={styles.iconLarge}
                resizeMode="contain"/>
          </View>


          <View style={{ flex: 1 }}>
            <Text style={styles.subject}>{item.subject}</Text>
            {/* <Text style={styles.meta}>{item.date}</Text> */}
            <View style={styles.rowTextIcon}>
                <Image
                    source={require('../assets/images/icons/attendance.png')}
                    style={[styles.iconSmall, { marginRight: 2 }]}
                    resizeMode="contain"
                  />
                  <Text style={styles.meta}>{item.date}</Text>
            </View>

            {/* <Text style={styles.meta}>{item.time}</Text> */}
            <View style={styles.rowTextIcon}>
                <Image
                    source={require('../assets/images/icons/clock.png')}
                    style={[styles.iconSmall, { marginRight: 2 }]}
                    resizeMode="contain"
                  />
                  <Text style={styles.meta}>{item.time}</Text>
            </View>
          </View>

          <View style={[styles.status, { backgroundColor: statusStyle.backgroundColor }]}>
            <Text style={{ color: statusStyle.color, fontSize: FontSize.small, fontFamily: FontFamily.regular }}>
              {item.status}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  render() {
    const { examList } = this.props;

    return (
      <FlatList
        data={examList}
        keyExtractor={(item) => item.id}
        renderItem={this.renderItem}
        showsVerticalScrollIndicator={false}
      />
    );
  }
}

export default ExamScheduleComponent;

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background_list_item,
    borderRadius: card.border_radius_card,
    padding: card.padding,
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: iconBox.border_radius_card,
    backgroundColor: Colors.iconBackGrey,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subject: {
    fontSize: FontSize.medium,
    fontFamily: FontFamily.medium,
    color: Colors.textColorInpuHeader,
  },
  meta: {
    fontSize: FontSize.small,
    color: Colors.text_hint,
    fontFamily: FontFamily.regular,
    marginTop: 4,
  },
  status: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  iconLarge: {
    width: 20,
    height: 20,
    tintColor: Colors.menu_tint,
},

rowTextIcon: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
iconSmall: {
    width: 12,
    height: 12,
    tintColor: Colors.text_hint,
},  
});