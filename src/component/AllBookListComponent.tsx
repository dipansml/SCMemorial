import React, {useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import {Api} from '../services/Api';
import Colors from '../theme/colors';

import { card, FontFamily, FontSize } from '../theme/fonts_dimen';

import FullScreenLoader from '../view/FullScreenLoader';

import {Book} from '../Model/AllBook/BookListData';

type TabType = 'total' | 'recent';

const PER_PAGE = 10;

const AllBookListComponent = () => {
  const [books, setBooks] = useState<Book[]>([]);

  const [activeTab, setActiveTab] =
    useState<TabType>('total');

  const [loading, setLoading] =
    useState(false);

  const [loadingMore, setLoadingMore] =
    useState(false);

  const [refreshing, setRefreshing] =
    useState(false);

  const [page, setPage] =
    useState(1);

  const [hasNext, setHasNext] =
    useState(false);

  const [totalBooks, setTotalBooks] =
    useState('');

  const [latestBooks, setLatestBooks] =
    useState('');

  const [searchText, setSearchText] =
    useState('');

  const [searchValue, setSearchValue] =
    useState('');

  // Only one accordion open at a time
  const [expandedBookId, setExpandedBookId] =
    useState<string | null>(null);

  /**
   * LOAD BOOKS
   */
  const loadBookList = async (
    pageNumber: number,
    search: string,
    append: boolean = false,
  ) => {
    try {
      if (append) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      const response =
        await Api.getAllBook(
          pageNumber,
          PER_PAGE,
          search,
        );

      console.log(
        'Library Response:',
        response,
      );

      if (
        response &&
        response.status === 200 &&
        response.data?.all_books
      ) {
        const newBooks =
          response.data.all_books;

        if (append) {
          setBooks(previousBooks => [
            ...previousBooks,
            ...newBooks,
          ]);
        } else {
          setBooks(newBooks);
        }

        setPage(pageNumber);

        setHasNext(
          response.data.pagination?.has_next ??
            false,
        );

        setTotalBooks(
          response.data.totalbookcount,
        );

        setLatestBooks(
          response.data.totallatestbookcount,
        );
      } else {
        Alert.alert(
          'Error',
          response?.message ||
            'Failed to load library data',
        );
      }
    } catch (error: any) {
      console.log(
        'Library Error:',
        error?.response?.data ||
          error?.message,
      );

      Alert.alert(
        'Error',
        error?.response?.data?.message ||
          'Something went wrong',
      );
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  };

  /**
   * INITIAL LOAD
   */
  useEffect(() => {
    loadBookList(1, '');
  }, []);

  /**
   * SEARCH
   */
  useEffect(() => {
    const timer = setTimeout(() => {
      const value =
        searchText.trim();

      if (value !== searchValue) {
        setSearchValue(value);

        setPage(1);
        setExpandedBookId(null);

        loadBookList(
          1,
          value,
          false,
        );
      }
    }, 400);

    return () => {
      clearTimeout(timer);
    };
  }, [searchText]);

  /**
   * RECENT BOOK FILTER
   *
   * Recent = is_latest === "1"
   */
  const displayedBooks = useMemo(() => {
    if (activeTab === 'recent') {
      return books.filter(
        book => book.is_latest === '1',
      );
    }

    return books;
  }, [books, activeTab]);


  /**
   * TAB PRESS
   */
  const handleTabPress = (
    tab: TabType,
  ) => {
    setActiveTab(tab);

    // Close currently opened accordion
    setExpandedBookId(null);
  };

  /**
   * ACCORDION
   */
  const handleAccordionPress = (
    id: string,
  ) => {
    setExpandedBookId(previousId =>
      previousId === id ? null : id,
    );
  };

  /**
   * PAGINATION
   */
  const handleLoadMore = () => {
    if (
      loading ||
      loadingMore ||
      !hasNext
    ) {
      return;
    }

    loadBookList(
      page + 1,
      searchValue,
      true,
    );
  };

  /**
   * REFRESH
   */
  const handleRefresh = () => {
    setRefreshing(true);
    setExpandedBookId(null);

    loadBookList(
      1,
      searchValue,
      false,
    );
  };

  /**
   * BOOK ROW
   */
  const renderBook = ({
    item,
  }: {
    item: Book;
  }) => {
    const isExpanded =
      expandedBookId === item.id;

    return (
      <View
        style={[
          styles.bookCard,
          isExpanded &&
            styles.bookCardExpanded,
        ]}>

        {/* HEADER */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            handleAccordionPress(item.id)
          }
          style={styles.bookHeader}>

          {/* BOOK ICON */}
          <View
            style={
              styles.bookIconContainer
            }>
            <Image
              source={require('../assets/images/icons/book.png')}
              style={styles.bookIcon}
              resizeMode="contain"
            />
          </View>

          {/* BASIC BOOK INFO */}
          <View style={styles.bookInfo}>

            <Text
              style={styles.bookName}
              numberOfLines={1}>
              {item.bookname || 'N/A'}
            </Text>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>
                Author :
              </Text>

              <Text
                style={styles.infoValue}
                numberOfLines={1}>
                {item.bookauthor || 'N/A'}
              </Text>
            </View>

            {/* <Text
              style={styles.publisher}
              numberOfLines={1}>
              Publisher :{' '}
              {item.bookpublisher || 'N/A'}
            </Text> */}

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>
                  Publisher :
                </Text>

                <Text
                  style={styles.infoValue}
                  numberOfLines={1}>
                  {item.bookpublisher || 'N/A'}
                </Text>
              </View>
          </View>

          {/* RIGHT SIDE */}
          <View
            style={
              styles.rightSection
            }>

               <Text style={styles.viewDetails}>
                {isExpanded ? 'View Less' : 'View Details'}
              </Text>

            <Image
              source={require('../assets/images/icons/down_arrow.png')}
              style={[
                styles.arrowIcon,
                isExpanded && styles.arrowIconExpanded,
              ]}
              resizeMode="contain"
            />

          </View>
        </TouchableOpacity>

        {/* DETAILS */}
        {isExpanded && (
          <View
            style={
              styles.detailsContainer
            }>

            <Text
              style={
                styles.detailsTitle
              }>
              Book More Details :
            </Text>

            <View
              style={
                styles.detailsGrid
              }>

              <DetailItem
                label="Language"
                value={item.language}
              />

              <DetailItem
                label="Edition"
                value={
                  item.book_edition
                }
              />

              <DetailItem
                label="Subject"
                value={item.subject}
              />

              <DetailItem
                label="Class"
                value={item.class_name}
              />

              <DetailItem
                label="Access No"
                value={item.access_no}
              />

              <DetailItem
                label="ISBN"
                value={item.isbn}
              />

              <DetailItem
                label="Price"
                value={
                  item.price
                    ? `₹${item.price}`
                    : 'N/A'
                }
              />

              <DetailItem
                label="Remarks"
                value={
                  item.remarks
                }
              />

            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>

      <FullScreenLoader
        visible={loading}
      />

      {/* =========================
          TOTAL / RECENT TABS
      ========================== */}
      <View
        style={
          styles.tabsContainer
        }>

        {/* TOTAL BOOKS */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.tabCard,
            activeTab === 'total' &&
              styles.activeTab,
          ]}
          onPress={() =>
            handleTabPress('total')
          }>

          <View
            style={
              styles.tabIconContainer
            }>
            <Image
              source={require('../assets/images/total_books.png')}
              style={
                styles.tabIcon
              }
              resizeMode="contain"
            />
          </View>

          <View
            style={
              styles.tabTextContainer
            }>
            <Text
              style={
                styles.tabTitle
              }>
              Total Books
            </Text>

            <Text
              style={
                styles.tabCount
              }>
              {totalBooks}
            </Text>
          </View>

        </TouchableOpacity>

        {/* RECENT BOOKS */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.tabCard,
            activeTab === 'recent' &&
              styles.activeTab,
          ]}
          onPress={() =>
            handleTabPress('recent')
          }>

          <View
            style={[
              styles.tabIconContainer,
              styles.recentIconContainer,
            ]}>
            <Image
              source={require('../assets/images/recent_books.png')}
              style={[
                styles.tabIcon,
                styles.recentIcon,
              ]}
              resizeMode="contain"
            />
          </View>

          <View
            style={
              styles.tabTextContainer
            }>
            <Text
              style={
                styles.tabTitle
              }>
              Recent Books
            </Text>

            <Text
              style={
                styles.tabCount
              }>
              {latestBooks}
            </Text>
          </View>

        </TouchableOpacity>

      </View>

      {/* =========================
          SEARCH
      ========================== */}
     <View style={styles.searchContainer}>

      {/* Input wrapper */}
      <View style={styles.searchInputWrapper}>

        <TextInput
          value={searchText}
          onChangeText={setSearchText}
          placeholder="Search Book"
          placeholderTextColor={Colors.text_hint}
          style={styles.searchInput}
          returnKeyType="search"
        />

        {/* Clear button */}
        {searchText.length > 0 && (
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.clearButton}
            onPress={() => {
              setSearchText('');
              setSearchValue('');
              setPage(1);
              setExpandedBookId(null);

              // Reload all books after clearing
              loadBookList(1, '', false);
            }}>
            <Text style={styles.clearButtonText}>
              ×
            </Text>
          </TouchableOpacity>
        )}

      </View>

      {/* Search button */}
      <TouchableOpacity
        activeOpacity={0.8}
        style={styles.searchButton}
        onPress={() => {
          const value = searchText.trim();

          setSearchValue(value);
          setPage(1);
          setExpandedBookId(null);

          loadBookList(
            1,
            value,
            false,
          );
        }}>

        <Text style={styles.searchButtonText}>
          Search
        </Text>

      </TouchableOpacity>

    </View>

      {/* =========================
          BOOK LIST
      ========================== */}
      <FlatList
        data={displayedBooks}
        renderItem={renderBook}
        keyExtractor={(
          item,
          index,
        ) =>
          `${item.id}-${index}`
        }
        showsVerticalScrollIndicator={
          false
        }
        contentContainerStyle={
          styles.listContainer
        }
        refreshing={refreshing}
        onRefresh={
          handleRefresh
        }
        onEndReached={
          handleLoadMore
        }
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          !loading ? (
            <View
              style={
                styles.emptyContainer
              }>
              <Text
                style={
                  styles.emptyText
                }>
                No books found
              </Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          loadingMore ? (
            <View
              style={
                styles.loadingMore
              }>
              <ActivityIndicator
                size="small"
                color={
                  Colors.primary
                }
              />

              <Text
                style={
                  styles.loadingText
                }>
                Loading more books...
              </Text>
            </View>
          ) : (
            <View
              style={
                styles.bottomSpace
              }
            />
          )
        }
      />
    </View>
  );
};

/* =================================
   DETAIL ITEM
================================= */

const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) => {
  return (
    <View
      style={
        styles.detailItem
      }>

      <Text
        style={
          styles.detailLabel
        }>
        {label}:
      </Text>

      <Text
        style={
          styles.detailValue
        }
        numberOfLines={2}>
        {value || 'N/A'}
      </Text>

    </View>
  );
};

export default AllBookListComponent;

/* =================================
   STYLES
================================= */

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor:
      Colors.background,
  },

  /* =========================
     TABS
  ========================== */

  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal:
      card.padding_card_medium,
    paddingTop:
      card.padding_card_medium,
    gap: 8,
  },

  tabCard: {
    flex: 1,
    height: 55,

    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal:
      card.padding_samll,

    backgroundColor:
      Colors.white,

    borderWidth: 1,
    borderColor:
      Colors.border_color,

    borderRadius:
      card.border_radius_card_small,
  },

  activeTab: {
    borderColor:
      Colors.primary,
    backgroundColor:
      Colors.white,
  },

  tabIconContainer: {
    width: 34,
    height: 34,

    borderRadius:
      card.border_radius_card_small,

    backgroundColor:
      Colors.tab_icon_back,

    justifyContent: 'center',
    alignItems: 'center',
  },

  recentIconContainer: {
    backgroundColor:
      Colors.present,
  },

  tabIcon: {
    width: 22,
    height: 22,
    tintColor:
      Colors.primary,
  },

  recentIcon: {
    tintColor:
      Colors.success,
  },

  tabTextContainer: {
    marginLeft: 7,
  },

  tabTitle: {
    fontFamily:
      FontFamily.regular,

    fontSize:
      FontSize.very_small,

    color:
      Colors.text_light,
  },

  tabCount: {
    marginTop: 2,

    fontFamily:
      FontFamily.bold,

    fontSize:
      FontSize.medium,

    color:
      Colors.primary,
  },

  /* =========================
     SEARCH
  ========================== */
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingHorizontal: card.padding_card_medium,
    paddingVertical: card.padding_card_medium,

    gap: 8,
  },

  searchInputWrapper: {
    flex: 1,
    position: 'relative',
    justifyContent: 'center',
  },

  searchInput: {
    height: 40,

    borderWidth: 1,
    borderColor: Colors.border_color,

    borderRadius: card.border_radius_card_small,

    backgroundColor: Colors.white,

    paddingLeft: card.padding_samll,
    paddingRight: 40,

    fontFamily: FontFamily.regular,
    fontSize: FontSize.small,

    color: Colors.text,
  },

  clearButton: {
    position: 'absolute',

    right: 8,

    width: 20,
    height: 20,

    borderRadius: 10,

    backgroundColor: Colors.light_gray,

    justifyContent: 'center',
    alignItems: 'center',
  },

  clearButtonText: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.medium,
    color: Colors.text_light,

    // Helps visually center ×
    lineHeight: 20,
  },

  searchButton: {
    height: 40,

    paddingHorizontal: 14,

    borderRadius: card.border_radius_card_small,

    backgroundColor: Colors.primary,

    justifyContent: 'center',
    alignItems: 'center',
  },

  searchButtonText: {
    color: Colors.button_text,

    fontFamily: FontFamily.semiBold,

    fontSize: FontSize.very_small,
  },


  /* =========================
     LIST
  ========================== */

  listContainer: {
    paddingHorizontal:
      card.padding_card_medium,

    paddingTop: 0,

    // Keep last item above floating button
    paddingBottom: 100,
  },

  /* =========================
     BOOK CARD
  ========================== */

  bookCard: {
    backgroundColor:
      Colors.background_list_item,

    borderRadius:
      card.border_radius_card_small,

    marginBottom:
      card.margin_bottom,

    borderWidth: 1,
    borderColor:
      Colors.border_color,

    overflow: 'hidden',

    elevation: 1,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },

  bookCardExpanded: {
    borderColor:
      Colors.primary,
  },

  bookHeader: {
    minHeight: 70,

    flexDirection: 'row',
    alignItems: 'center',

    padding:
      card.padding_samll,
  },

  /* =========================
     BOOK ICON
  ========================== */

  bookIconContainer: {
    width: 40,
    height: 45,

    borderRadius:
      card.border_radius_card_small,

    backgroundColor:
      Colors.card_background_grey,

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 8,
  },

  bookIcon: {
    width: 28,
    height: 28,
    tintColor:
      Colors.menu_tint,
  },

  /* =========================
     BOOK INFO
  ========================== */

  bookInfo: {
    flex: 1,
    paddingRight: 5,
  },

  bookName: {
    fontFamily:
      FontFamily.semiBold,

    fontSize:
      FontSize.small,

    color:
      Colors.text,

    marginBottom: 3,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  infoLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.very_small,
    color: Colors.text_light,
    marginRight: 2,
  },

  infoValue: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.very_small,
    color: Colors.text_light,
  },

  publisher: {
    fontFamily:
      FontFamily.regular,

    fontSize:
      FontSize.vv_small,

    color:
      Colors.text_light,
  },

  /* =========================
     RIGHT
  ========================== */

  rightSection: {
    minWidth: 70,
    alignSelf: 'stretch',

    justifyContent: 'flex-end',
    alignItems: 'flex-end',

    paddingBottom: 2,

    flexDirection: 'row',
  },
  viewDetails: {
    fontFamily:
      FontFamily.semiBold,

    fontSize:
      FontSize.very_small,

    color:
      Colors.primary,

    marginBottom: 2,
  },

  arrow: {
    fontSize:
      FontSize.medium,

    color:
      Colors.primary,

    fontFamily:
      FontFamily.medium,
  },

  /* =========================
     DETAILS
  ========================== */

  detailsContainer: {
    borderTopWidth: 1,
    borderTopColor:
      Colors.border_color,

    backgroundColor:
      Colors.background,

    padding:
      card.padding_card_medium,
  },

  detailsTitle: {
    fontFamily:
      FontFamily.semiBold,

    fontSize:
      FontSize.small,

    color:
      Colors.text,

    marginBottom: 10,
  },

  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  detailItem: {
    width: '50%',
    marginBottom: 8,
    paddingRight: 8,
  },

  detailLabel: {
    fontFamily:
      FontFamily.medium,

    fontSize:
      FontSize.very_small,

    color:
      Colors.menu_tint,

    marginBottom: 2,
  },

  detailValue: {
    fontFamily:
      FontFamily.regular,

    fontSize:
      FontSize.very_small,

    color:
      Colors.text_light,
  },

  /* =========================
     EMPTY
  ========================== */

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },

  emptyText: {
    fontFamily:
      FontFamily.regular,

    fontSize:
      FontSize.regular,

    color:
      Colors.text_light,
  },

  /* =========================
     PAGINATION
  ========================== */

  loadingMore: {
    paddingVertical: 15,

    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    marginTop: 5,

    fontFamily:
      FontFamily.regular,

    fontSize:
      FontSize.very_small,

    color:
      Colors.text_light,
  },

  bottomSpace: {
    height: 60,
  },

  arrowIcon: {
    width: 14,
    height: 14,
    tintColor: Colors.primary,
    marginLeft: 2,
    marginBottom: 2,
  },

  arrowIconExpanded: {
    transform: [{rotate: '180deg'}],
  },
});