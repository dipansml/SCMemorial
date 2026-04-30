import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
} from 'react-native';
import Colors from '../theme/colors';
import { card, FontFamily, FontSize, iconBox } from '../theme/fonts_dimen';

type Book = {
  id: string;
  title: string;
  author: string;
  status: string;
  issueDate: string;
  dueDate: string;
  daysLeft: string;
};

type Props = {
  bookList: Book[];
};

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'Overdue':
      return { backgroundColor: Colors.red }; 

    case 'Due Soon':
      return { backgroundColor: Colors.yellow }; 

    case 'Returned':
      return { backgroundColor: Colors.light_green }; 

    default:
      return { backgroundColor: Colors.light_gray };
  }
};

const getStatusTestColor = (status: string) => {
  switch (status) {
    case 'Overdue':
      return { backgroundColor: Colors.white }; 

    // case 'Due Soon':
    //   return { backgroundColor: Colors.yellow }; 

    // case 'Returned':
    //   return { backgroundColor: Colors.light_green }; 

    default:
      return { backgroundColor: Colors.textColorInpuHeader };
  }
};

const getDaysLeftTextColor = (type: string) => {
  switch (type) {
    case 'Returned':
      return { backgroundColor: Colors.text_light }; 
    default:
      return { backgroundColor: Colors.text_orange };
  }
};

const BookListComponent = ({ bookList }: Props) => {

  const renderItem = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.row}>
         <View style={styles.icon}>
            <Image
                source={require('../assets/images/icons/book.png')}
                style={styles.iconLarge}
                resizeMode="contain"/>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.author}>{item.author}</Text>
        </View>

        <View
          style={[
            styles.status,
            getStatusStyle(item.status)
          ]}
        >
          <Text style={[styles.statusText, { color: getStatusTestColor(item.status).backgroundColor }]}>
            {item.status}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.footer}>
  
        {/* Issue Date */}
        <View style={styles.footerItem}>
            <View style={styles.columnFooter}>
                <View style={styles.rowFooter}>
                    <Image
                        source={require('../assets/images/icons/attendance.png')}
                        style={styles.iconFooter}
                    />
                    <Text style={styles.label}>Issue Date</Text>
                </View>
                <Text style={styles.value}>{item.issueDate}</Text>
            </View>
        </View>

        {/* Divider */}
        <View style={styles.dividerVertical} />

        {/* Due Date */}
        <View style={styles.footerItem}>
            <View style={styles.columnFooter}>
                <View style={styles.rowFooter}>
                    <Image
                        source={require('../assets/images/icons/attendance.png')}
                        style={styles.iconFooter}
                    />
                    <Text style={styles.label}>Due Date</Text>
                </View>
                <Text style={styles.value}>{item.dueDate}</Text>
            </View>
        </View>

        {/* Divider */}
        <View style={styles.dividerVertical} />

        {/* Days Left */}
        <View style={styles.footerItem}>
            <View style={styles.columnFooter}>
                <View style={styles.rowFooter}>
                    <Image
                        source={require('../assets/images/icons/clock.png')}
                        style={styles.iconFooter}
                    />
                    <Text style={[styles.label]}>
                        Days Left
                    </Text>
            </View>
            </View>
            <Text style={[styles.value, { color: getDaysLeftTextColor(item.status).backgroundColor }]}>
            {item.daysLeft}
            </Text>
        </View>
        </View>
    </View>
  );

  return (
    <FlatList
      data={bookList}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default BookListComponent;

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background_list_item,
    borderRadius: card.border_radius_card,
    marginBottom: card.margin_bottom,
    marginHorizontal: card.margin_bottom,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: card.padding,
    marginHorizontal: card.padding,
    marginVertical: 10,
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
   iconLarge: {
    width: 20,
    height: 20,
    tintColor: Colors.menu_tint,
},
  title: { 
    fontSize: FontSize.regular, 
    fontFamily: FontFamily.medium,
    color: Colors.textColorInpuHeader,
},
  author: { 
    fontSize: FontSize.small, 
    color: Colors.text_light, 
  },
  status: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 3,
  },
  statusText: { 
    fontSize: FontSize.very_small,
    fontFamily: FontFamily.regular,
},
  divider: {
    height: 2,
    backgroundColor: Colors.border_color,
   
  },
 
footer: {
  flexDirection: 'row',
  overflow: 'hidden',
  
},

footerItem: {
  flex: 1,
  alignItems: 'center',
  flexDirection:'column',
  marginVertical: 10,
},

rowFooter: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 4,
},
columnFooter: {
  flexDirection: 'column',
  alignItems: 'center',
},

iconFooter: {
  width: 14,
  height: 14,
  marginRight: 4,
  tintColor: Colors.tintColor,
},

label: {
  fontSize: FontSize.small,
  color: Colors.textColorInpuHeader,
  fontFamily: FontFamily.semiBold,
},

value: {
  fontSize: FontSize.very_small,
  fontFamily: FontFamily.medium,
  color: Colors.text_light,
},

valueOrange: {
  fontSize: FontSize.very_small,
  color: Colors.text_orange,
  fontFamily: FontFamily.medium,
},

dividerVertical: {
  width: 2,
  backgroundColor: Colors.border_color,
},
});