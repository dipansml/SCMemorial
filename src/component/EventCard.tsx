import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Colors from '../theme/colors';
import { card, FontFamily, FontSize, iconBox } from '../theme/fonts_dimen';
import { changeDateFormat, getStatus } from '../utils/helper';

type Props = {
  event_name: string;
  event_date: string;
  event_fee: string;
  event_description: string;
  status: string;
  is_registered: number,
  online_payment: string,
  onPress?: () => void;
};

const EventCard = ({ event_name, event_date, event_fee, event_description, status, is_registered, online_payment, onPress }: Props) => {
  console.log('EventCard status:', status); // Log the status value for debugging
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
      <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
            <View style={styles.row}>
              <View style={styles.icon}>
                 <Image
                    source={require('../assets/images/icons/event.png')}
                    style={styles.iconLarge}
                    resizeMode="contain"/>
              </View>
    
    
              <View style={{ flex: 1 }}>
                <Text style={styles.subject}>{event_name}</Text>
                <View style={styles.rowTextIcon}>
                    <Image
                        source={require('../assets/images/icons/attendance.png')}
                        style={[styles.iconSmall]}
                        resizeMode="contain"
                      />
                      <Text style={styles.meta}>{changeDateFormat(event_date)}</Text>
                </View>
    
                {/* <Text style={styles.meta}>{item.time}</Text> */}
                <View style={styles.rowTextIcon}>
                    <Image
                        source={require('../assets/images/icons/fees.png')}
                        style={[styles.iconSmall]}
                        resizeMode="contain"
                      />
                      <Text style={styles.meta}>₹{event_fee}</Text>
                </View>
              </View>
               <View style={styles.rightSection}>
                  {/* Status */}
                  <View
                    style={[
                      styles.status,
                      { backgroundColor: statusStyle.backgroundColor },
                    ]}
                  >
                    <Text style={styles.statusText}>
                      {status}
                    </Text>
                  </View>

                  {/* Participated - aligned with fee */}
                  {is_registered === 1 && (
                    <View style={styles.participatedContainer}>
                      <View style={styles.participatedDot} />
                      <Text style={styles.participatedText}>
                        Participated
                      </Text>
                    </View>
                  )}
                </View>
            </View>
          </TouchableOpacity>
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
    overflow: 'hidden',
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
    marginRight: 3,
},  
link: {
    fontSize: FontSize.small,
    color: Colors.theme_color,
    marginTop: 16,
  },

rightSection: {
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  alignSelf: 'stretch',
},

statusText: {
  color: Colors.textColorInpuHeader,
  fontSize: FontSize.small,
  fontFamily: FontFamily.medium,
},

participatedContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 2,
},

participatedDot: {
  width: 7,
  height: 7,
  borderRadius: 4,
  backgroundColor: Colors.success,
  marginRight: 5,
},

participatedText: {
  fontSize: FontSize.small,
  fontFamily: FontFamily.medium,
  color: Colors.success,
},
});