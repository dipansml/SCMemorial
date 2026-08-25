import React from 'react';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
} from 'react-native';

import EventCard from './EventCard';

export type EventItem = {
  id: string;
  event_name: string;
  event_date: string;
  event_fee: string;
  event_description: string;
  status: string;
  is_registered: number;
  online_payment: string;
};

type Props = {
  data: EventItem[];

  onItemPress?: (item: EventItem) => void;
};

const EventComponent = ({
  data,
  onItemPress,
}: Props) => {

  const renderItem = ({
    item,
  }: {
    item: EventItem;
  }) => (
    <EventCard
      event_name={item.event_name}
      event_date={item.event_date}
      event_fee={item.event_fee}
      event_description={item.event_description}
      status={item.status}
      is_registered={item.is_registered}
      online_payment = {item.online_payment}
      onPress={() => onItemPress?.(item)}
    />
  );

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.list}
      ItemSeparatorComponent={() => (
        <View style={{ height: 10 }} />
      )}
      ListEmptyComponent={() => (
        <View style={styles.empty}>
          <Text>No Events Found</Text>
        </View>
      )}
      initialNumToRender={5}
      maxToRenderPerBatch={5}
      windowSize={7}
    />
  );
};

export default EventComponent;

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },

  empty: {
    alignItems: 'center',
  },
});