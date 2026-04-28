import React from 'react';
import { FlatList, View, Text, StyleSheet } from 'react-native';
import HomeworkItem from './HomeworkItem';
import { FontFamily, FontSize } from '../theme/fonts_dimen';

const HomeworkComponent = ({ data }: any) => {

  const renderItem = ({ item }: any) => {

    // 👉 Header Item
    if (item.type === 'header') {
      return <Text style={styles.header}>{item.title}</Text>;
    }

    // 👉 Normal Item
    return (
      <HomeworkItem
        title={item.title}
        subject={item.subject}
        completed={item.completed}
      />
    );
  };

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
      ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default HomeworkComponent;

const styles = StyleSheet.create({
  list: {
    padding: 14,
  },
  header: {
    fontSize: FontSize.regular,
    fontFamily: FontFamily.medium,
  },
});