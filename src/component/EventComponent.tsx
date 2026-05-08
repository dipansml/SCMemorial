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
  title: string;
  date: string;
  time: string;
  status: 'Ongoing' | 'UpComing' | 'Past';
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
      title={item.title}
      date={item.date}
      time={item.time}
      status={item.status}
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