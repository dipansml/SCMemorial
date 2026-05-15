import React, { useState } from 'react';
import { View, StyleSheet, Image, Text, ImageBackground, ScrollView, Alert } from 'react-native';
import AppHeader from '../component/AppHeader';
import { container, FontFamily, FontSize, card } from '../theme/fonts_dimen';
import Colors from '../theme/colors';
import Calendar from '../component/Calendar';
import { openParentDrawer } from '../navigation/navigationRef';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AttendanceData } from '../Model/StudentAttendance/AttendanceData';
import { StatusType } from '../Model/StudentAttendance/AttendanceItem';
import { useEffect } from 'react';
import StorageManager from '../services/StorageManager';
import { Api } from '../services/Api';
import FullScreenLoader from '../view/FullScreenLoader';

const Attendance = ({ navigation }: { navigation: any }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
   const [attendanceData, setAttendanceData] =
    useState<AttendanceData | null>(null);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    loadAttendance(new Date(currentDate).toISOString());
  }, []);


  const loadAttendance = async (date: String) => {

    try {

      setLoading(true);

      console.log(new Date(currentDate).toISOString());
      const dateOnly = date.split('T')[0];
      console.log(dateOnly);

      const response =
        await Api.getStudentAttendance({
          user_id:
            await StorageManager.getStudentId(),
          month_date: dateOnly,
        });

      console.log(
        'Attendance Response:',
        response
      );

      if (
        response &&
        response.status === 200 &&
        response.data
      ) {

        setAttendanceData({
          name: response.data.name,
          class: response.data.class,
          roll: response.data.roll,
          academic_year:
            response.data.academic_year,
          present:
            response.data.present,
          absent:
            response.data.absent,
          holiday:
            response.data.holiday,
          attendance_percentage:
            response.data.attendance_percentage,
          AttendanceItem:
            response.data.AttendanceItem,
            gender: response.data.gender,
        });

      } else {

        Alert.alert(
          'Error',
          response?.message ||
            'Failed to load attendance'
        );
      }

    } catch (error: any) {

      console.log(
        'Attendance Error:',
        error?.response?.data ||
          error.message
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
  

  return (
    <SafeAreaView style={styles.container}>
      <FullScreenLoader visible={loading} />
      <AppHeader
        title="Attendance"
        onMenuPress={openParentDrawer}
        onBellPress={() => console.log('Bell')}
        onProfilePress={() => console.log('Profile')}
        navigation={navigation}
      />
      <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
              <View style={styles.profileCard}>
                  <Image
                      source= {attendanceData
                    ?.gender === 'Female'
                    ? require('../assets/images/student2.png')
                    : require('../assets/images/student1.png')
                }
                      style={styles.avatar}
                  />

                  <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{attendanceData?.name}</Text>
                  <Text style={styles.subText}>Class: {attendanceData?.class} • Roll No: {attendanceData?.roll}</Text>

                  <View style={styles.badge}>
                      <Text style={styles.badgeText}>ACADEMIC YEAR {attendanceData?.academic_year}</Text>
                  </View>
                  </View>
              </View>

              {/* Bottom Section */}
              <View style={styles.bottomRow}>
                  {/* Attendance Card */}
                      <ImageBackground 
                          source={require('../assets/images/attendance_card.png')}
                          style={styles.attendanceCard}
                          imageStyle={{ borderRadius: card.border_radius_card }}>
                              <Image
                                  source={require('../assets/images/graph.png')}
                                  style={styles.graph}
                              />
                          <Text style={styles.attendanceTitle}>Monthly Attendance</Text>
                          <Text style={styles.attendanceValue}>{attendanceData?.attendance_percentage}%</Text>
                      </ImageBackground>
                  {/* Stats */}
                  <View style={styles.statsContainer}>

                  <View style={[styles.statBox, styles.present]}>
                      <Text style={styles.statLabel}>PRESENT</Text>
                      <Text style={styles.statValue}>{attendanceData?.present}</Text>
                  </View>

                  <View style={[styles.statBox, styles.absent]}>
                      <Text style={styles.statLabel}>ABSENT</Text>
                      <Text style={styles.statValue}>{attendanceData?.absent}</Text>
                  </View>

                  <View style={[styles.statBox, styles.holiday]}>
                      <Text style={styles.statLabel}>HOLIDAY</Text>
                      <Text style={styles.statValue}>{attendanceData?.holiday}</Text>
                  </View>
                  </View>
              </View>
              <View style={styles.calenderContainer}>
                  {/* <Calendar attendanceData={attendanceData} /> */}
                  <Calendar
                      attendanceData={attendanceData?.AttendanceItem || []}
                      onMonthChange={(date) => {
                      console.log('Selected Month:', date.toISOString());

                    // API call here
                    loadAttendance(date.toISOString())
                    }}
                  />
              </View>
            </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Attendance;

const styles = StyleSheet.create({
  container: {
     flex: 1,
     backgroundColor: Colors.background, 
},
scrollContent: {
    padding: 0,
  },
  content: { 
        flex: 1,
        padding: container.container_padding, 
    },
   profileCard: {
        flexDirection: 'row',
        backgroundColor: Colors.background_list_item,
        borderRadius: card.border_radius_card,
        padding: 16,
        alignItems: 'center',
        marginBottom: 16,
        elevation: 3,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: card.border_radius_profile,
    marginRight: 12,
  },

  graph: {
    width: 40,
    height: 40,
    marginBottom:20,
  },

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

  bottomRow: {
    height: 160,
    flexDirection: 'row',
  },

  calenderContainer: {
    marginTop: 20,
    marginBottom: 16,
  },

  attendanceCard: {
    height: 170,
    width: 160,
    padding: 16,
    marginRight: 10,
    justifyContent: 'center',
    overflow: 'hidden',
  },

  attendanceTitle: {
    color: Colors.white,
    width:'90%',
    fontSize: FontSize.regular,
    fontFamily: FontFamily.medium,
    marginBottom: 10,
  },

  attendanceValue: {
    color: Colors.white,
    fontSize: FontSize.xxxLarge,
    fontWeight: 'bold',
    fontFamily: FontFamily.bold,
  },

  statsContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },

  statBox: {
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  present: {
    height: container.attendance_stat,
    backgroundColor: Colors.present,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border_color,
  },

  absent: {
    height: container.attendance_stat,
    backgroundColor: Colors.absent,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border_color,
  },

  holiday: {
    height: container.attendance_stat,
    backgroundColor: Colors.holiday,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border_color,
  },

  statLabel: {
    fontSize: FontSize.regular,
    fontFamily: FontFamily.medium,
    color: Colors.text,
  },

  statValue: {
    fontSize: FontSize.xxLarge,
    fontFamily: FontFamily.bold,
    fontWeight: 'bold',
    color: Colors.text,
  },
});