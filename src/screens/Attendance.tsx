import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  ImageBackground,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppHeader from '../component/AppHeader';
import Calendar from '../component/Calendar';
import FullScreenLoader from '../view/FullScreenLoader';
import { container, FontFamily, FontSize, card } from '../theme/fonts_dimen';
import Colors from '../theme/colors';
import { openParentDrawer } from '../navigation/navigationRef';
import { AttendanceData } from '../Model/StudentAttendance/AttendanceData';
import StorageManager from '../services/StorageManager';
import { Api } from '../services/Api';
const Attendance = ({ navigation }: { navigation: any }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [attendanceData, setAttendanceData] = useState<AttendanceData | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    loadAttendance(new Date().toISOString());
  }, []);
  const loadAttendance = async (date: string) => {
    try {
      setLoading(true);
      const dateOnly = date.split('T')[0];
      console.log('Attendance Date:', dateOnly);
      const response = await Api.getStudentAttendance({
        user_id: await StorageManager.getStudentId(),
        month_date: dateOnly,
      });
      console.log('Attendance Response:', response);
      if (response && response.status === 200 && response.data) {
        setAttendanceData({
          name: response.data.name,
          class: response.data.class,
          roll: response.data.roll,
          academic_year: response.data.academic_year,
          present: response.data.present,
          absent: response.data.absent,
          holiday: response.data.holiday,
          halfday: response.data.halfday,
          attendance_percentage: response.data.attendance_percentage,
          AttendanceItem: response.data.AttendanceItem || [],
          gender: response.data.gender,
          ExtraClass: response.data.ExtraClass || [],
        });
      } else {
        Alert.alert('Error', response?.message || 'Failed to load attendance');
      }
    } catch (error: any) {
      console.log('Attendance Error:', error?.response?.data || error?.message);
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Something went wrong',
      );
    } finally {
      setLoading(false);
    }
  };
  const formatExtraClassDate = (date: string) => {
    try {
      return new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return date;
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      {' '}
      <FullScreenLoader visible={loading} />{' '}
      <AppHeader
        title="Attendance"
        onMenuPress={openParentDrawer}
        onBellPress={() => console.log('Bell')}
        onProfilePress={() => console.log('Profile')}
        navigation={navigation}
      />{' '}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {' '}
        <View style={styles.content}>
          {' '}
          {/* ===================================================== PROFILE CARD ===================================================== */}{' '}
          <View style={styles.profileCard}>
            {' '}
            <Image
              source={
                attendanceData?.gender === 'Female'
                  ? require('../assets/images/student2.png')
                  : require('../assets/images/student1.png')
              }
              style={styles.avatar}
            />{' '}
            <View style={styles.profileInfo}>
              {' '}
              <Text style={styles.name}>
                {' '}
                {attendanceData?.name || ''}{' '}
              </Text>{' '}
              <Text style={styles.subText}>
                {' '}
                Class: {attendanceData?.class || ''} • Roll No:{' '}
                {attendanceData?.roll || ''}{' '}
              </Text>{' '}
              <View style={styles.badge}>
                {' '}
                <Text style={styles.badgeText}>
                  {' '}
                  ACADEMIC YEAR {attendanceData?.academic_year || ''}{' '}
                </Text>{' '}
              </View>{' '}
            </View>{' '}
          </View>{' '}
          {/* ===================================================== ATTENDANCE SECTION ===================================================== */}{' '}
          <View style={styles.bottomRow}>
            {' '}
            {/* ================= LEFT ================= */}{' '}
            <View style={styles.leftSection}>
              {' '}
              <View style={styles.attendanceCard}>
                <Image
                  source={require('../assets/images/graph.png')}
                  style={styles.graph}
                />

                <Text style={styles.attendanceTitle}>
                  Monthly Attendance
                </Text>

                <Text style={styles.attendanceValue}>
                  {attendanceData?.attendance_percentage || 0}%
                </Text>
              </View>
            </View>{' '}
            {/* ================= RIGHT ================= */}{' '}
            <View style={styles.rightSection}>
              {' '}
              {/* PRESENT */}{' '}
              <View style={[styles.statBox, styles.present]}>
                {' '}
                <Text style={styles.statLabel}> PRESENT </Text>{' '}
                <Text style={styles.statValue}>
                  {' '}
                  {attendanceData?.present || 0}{' '}
                </Text>{' '}
              </View>{' '}
              {/* ABSENT */}{' '}
              <View style={[styles.statBox, styles.absent]}>
                {' '}
                <Text style={styles.statLabel}> ABSENT </Text>{' '}
                <Text style={styles.statValue}>
                  {' '}
                  {attendanceData?.absent || 0}{' '}
                </Text>{' '}
              </View>{' '}
              {/* HOLIDAY */}{' '}
              <View style={[styles.statBox, styles.holiday]}>
                {' '}
                <Text style={styles.statLabel}> HOLIDAY </Text>{' '}
                <Text style={styles.statValue}>
                  {' '}
                  {attendanceData?.holiday || 0}{' '}
                </Text>{' '}
              </View>{' '}
              {/* HALF DAY */}{' '}
              <View style={[styles.statBox, styles.halfDay]}>
                {' '}
                <Text style={styles.statLabel}> HALF DAY </Text>{' '}
                <Text style={styles.statValue}>
                  {' '}
                  {attendanceData?.halfday || 0}{' '}
                </Text>{' '}
              </View>{' '}
            </View>{' '}
          </View>{' '}
          {/* ===================================================== EXTRA CLASS ===================================================== */}{' '}
          {attendanceData?.ExtraClass &&
            attendanceData.ExtraClass.length > 0 && (
              <View style={styles.extraClassCard}>
                {' '}
                {/* ICON */}{' '}
                <View style={styles.extraClassIcon}>
                  {' '}
                  <Text style={styles.extraClassIconText}> 📚 </Text>{' '}
                </View>{' '}
                {/* CONTENT */}{' '}
                <View style={styles.extraClassContent}>
                  {' '}
                  <Text style={styles.extraClassTitle}> New Class </Text>{' '}
                  <Text style={styles.extraClassDate}>
                    {' '}
                    Extra class scheduled on{' '}
                    {formatExtraClassDate(
                      attendanceData.ExtraClass[0].date,
                    )}{' '}
                  </Text>{' '}
                </View>{' '}
              </View>
            )}{' '}
          {/* ===================================================== CALENDAR ===================================================== */}{' '}
          <View style={styles.calenderContainer}>
            {' '}
            <Calendar
              attendanceData={attendanceData?.AttendanceItem || []}
              onMonthChange={date => {
                console.log('Selected Month:', date.toISOString());
                setCurrentDate(date);
                loadAttendance(date.toISOString());
              }}
            />{' '}
          </View>{' '}
        </View>{' '}
      </ScrollView>{' '}
    </SafeAreaView>
  );
};
export default Attendance;
/* ============================================================ STYLES ============================================================ */ const styles =
  StyleSheet.create({
    /* ============================================================ CONTAINER ============================================================ */ container:
      { flex: 1, backgroundColor: Colors.background },
    scrollContent: { padding: 0 },
    content: { flex: 1, padding: container.container_padding },
    /* ============================================================ PROFILE ============================================================ */ profileCard:
      {
        width: '100%',
        flexDirection: 'row',
        backgroundColor: Colors.background_list_item,
        borderRadius: card.border_radius_card,
        padding: 16,
        alignItems: 'center',
        marginBottom: 16,
        elevation: 3,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
      },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: card.border_radius_profile,
      marginRight: 12,
    },
    profileInfo: { flex: 1 },
    name: {
      fontSize: FontSize.medium,
      color: Colors.text,
      fontFamily: FontFamily.bold,
    },
    subText: {
      fontSize: FontSize.small,
      color: Colors.text,
      marginVertical: 4,
      fontFamily: FontFamily.regular,
    },
    badge: {
      backgroundColor: '#E5ECF6',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      alignSelf: 'flex-start',
    },
    badgeText: {
      fontSize: FontSize.very_small,
      color: Colors.text,
      fontFamily: FontFamily.semiBold,
      marginVertical: 4,
    },
    /* ============================================================ ATTENDANCE ROW ============================================================ */ bottomRow:
      {
        width: '100%',
        height: 230,
        flexDirection: 'row',
        alignItems: 'stretch',
      },
    /* ============================================================ LEFT SECTION flex: 1 means exactly half of available width. ============================================================ */ 
    leftSection:
      {
        flex: 1,
        height: 230,
        marginRight: 2,
        borderRadius: 30,
        overflow: 'hidden',
      },
    attendanceCard: {
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      padding: 16,
      backgroundColor: Colors.theme_color,
    },
    attendanceImage: { borderRadius: 40 },
    /* ============================================================ LEFT CARD CONTENT ============================================================ */ graph:
      { width: 40, height: 40, marginBottom: 18 },
    attendanceTitle: {
      color: Colors.white,
      width: '90%',
      fontSize: FontSize.regular,
      fontFamily: FontFamily.medium,
      marginBottom: 8,
    },
    attendanceValue: {
      color: Colors.white,
      fontSize: FontSize.xxxLarge,
      fontFamily: FontFamily.bold,
    },
    /* ============================================================ RIGHT SECTION flex: 1 means exactly half of available width. ============================================================ */ rightSection:
      { flex: 1, height: 230, marginLeft: 6, justifyContent: 'space-between' },
    /* ============================================================ STAT CARDS ============================================================ */ statBox:
      {
        flex: 1,
        width: '100%',
        borderRadius: 12,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 6,
        borderWidth: 1,
        borderColor: Colors.border_color,
      },
    lastStatBox: { marginBottom: 0 },
    present: { backgroundColor: Colors.present },
    absent: { backgroundColor: Colors.absent },
    holiday: { backgroundColor: Colors.holiday },
    halfDay: { backgroundColor: Colors.halfday, marginBottom: 0 },
    statLabel: {
      fontSize: FontSize.regular,
      fontFamily: FontFamily.medium,
      color: Colors.text,
    },
    statValue: {
      fontSize: FontSize.xxLarge,
      fontFamily: FontFamily.bold,
      color: Colors.text,
    },
    /* ============================================================ EXTRA CLASS ============================================================ */ extraClassCard:
      {
        width: '100%',
        minHeight: 75,
        marginTop: 16,
        padding: 12,
        borderRadius: card.border_radius_card,
        backgroundColor: Colors.background_list_item,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 3,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.12,
        shadowRadius: 4,
      },
    extraClassIcon: {
      width: 45,
      height: 45,
      borderRadius: 12,
      backgroundColor: '#E5ECF6',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    extraClassIconText: { fontSize: 22 },
    extraClassContent: { flex: 1 },
    extraClassTitle: {
      fontSize: FontSize.medium,
      fontFamily: FontFamily.bold,
      color: Colors.text,
      marginBottom: 3,
    },
    extraClassDate: {
      fontSize: FontSize.small,
      fontFamily: FontFamily.regular,
      color: Colors.text,
    },
    extraClassBadge: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 12,
      backgroundColor: Colors.present,
    },
    extraClassBadgeText: {
      fontSize: FontSize.very_small,
      fontFamily: FontFamily.semiBold,
      color: Colors.text,
    },
    /* ============================================================ CALENDAR ============================================================ */ calenderContainer:
      { marginTop: 20, marginBottom: 16 },
  });
