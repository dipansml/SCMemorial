import React from 'react';
import {
  Image,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import Colors from '../theme/colors';
import { FontFamily, FontSize, Header, Menu } from '../theme/fonts_dimen';
import StorageManager from '../services/StorageManager';

type DrawerNavigationProp = NativeStackNavigationProp<RootStackParamList>;

type MenuItem = {
  key: string;
  label: string;
  route: keyof RootStackParamList;
  icon: any;
};

const menuItems: MenuItem[] = [
  {
    key: 'home',
    label: 'Home',
    route: 'LandingStudent',
    icon: require('../assets/images/icons/home.png'),
  },
  {
    key: 'attendance',
    label: 'Attendance Tracking',
    route: 'Attendance',
    icon: require('../assets/images/icons/attendance.png'),
  },
  // {
  //   key: 'Fees',
  //   label: 'Fees Overview',
  //   route: 'Fees',
  //   icon: require('../assets/images/icons/fees_overview.png'),
  // },
  {
    key: 'PaymentHistory',
    label: 'Payment History',
    route: 'PaymentHistory',
    icon: require('../assets/images/icons/payment.png'),
  },
  {
    key: 'events',
    label: 'Events',
    route: 'Events',
    icon: require('../assets/images/icons/events.png'),
  },
  // {
  //   key: 'notice',
  //   label: 'Notices & Announcements',
  //   route: 'Notice',
  //   icon: require('../assets/images/icons/notice.png'),
  // },
  // {
  //   key: 'homework',
  //   label: 'Homework & Updates',
  //   route: 'Homework',
  //   icon: require('../assets/images/icons/homework.png'),
  // },
  {
    key: 'Library',
    label: 'Library',
    route: 'Library',
    icon: require('../assets/images/icons/book.png'),
  },
  // {
  //   key: 'OnlineExam',
  //   label: 'Online Exam',
  //   route: 'OnlineExam',
  //   icon: require('../assets/images/icons/academic.png'),
  // },
];

const StudentDrawer = () => {
  const navigation = useNavigation<DrawerNavigationProp>();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const drawerWidth = Math.min(360, Math.max(280, Math.round(width * 0.72)));
  const footerBottomInset =
    Platform.OS === 'android' ? Math.max(insets.bottom, 16) : insets.bottom;

  // ✅ Get current active screen behind drawer
  const state = navigation.getState();

  // Last route = Drawer, second last = actual screen
  const currentRoute =
    state.routes[state.routes.length - 2]?.name || 'LandingStudent';

  const handleLogout = async () => {
    await StorageManager.clearLoginData();
    navigation.replace('Login');
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Colors.NavBarHeader_color}
      />

      <View style={styles.backdrop}>
        {/* Drawer */}
        <View style={[styles.drawer, { width: drawerWidth }]}>
          {/* Header */}
          <View style={styles.schoolHeader}>
            <Image
              source={require('../assets/images/title_logo.png')}
              style={styles.schoolLogo}
            />
          </View>

          {/* Menu - Only this section scrolls */}
          <ScrollView
            style={styles.menuScroll}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.menuContent}
          >
            {menuItems.map(item => {
              const isActive = currentRoute === item.route;

              return (
                <TouchableOpacity
                  key={item.key}
                  activeOpacity={0.75}
                  style={[styles.menuItem, isActive && styles.menuItemActive]}
                  onPress={() => {
                    navigation.replace(item.route);
                  }}
                >
                  <View style={styles.menuIconWrap}>
                    <Image
                      source={item.icon}
                      style={[
                        styles.menuIcon,
                        isActive && styles.menuIconActive,
                      ]}
                    />
                  </View>

                  <Text
                    style={[
                      styles.menuLabel,
                      isActive && styles.menuLabelActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Logout - Always at bottom */}
          <View style={styles.logoutSection}>
            <View style={styles.devider} />

            <Pressable style={styles.signOutContainer} onPress={handleLogout}>
              <Image
                source={require('../assets/images/icons/logout.png')}
                style={styles.signOutIcon}
              />

              <Text style={styles.signOutText}>Sign Out</Text>
            </Pressable>
          </View>
        </View>
        <Pressable style={styles.overlay} onPress={() => navigation.goBack()} />
      </View>
    </SafeAreaView>
  );
};

export default StudentDrawer;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  backdrop: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.35)',
  },

  schoolLogo: {
    flex: 2,
    resizeMode: 'contain',
  },

  schoolCopy: {
    flex: 1,
  },

  schoolTitle: {
    color: Colors.white,
    fontFamily: FontFamily.bold,
    fontSize: FontSize.regular,
  },

  schoolSubtitle: {
    color: Colors.white,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.very_small,
    opacity: 0.95,
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 10,
    borderRadius: 7,
    marginBottom: 8,
  },

  menuItemActive: {
    backgroundColor: Colors.drawerItemActive,
  },

  menuIconWrap: {
    width: 28,
    alignItems: 'center',
    marginRight: 10,
  },

  menuIcon: {
    width: Menu.menuSize,
    height: Menu.menuSize,
    resizeMode: 'contain',
    tintColor: Colors.menu_tint,
  },

  menuIconActive: {
    width: Menu.menuSize,
    height: Menu.menuSize,
    resizeMode: 'contain',
    tintColor: Colors.primary,
  },

  menuLabel: {
    color: Colors.textColorInpuHeader,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.regular,
  },

  menuLabelActive: {
    color: Colors.theme_color,
    fontFamily: FontFamily.regular,
  },

  signOut: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border_color,
  },

  overlay: {
    flex: 1,
  },

  drawer: {
    backgroundColor: Colors.white,
    flexDirection: 'column',
    marginTop: Header.paddingTop,

    ...Platform.select({
      android: {
        elevation: 8,
      },
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.18,
        shadowRadius: 12,
        shadowOffset: { width: 2, height: 0 },
      },
    }),
  },

  schoolHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '15%',
    backgroundColor: Colors.theme_color,
    padding: 14,
    marginBottom: 10,
  },

  menuScroll: {
    flex: 1,
  },

  menuContent: {
    paddingBottom: 10,
    paddingHorizontal: 10,
  },

  logoutSection: {
    width: '100%',
    backgroundColor: Colors.white,
  },

  devider: {
    borderTopWidth: 1,
    borderTopColor: Colors.border_color,
  },

  signOutContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    height: 55,
    backgroundColor: Colors.background,

    // Android safe-area space
    paddingBottom: Platform.OS === 'android' ? 5 : 0,
  },

  signOutIcon: {
    width: 18,
    height: 18,
    marginRight: 10,
    resizeMode: 'contain',
    tintColor: Colors.menu_tint,
  },

  signOutText: {
    color: Colors.textColorInpuHeader,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.regular,
  },
});
