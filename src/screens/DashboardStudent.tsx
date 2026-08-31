import React, { useCallback, useEffect, useState } from 'react';

import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Alert,
} from 'react-native';

import AppHeader from '../component/AppHeader';
import { openParentDrawer } from '../navigation/navigationRef';
import Colors from '../theme/colors';

import {
  Button,
  card,
  container,
  FontFamily,
  FontSize,
  iconBox,
} from '../theme/fonts_dimen';

import GroupedBarChart from '../component/GroupedBarChart';

import { SafeAreaView } from 'react-native-safe-area-context';

import { BackHandler } from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import { RootStackParamList } from '../../App';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Api } from '../services/Api';
import StorageManager from '../services/StorageManager';

import { DashboardData } from '../Model/Dashboard/DashboardData';
import FullScreenLoader from '../view/FullScreenLoader';

type DashboardStudentProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

const DashboardStudent = ({ navigation }: DashboardStudentProps) => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null,
  );

  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        BackHandler.exitApp();
        return true;
      };

      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => subscription.remove();
    }, []),
  );

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const response = await Api.getDashboard({
        user_id: await StorageManager.getStudentId(),
      });

      console.log('Dashboard Response:', response);

      if (response && response.status === 200 && response.data) {
        setDashboardData(response.data);
      } else {
        Alert.alert('Error', response?.message || 'Failed to load dashboard');
      }
    } catch (error: any) {
      console.log('Dashboard Error:', error?.response?.data || error.message);

      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Something went wrong',
      );
    } finally {
      setLoading(false);
    }
  };

  // ✅ Chart Data
  const chartData =
    dashboardData?.performance_overview?.map(item => ({
      subject: item.subject,
      halfYearly: Number(item.halfYearly),
      annual: Number(item.annual),
    })) || [];

  // ✅ First Library Book
  const firstBook = dashboardData?.books?.[0];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FullScreenLoader visible={loading} />
      <AppHeader
        title="Dashboard"
        onMenuPress={openParentDrawer}
        onBellPress={() => console.log('Bell')}
        navigation={navigation}
      />

      <View style={styles.content}>
        <View style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={{
              padding: container.container_padding,
            }}
          >
            {/* ✅ Profile Card */}
            <View style={styles.card}>
              <Image
                source={
                  dashboardData?.studentdetails?.gender === 'Female'
                    ? require('../assets/images/student2.png')
                    : require('../assets/images/student1.png')
                }
                style={styles.avatar}
              />

              <Text style={styles.name}>
                {dashboardData?.studentdetails?.name}
              </Text>

              <Text style={styles.id}>
                ID:
                {dashboardData?.studentdetails?.code}
              </Text>

              <View style={styles.infoBox}>
                <Text style={styles.label}>Class</Text>

                <Text style={styles.value}>
                  {dashboardData?.studentdetails?.class_name}
                </Text>
              </View>

              <View style={styles.infoBox}>
                <Text style={styles.label}>Section</Text>

                <Text style={styles.value}>
                  {dashboardData?.studentdetails?.section_name}
                </Text>
              </View>

              <View style={styles.infoBox}>
                <Text style={styles.label}>Roll No.</Text>

                <Text style={styles.value}>
                  {dashboardData?.studentdetails?.roll_number?.trim() || '-'}
                </Text>
              </View>

              <View style={styles.infoBox}>
                <Text style={styles.label}>Father Name</Text>

                <Text style={styles.value}>
                  {dashboardData?.studentdetails?.father_name?.trim() || '-'}
                </Text>
              </View>

              <View style={styles.infoBox}>
                <Text style={styles.label}>Mother Name</Text>

                <Text style={styles.value}>
                  {dashboardData?.studentdetails?.mother_name?.trim() || '-'}
                </Text>
              </View>

              <View style={styles.infoBox}>
                <Text style={styles.label}>Address</Text>

                <Text style={styles.value}>
                  {dashboardData?.studentdetails?.permanent_address?.trim() ||
                    '-'}
                </Text>
              </View>

              <View style={styles.infoBox}>
                <Text style={styles.label}>Email</Text>

                <Text style={styles.value}>
                  {dashboardData?.studentdetails?.email?.trim() || '-'}
                </Text>
              </View>

              <View style={styles.infoBox}>
                <Text style={styles.label}>Aadhaar Card</Text>

                <Text style={styles.value}>
                  {dashboardData?.studentdetails?.aadhaar_no?.trim() ||
                    '-'}
                </Text>
              </View>

              <View style={styles.infoBox}>
                <Text style={styles.label}>Contact No</Text>

                <Text style={styles.value}>
                  {dashboardData?.studentdetails?.father_mobile?.trim() || '-'}
                </Text>
              </View>

              {dashboardData?.studentdetails?.bus_no?.trim() && (
                <View style={styles.infoBox}>
                  <Text style={styles.label}>Bus No</Text>

                  <Text style={styles.value}>
                    {dashboardData?.studentdetails?.bus_no?.trim() || '-'}
                  </Text>
                </View>
              )}
            </View>

            {/* ✅ Academic Overview */}
            <View style={styles.cardGray}>
              <Text style={styles.sectionTitle}>Academic Overview</Text>

              <View style={styles.row}>
                <View style={styles.iconBox}>
                  <Image
                    source={require('../assets/images/icons/teacher.png')}
                    style={styles.icon}
                    resizeMode="contain"
                  />
                </View>

                <View>
                  <Text style={styles.subLabel}>Class Teacher</Text>

                  <Text style={styles.subValue}>
                    {dashboardData?.studentdetails?.teacher_name}
                  </Text>
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.iconBox}>
                  <Image
                    source={require('../assets/images/icons/academic.png')}
                    style={styles.icon}
                    resizeMode="contain"
                  />
                </View>

                <View>
                  <Text style={styles.subLabel}>School</Text>

                  <Text style={styles.subValue}>
                    Satish Chandra Memorial School
                  </Text>
                </View>
              </View>

              <View style={styles.row}>
                <View style={styles.iconBox}>
                  <Image
                    source={require('../assets/images/icons/attendance.png')}
                    style={styles.icon}
                    resizeMode="contain"
                  />
                </View>

                <View>
                  <Text style={styles.subLabel}>Admission Date</Text>

                  <Text style={styles.subValue}>
                    {dashboardData?.studentdetails?.admissiondate}
                  </Text>
                </View>
              </View>
            </View>

            {/* ✅ Performance */}
            <View style={styles.card}>
              <Text style={styles.sectionTitleLarge}>Performance Overview</Text>

              <Text style={styles.subLabelRegular}>Last updated recently</Text>

              <GroupedBarChart data={chartData} />
            </View>

            {/* ✅ Library */}
            <View style={styles.cardGray}>
              <Text style={styles.sectionTitle}>Library Records</Text>

              {firstBook && (
                <View style={styles.cardSmallRadius}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() =>
                      navigation.navigate('Library', { isback: true })
                    }
                  >
                    <View style={styles.rowLibrary}>
                      <View style={styles.iconBoxGrey}>
                        <Image
                          source={require('../assets/images/icons/book.png')}
                          style={styles.iconLarge}
                          resizeMode="contain"
                        />
                      </View>

                      <View
                        style={{
                          flex: 1,
                        }}
                      >
                        <Text style={styles.subValue}>{firstBook.title}</Text>

                        <Text style={styles.subLabel}>
                          Author: {firstBook.author}
                        </Text>

                        <View
                          style={[
                            styles.badgeGrey,
                            {
                              marginTop: 10,
                            },
                          ]}
                        >
                          <Text style={styles.badgeTextBlue}>
                            Due: {firstBook.dueDate}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DashboardStudent;

const styles = StyleSheet.create({
  content: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  card: {
    backgroundColor: Colors.background_list_item,
    borderRadius: card.border_radius_card,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },

  cardSmallRadius: {
    backgroundColor: Colors.background_list_item,
    borderRadius: card.border_radius_card_small,
    padding: 16,
  },

  cardImage: {
    height: 180,
    padding: 20,
    justifyContent: 'center',
  },

  imageRadius: {
    borderRadius: card.border_radius_card,
  },

  imageStyle: {
    borderRadius: card.border_radius_card,
  },

  cardWrapper: {
    borderRadius: card.border_radius_card,
    overflow: 'hidden',
    backgroundColor: Colors.theme_color,
    marginBottom: 16,
    elevation: 3,
  },

  cardGray: {
    backgroundColor: Colors.card_background_grey,
    borderRadius: card.border_radius_card,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: card.border_radius_card,
    alignSelf: 'center',
    marginBottom: 10,
  },

  name: {
    textAlign: 'center',
    fontSize: FontSize.large,
    fontFamily: FontFamily.bold,
  },

  id: {
    textAlign: 'center',
    color: Colors.theme_color,
    fontFamily: FontFamily.regular,
    marginBottom: 12,
  },

  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.text_box_back,
    padding: 12,
    borderRadius: iconBox.border_radius_card,
    marginBottom: 8,
    width: '100%',
  },

  label: {
    width: 100,
    flexShrink: 0,
    color: Colors.text,
    fontFamily: FontFamily.regular,
    fontSize: FontSize.regular,
  },

  value: {
    flex: 1,
    minWidth: 0,
    flexShrink: 1,
    marginLeft: 15,
    textAlign: 'right',
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.regular,
    lineHeight: 20,
  },

  sectionTitle: {
    fontSize: FontSize.medium,
    fontFamily: FontFamily.medium,
    marginBottom: 12,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  rowLibrary: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconBox: {
    width: 40,
    height: 40,
    borderRadius: iconBox.border_radius_card,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  subLabel: {
    color: Colors.text_hint,
    fontSize: FontSize.small,
    fontFamily: FontFamily.medium,
  },

  subValue: {
    fontSize: FontSize.medium,
    fontFamily: FontFamily.medium,
  },
  subLabelRegular: {
    color: Colors.text_hint,
    fontSize: FontSize.small,
    fontFamily: FontFamily.regular,
  },
  icon: {
    width: 22,
    height: 22,
    tintColor: Colors.theme_color,
  },

  iconLarge: {
    width: 40,
    height: 40,
    tintColor: Colors.menu_tint,
  },

  iconSmallWhite: {
    width: 12,
    height: 12,
    tintColor: Colors.white,
  },
  sectionTitleLarge: {
    fontSize: FontSize.large,
    fontFamily: FontFamily.bold,
    marginBottom: 6,
  },
  bgImage: {
    position: 'absolute',
    width: '100%',
    height: 140,
  },

  title: {
    color: Colors.white,
    fontSize: FontSize.small,
    fontFamily: FontFamily.semiBold,
    marginBottom: 8,
  },

  amount: {
    color: Colors.white,
    fontSize: FontSize.xxxLarge,
    fontFamily: FontFamily.bold,
    marginBottom: 10,
  },

  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#3384D3',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 0.5,
    flexDirection: 'row',
    borderColor: Colors.white,
  },

  badgeGrey: {
    alignSelf: 'flex-start',
    backgroundColor: '#E5EEF7',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 3,
    borderWidth: 0.5,
    flexDirection: 'row',
    borderColor: Colors.white,
  },

  badgeText: {
    color: Colors.white,
    fontSize: FontSize.small,
    fontFamily: FontFamily.semiBold,
  },

  badgeTextBlue: {
    color: Colors.text_theme,
    fontSize: FontSize.small,
    fontFamily: FontFamily.semiBold,
  },

  button: {
    backgroundColor: Colors.white,
    paddingVertical: 14,
    borderRadius: Button.buttonRadius,
    alignItems: 'center',
  },

  buttonText: {
    color: Colors.theme_color,
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.regular,
  },

  iconBoxGrey: {
    width: 70,
    height: 70,
    borderRadius: iconBox.border_radius_card,
    backgroundColor: Colors.iconBackGrey,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
});
