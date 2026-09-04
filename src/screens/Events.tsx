import React, {useCallback, useState} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useFocusEffect} from '@react-navigation/native';

import AppHeader from '../component/AppHeader';
import EventComponent, {EventItem} from '../component/EventComponent';
import {openParentDrawer} from '../navigation/navigationRef';
import {Api} from '../services/Api';
import StorageManager from '../services/StorageManager';
import {EventDetail} from '../Model/EventList/EventDetailData';
import FullScreenLoader from '../view/FullScreenLoader';
import {getStatusEvent} from '../utils/helper';

const Events = ({navigation}: {navigation: any}) => {
  const [eventData, setEventData] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(false);

  // API will be called every time this screen gets focus
  useFocusEffect(
    useCallback(() => {
      loadEvents();

      return () => {
        // Optional cleanup when leaving the screen
      };
    }, []),
  );

  const loadEvents = async () => {
    try {
      setLoading(true);

      const studentId = await StorageManager.getStudentId();

      const response = await Api.getEventList({
        user_id: studentId,
      });

      console.log('Events Response:', response);

      if (
        response &&
        response.status === 200 &&
        response.data?.event_list
      ) {
        const formattedData: EventItem[] =
          response.data.event_list.map((item: EventDetail) => ({
            id: item.id,
            event_name: item.event_name,
            event_date: item.event_date,
            event_fee: item.event_fee,
            event_description: item.event_description,
            status: getStatusEvent(item),
            is_registered: item.is_registered,
            online_payment: item.online_payment,
          }));

        setEventData(formattedData);
      } else {
        console.log('Events Error:', response?.message);

        Alert.alert(
          'Error',
          response?.message || 'Failed to load events',
        );
      }
    } catch (error: any) {
      console.log(
        'Events Error:',
        error?.response?.data || error?.message,
      );

      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Something went wrong',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FullScreenLoader visible={loading} />

      <AppHeader
        title="Events"
        onMenuPress={openParentDrawer}
        onBellPress={() => console.log('Bell')}
        onProfilePress={() => console.log('Profile')}
        navigation={navigation}
      />

      <View style={styles.content}>
        <EventComponent
          data={eventData}
          onItemPress={item => {
            console.log('Clicked Event:', item);

            navigation.navigate('EventDetail', {
              event: item,
            });
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default Events;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
  },
});