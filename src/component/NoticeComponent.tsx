import React, { Component } from 'react';
import { FlatList, StyleSheet, ListRenderItem } from 'react-native';
import NoticeCard, { NoticeItem } from './NoticeCard';

interface Props {
  data: NoticeItem[];
}

export default class NoticeList extends Component<Props> {

  renderItem: ListRenderItem<NoticeItem> = ({ item }) => {
    return <NoticeCard item={item} />;
  };

  render() {
    const { data } = this.props;

    return (
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={this.renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
      />
    );
  }
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
  },
});