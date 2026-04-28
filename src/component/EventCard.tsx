import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Colors from '../theme/colors';
import { card, FontFamily, FontSize, iconBox } from '../theme/fonts_dimen';

type Props = {
  title: string;
  date: string;
  time: string;
  status: 'Ongoing' | 'UpComing' | 'Past';
};

const EventCard = ({ title, date, time, status }: Props) => {
  const getStatusStyle = () => {
    switch (status) {
      case 'Ongoing':
        return { backgroundColor: Colors.yellow, color: Colors.textColorInpuHeader };
      case 'UpComing':
        return { backgroundColor: Colors.light_green, color: Colors.textColorInpuHeader };
      case 'Past':
        return { backgroundColor: Colors.absent, color: Colors.textColorInpuHeader };
      default:
        return {};
    }
  };

  const statusStyle = getStatusStyle();

  return (
    // <View style={styles.card}>
    //  <View style={styles.iconBack}>
    //   <Image
    //     source={require('../assets/images/icons/event.png')}
    //     style={styles.icon}
    //   />
    //   </View>

    //   <View style={styles.details}>
    //     <View style={styles.topRow}>
    //       <Text style={styles.title} numberOfLines={1}>
    //         {title}
    //       </Text>

    //       <View style={[styles.badge, { backgroundColor: statusStyle.backgroundColor }]}>
    //         <Text style={[styles.badgeText, { color: statusStyle.color }]}>
    //           {status}
    //         </Text>
    //       </View>
    //     </View>

    //     <Text style={styles.date}>{date}</Text>
    //     <Text style={styles.time}>{time}</Text>

    //     <TouchableOpacity>
    //       <Text style={styles.link}>Details ↗</Text>
    //     </TouchableOpacity>
    //   </View>
    // </View>

      <View style={styles.card}>
            <View style={styles.row}>
              <View style={styles.icon}>
                 <Image
                    source={require('../assets/images/icons/event.png')}
                    style={styles.iconLarge}
                    resizeMode="contain"/>
              </View>
    
    
              <View style={{ flex: 1 }}>
                <Text style={styles.subject}>{title}</Text>
                <View style={styles.rowTextIcon}>
                    <Image
                        source={require('../assets/images/icons/attendance.png')}
                        style={[styles.iconSmall, { marginRight: 2 }]}
                        resizeMode="contain"
                      />
                      <Text style={styles.meta}>{date}</Text>
                </View>
    
                {/* <Text style={styles.meta}>{item.time}</Text> */}
                <View style={styles.rowTextIcon}>
                    <Image
                        source={require('../assets/images/icons/clock.png')}
                        style={[styles.iconSmall, { marginRight: 2 }]}
                        resizeMode="contain"
                      />
                      <Text style={styles.meta}>{time}</Text>
                </View>
              </View>
            <View style={{ flexDirection: 'column', alignItems: 'flex-end' }}>
              <View style={[styles.status, { backgroundColor: statusStyle.backgroundColor }]}>
                <Text style={{ color: statusStyle.color, fontSize: FontSize.small, fontFamily: FontFamily.regular }}>
                  {status}
                </Text>
              </View>
               <TouchableOpacity>
                    <Text style={styles.link}>Details ↗</Text>
                </TouchableOpacity>
                </View>
            </View>
          </View>
  );
};

export default EventCard;

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.background_list_item,
        borderRadius: card.border_radius_card,
        padding: card.padding,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
link: {
    fontSize: FontSize.small,
    color: Colors.theme_color,
    marginTop: 16,
  },
});