import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppHeader from '../component/AppHeader';
import EventComponent, { EventItem } from '../component/EventComponent';
import { openParentDrawer } from '../navigation/navigationRef';
import { SafeAreaView } from 'react-native-safe-area-context';

const Events = ({ navigation }: { navigation: any }) => {
   const eventData: EventItem[] = [
    {
      id: '1',
      title: 'Event 1',
      date: '25 Apr 2026',
      time: '10:00 AM - 1:00 PM',
      status: 'Ongoing',
    },
    {
      id: '2',
      title: 'Event 2',
      date: '25 Apr 2026 - 27 Apr 2026',
      time: '10:00 AM - 1:00 PM',
      status: 'Ongoing',
    },
    {
      id: '3',
      title: 'Event 3',
      date: '29 Apr 2026 - 30 Apr 2026',
      time: '10:00 AM - 1:00 PM',
      status: 'UpComing',
    },
    {
      id: '4',
      title: 'Event 4',
      date: '30 Apr 2026',
      time: '10:00 AM - 1:00 PM',
      status: 'Ongoing',
    },
    {
      id: '5',
      title: 'Event 5',
      date: '25 Apr 2026',
      time: '10:00 AM - 1:00 PM',
      status: 'Past',
    },
  ];
  return (
    <SafeAreaView style={styles.container}>
      
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
          onItemPress={(item) => {
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
  container: { flex: 1 },
  content: { flex: 1 },
});