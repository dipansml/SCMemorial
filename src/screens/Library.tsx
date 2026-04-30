import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  FlatList,
} from 'react-native';
import AppHeader from '../component/AppHeader';
import { openParentDrawer } from '../navigation/navigationRef';
import { SafeAreaView } from 'react-native-safe-area-context';
import { card, FontFamily, FontSize } from '../theme/fonts_dimen';
import Colors from '../theme/colors';
import BookListComponent from '../component/BookListComponent';

type TabType = 'All' | 'Issue' | 'Return' | 'Due';

const Library = () => {
  const [activeTab, setActiveTab] = useState<TabType>('All');

  // ✅ Tabs
  const tabs = [
    { title: 'All Books', key: 'All', icon: require('../assets/images/icons/book.png'), count: 4, color: Colors.theme_color },
    { title: 'Issue Book', key: 'Issue', icon: require('../assets/images/icons/issue.png'), count: 1, color: Colors.dark_green },
    { title: 'Return Book', key: 'Return', icon: require('../assets/images/icons/return.png'), count: 1, color: Colors.orange_dark },
    { title: 'Due Books', key: 'Due', icon: require('../assets/images/icons/clock.png'), count: 2, color: Colors.theme_color },
  ];

  // ✅ book Data
  const books = [
    {
      id: '1',
      title: 'English Grammar',
      author: 'Wren & Martin',
      status: 'Due Soon',
      issueDate: '05 April 2026',
      dueDate: '25 April 2026',
      daysLeft: '2 Days Left',
      type: 'Due',
    },
    {
      id: '2',
      title: 'History of India',
      author: 'Bipin Chandra',
      status: 'Overdue',
      issueDate: '05 April 2026',
      dueDate: '15 April 2026',
      daysLeft: '5 Days',
      type: 'Due',
    },
    {
      id: '3',
      title: 'Story Book Collection',
      author: 'Various',
      status: 'Due Soon',
      issueDate: '05 April 2026',
      dueDate: '25 April 2026',
      daysLeft: '2 Days Left',
      type: 'Issue',
    },
    {
      id: '4',
      title: 'Story Book Collection1',
      author: 'Various',
      status: 'Returned',
      issueDate: '05 April 2026',
      dueDate: '25 April 2026',
      daysLeft: 'Returned',
      type: 'Return',
    },
  ];

  // ✅ Filter Logic
  const filteredBooks =
    activeTab === 'All'
      ? books
      : books.filter(item => item.type === activeTab);


  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        title="Library"
        onMenuPress={openParentDrawer}
      />

      {/* ✅ Tabs */}
      <View style={styles.tabsContainer}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.tabCard,
              activeTab === tab.key && styles.activeTab,
            ]}
            onPress={() => setActiveTab(tab.key as TabType)}
          >
            <View style={styles.iconBox}>
              <Image source={tab.icon} style={[
                    styles.icon,
                    { tintColor: tab.color }
                ]}/>
            </View>
            <Text style={styles.title}>{tab.title}</Text>
            <Text style={styles.count}>{tab.count}</Text>
          </TouchableOpacity>
        ))}
      </View>

     <BookListComponent bookList={filteredBooks} />
    </SafeAreaView>
  );
};

export default Library;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background},

  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },

  tabCard: {
    width: '23%',
    backgroundColor: Colors.background_list_item,
    borderRadius: card.border_radius_card_medium,
    padding: card.padding_samll,
    alignItems: 'center',
  },

  activeTab: {
    borderWidth: 2,
    borderColor: Colors.theme_color,
  },

  iconBox: {
    backgroundColor: Colors.tab_icon_back,
    padding: 10,
    borderRadius: 10,
    marginBottom: 5,
  },

  icon: { width: 22, height: 22 },

  title: { 
    fontSize: FontSize.very_small, 
    fontFamily: FontFamily.medium,
    color: Colors.textColorInpuHeader
},
  count: { 
    fontSize: FontSize.very_small, 
    color: Colors.text_light,
 },

  bookCard: {
    backgroundColor: '#fff',
    borderRadius: card.border_radius_card_medium,
    padding: card.padding_card_medium,
    marginBottom: 12,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  bookIcon: { width: 40, height: 40, marginRight: 10 },

  bookTitle: { fontWeight: '600', fontSize: 14 },
  bookAuthor: { color: '#6c8ebf', fontSize: 12 },

  status: {
    backgroundColor: '#f5c26b',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },

  statusText: { fontSize: 10, color: '#fff' },

  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 10,
  },

  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  meta: { fontSize: 11, color: '#555' },
});