import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Text,
  FlatList,
  Alert,
} from 'react-native';
import AppHeader from '../component/AppHeader';
import { openParentDrawer } from '../navigation/navigationRef';
import { SafeAreaView } from 'react-native-safe-area-context';
import { card, FontFamily, FontSize } from '../theme/fonts_dimen';
import Colors from '../theme/colors';
import BookListComponent from '../component/BookListComponent';
import { LibraryItem } from '../Model/StudentLibrary/LibraryItem';
import StorageManager from '../services/StorageManager';
import { Api } from '../services/Api';
import FullScreenLoader from '../view/FullScreenLoader';
import { RouteProp } from '@react-navigation/native';


type TabType = 'All' | 'Issue' | 'Return' | 'Due';

type LibraryRouteProp = RouteProp<
  {
    Library: {
      isback?: boolean;
    };
  },
  'Library'
>;


type Props = {
  navigation: any;
  route: LibraryRouteProp;
};

const Library = ({ navigation, route }: { navigation: any; route: LibraryRouteProp }) => {
  const [activeTab, setActiveTab] = useState<TabType>('All');
  const [libraryList, setLibraryList] = useState<
  LibraryItem[]
>([]);

const [loading, setLoading] = useState(false);

  // ✅ Tabs
  const tabs = [
    { title: 'All Books', key: 'All', icon: require('../assets/images/icons/book.png'), count: libraryList.length, color: Colors.theme_color },
    { title: 'Issue Book', key: 'Issue', icon: require('../assets/images/icons/issue.png'), count: libraryList.filter(
      item => item.type === 'Issue'
    ).length, color: Colors.dark_green },
    { title: 'Return Book', key: 'Return', icon: require('../assets/images/icons/return.png'), count: libraryList.filter(
      item => item.type === 'Return'
    ).length, color: Colors.orange_dark },
    { title: 'Due Books', key: 'Due', icon: require('../assets/images/icons/clock.png'), count: libraryList.filter(
      item => item.type === 'Due'
    ).length, color: Colors.theme_color },
  ];

  useEffect(() => {
    loadLibraryList();
  }, []);

  const loadLibraryList = async () => {

    try {

      setLoading(true);

      const response =
        await Api.getStudentLibrary({
          user_id:
            await StorageManager.getStudentId(),
        });

      console.log(
        'Library Response:',
        response
      );

      if (
        response &&
        response.status === 200 &&
        response.data?.library_list
      ) {

        const formattedData: LibraryItem[] =
          response.data.library_list.map(
            (item: LibraryItem) => ({
              id: item.id,
              title: item.title,
              author: item.author,
              status: item.status,
              issueDate: item.issueDate,
              dueDate: item.dueDate,
              daysLeft: item.daysLeft,
              type: item.type,
            })
          );

        setLibraryList(formattedData);

      } else {

        Alert.alert(
          'Error',
          response?.message ||
            'Failed to load library data'
        );
      }

    } catch (error: any) {

      console.log(
        'Library Error:',
        error?.response?.data || error.message
      );

      Alert.alert(
        'Error',
        error?.response?.data?.message ||
          'Something went wrong'
      );

    } finally {

      setLoading(false);
    }
  };
  // ✅ Filter Logic
  const filteredBooks =
    activeTab === 'All'
      ? libraryList
      : libraryList.filter(item => item.type === activeTab);


  return (
    <SafeAreaView style={styles.container}>
      <FullScreenLoader visible={loading} />

      <AppHeader
        title="Library"
        showBack={route.params?.isback}
        onMenuPress={!route.params?.isback ? openParentDrawer : navigation.goBack}
        navigation={navigation}
      />

      {/* Tabs */}
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
              <Image
                source={tab.icon}
                style={[
                  styles.icon,
                  { tintColor: tab.color },
                ]}
              />
            </View>

            <Text style={styles.title}>{tab.title}</Text>
            <Text style={styles.count}>{tab.count}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <BookListComponent bookList={filteredBooks} />

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        activeOpacity={0.8}
        onPress={() => {
          navigation.navigate('AllBook');
        }}
      >
        <Image
          source={require('../assets/images/icons/book.png')}
          style={styles.iconLarge}
          resizeMode="contain"
        />
      </TouchableOpacity>
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

  floatingButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,

    justifyContent: 'center',
    alignItems: 'center',

    // iOS shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,

    // Android shadow
    elevation: 6,
  },

  iconLarge: {
    width: 20,
    height: 20,
    tintColor: Colors.white,
  },
});