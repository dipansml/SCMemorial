import React from 'react';
import { View, 
        StyleSheet, 
        ScrollView,
        Text,
        Image, } from 'react-native';
import AppHeader from '../component/AppHeader';
import { openParentDrawer } from '../navigation/navigationRef';
import { SafeAreaView } from 'react-native-safe-area-context';
import { card, container, FontFamily, FontSize } from '../theme/fonts_dimen';
import Colors from '../theme/colors';
import { RouteProp } from '@react-navigation/native';
import { EventDetail as EventDetailModel } from '../Model/EventList/EventDetailData';
import { changeDateFormat } from '../utils/helper';

type EventDetailRouteProp = RouteProp<
  {
    EventDetail: {
      event: EventDetailModel;
    };
  },
  'EventDetail'
>;

type Props = {
  navigation: any;
  route: EventDetailRouteProp;
};

const EventDetail = ({ navigation, route }: Props) => {
  const { event } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        title="Event Details"
        showBack= {true}
        onMenuPress={navigation.goBack}
        onBellPress={() => console.log('Bell')}
        onProfilePress={() => console.log('Profile')}
        navigation={navigation}
      />

      <View style={styles.content}>
         <ScrollView
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
        >
        {/* Banner Card */}
        <View style={styles.card}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop',
            }}
            style={styles.banner}
          />

          <View style={styles.contentContainer}>
            <Text style={styles.title}>{event.event_name}</Text>

            <View style={styles.dateRow}> 
                <Image
                    source={require('../assets/images/icons/attendance.png')}
                    style={styles.smallIcon}
                    resizeMode="contain"/>

              <Text style={styles.dateText}>
                {changeDateFormat(event.event_date)}
              </Text>

              {/* <Text style={styles.dot}>•</Text> */}

              <Text style={styles.timeText}>
                {event.event_time}
              </Text>
            </View>
          </View>
        </View>

        {/* Venue */}
        <View style={styles.infoCard}>
           <View style={styles.iconBack}>
            <Image
                source={require('../assets/images/icons/location.png')}
                style={styles.icon}
                resizeMode="contain"/>
          </View>

          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Venue</Text>
            <Text style={styles.infoSubtitle}>
              Grand Science Hall, Building B
            </Text>
          </View>
        </View>

        {/* Organizer */}
        <View style={styles.infoCard}>
          <View style={styles.iconBack}>
            <Image
                source={require('../assets/images/icons/academic.png')}
                style={styles.icon}
                resizeMode="contain"/>
          </View>

          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Organizer</Text>
            <Text style={styles.infoSubtitle}>
              Department of Natural Sciences
            </Text>
          </View>
        </View>

        {/* About Section */}
        <View style={styles.aboutCard}>
          <Text style={styles.aboutTitle}>About the Event</Text>

          <Text style={styles.aboutText}>{event.event_description}</Text>
        </View>
      </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default EventDetail;

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: Colors.background,},
  content: { flex: 1 },
  
  scrollContainer: {
    padding: 16,
    paddingBottom: 30,
  },

  card: {
    backgroundColor: Colors.background_list_item,
    borderRadius: card.border_radius_card,
    overflow: 'hidden',
    marginBottom: card.margin_bottom,
  },

  banner: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },

  contentContainer: {
    padding: container.container_padding,
  },

  title: {
    fontSize: FontSize.large,
    color: Colors.textColorInpuHeader,
    fontFamily: FontFamily.bold,
    marginBottom: 2,
  },

  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },

  calendarIcon: {
    fontSize: 14,
    marginRight: 6,
  },

  dateText: {
    fontSize: FontSize.small,
    color: Colors.text_light,
    fontFamily: FontFamily.regular,
  },

  dot: {
    marginHorizontal: 6,
    color: Colors.text_light,
  },

  timeText: {
    fontSize: FontSize.small,
    color: Colors.text_light,
    fontFamily: FontFamily.regular,
  },

  infoCard: {
    backgroundColor: Colors.background_list_item,
    borderRadius: 16,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: Colors.background_list_item,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  infoContent: {
    flex: 1,
  },

  infoTitle: {
    fontSize: FontSize.regular,
    fontFamily: FontFamily.medium,
    color: Colors.textColorInpuHeader,
    marginBottom: 2,
  },

  infoSubtitle: {
    fontSize: FontSize.small,
    color: Colors.text_light,
    fontFamily: FontFamily.regular,
  },

  aboutCard: {
    backgroundColor: Colors.background_list_item,
    borderRadius: card.border_radius_card,
    padding: card.padding,
  },

  aboutTitle: {
    fontSize: FontSize.large,
    fontFamily: FontFamily.medium,
    color: Colors.textColorInpuHeader,
    marginBottom: 10,
  },

  aboutText: {
    fontSize: FontSize.small,
    color: Colors.text_light,
    fontFamily: FontFamily.regular,
    lineHeight: 20,
    marginBottom: 10,
  },
  smallIcon: {
    width: 14,
    height: 14,
    marginRight: 3,
    tintColor: Colors.text_light,
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

  icon: {
    width: 22,
    height: 22,
    tintColor: Colors.theme_color,
},
});