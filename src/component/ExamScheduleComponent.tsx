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
  subject_name: string;
  exam_date: string;
  exm_time: string;
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
        return {backgroundColor: Colors.iconBackGrey, color: Colors.textColorInpuHeader};
    }
  };

  renderItem = ({ item }: { item: any }) => {
    const statusStyle = this.getStatusStyle(getStatus(item));
  

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
            <Text style={styles.subject}>{item.subject_name}</Text>
            <View style={styles.rowTextIcon}>
                <Image
                    source={require('../assets/images/icons/attendance.png')}
                    style={[styles.iconSmall, { marginRight: 2 }]}
                    resizeMode="contain"
                  />
                  <Text style={styles.meta}>{changeDateFormat(item.exam_date).toString()}</Text>
            </View>

            {/* <Text style={styles.meta}>{item.exam_time}</Text> */}
           <View style={styles.rowTextIcon}>
          <Image
            source={require('../assets/images/icons/clock.png')}
            style={styles.iconSmall}
            resizeMode="contain"
          />
          <Text style={styles.meta}>{item.exm_time}</Text>
        </View>
          </View>

          <View style={[styles.status, { backgroundColor: statusStyle.backgroundColor }]}>
            <Text style={{ color: statusStyle.color, fontSize: FontSize.small, fontFamily: FontFamily.regular }}>
              {getStatus(item)}
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
        scrollEnabled={false}
        removeClippedSubviews={false}
        initialNumToRender={10}
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
    alignItems: 'flex-start',
    justifyContent: 'center',
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
    marginLeft: 2,
  },
  status: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontFamily: FontFamily.regular,
    color: Colors.textColorInpuHeader
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
    marginTop: 4,
},  
});

function changeDateFormat(dateString: string): string {
  const date = new Date(dateString);

  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const day = String(date.getDate()).padStart(2, '0');
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

function getStatus(item: any): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const examDate = new Date(item.exam_date);
  examDate.setHours(0, 0, 0, 0);

  if (examDate.getTime() === today.getTime()) {
    return 'Today';
  } else if (examDate > today) {
    return 'Upcoming';
  } else {
    return 'Completed';
  }
}
