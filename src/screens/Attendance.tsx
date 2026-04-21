import React from 'react';
import { View, SafeAreaView, StyleSheet, Image, Text, ImageBackground, ScrollView } from 'react-native';
import AppHeader from '../component/AppHeader';
import { container, FontFamily, FontSize, card } from '../theme/fonts_dimen';
import Colors from '../theme/colors';
import Calendar from '../component/Calendar';

type StatusType = 'present' | 'absent' | 'holiday' | 'default';

interface AttendanceItem {
  date: string;
  status: StatusType;
}

const Attendance = () => {
   const attendanceData: AttendanceItem[] = [
    { date: '2026-04-01', status: 'present' },
    { date: '2026-04-02', status: 'present' },
    { date: '2026-04-03', status: 'present' },
    { date: '2026-04-07', status: 'present' },
    { date: '2026-04-08', status: 'present' },
    { date: '2026-04-10', status: 'absent' },
    { date: '2026-04-13', status: 'present' },
    { date: '2026-04-15', status: 'present' },
    { date: '2026-04-16', status: 'present' },
    { date: '2026-04-17', status: 'holiday' },
    { date: '2026-04-20', status: 'absent' },
    { date: '2026-04-21', status: 'present' },
    { date: '2026-04-22', status: 'holiday' },
    { date: '2026-04-23', status: 'present' },
    { date: '2026-04-24', status: 'present' },
    { date: '2026-04-27', status: 'holiday' },
    { date: '2026-04-28', status: 'present' },
    { date: '2026-04-29', status: 'present' },
    { date: '2026-04-30', status: 'present' },
    { date: '2026-04-06', status: 'absent' },
    { date: '2026-04-14', status: 'absent' },
    { date: '2026-04-09', status: 'holiday' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      
      <AppHeader
        title="Attendance"
        onMenuPress={() => console.log('Menu')}
        onBellPress={() => console.log('Bell')}
        onProfilePress={() => console.log('Profile')}
      />
      <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
              <View style={styles.profileCard}>
                  <Image
                      source={require('../assets/images/student1.png')}
                      style={styles.avatar}
                  />

                  <View style={{ flex: 1 }}>
                  <Text style={styles.name}>Aritra Chakraborty</Text>
                  <Text style={styles.subText}>Class 12th • Roll No: 24</Text>

                  <View style={styles.badge}>
                      <Text style={styles.badgeText}>ACADEMIC YEAR 2025-26</Text>
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
                          <Text style={styles.attendanceValue}>85%</Text>
                      </ImageBackground>
                  {/* Stats */}
                  <View style={styles.statsContainer}>

                  <View style={[styles.statBox, styles.present]}>
                      <Text style={styles.statLabel}>PRESENT</Text>
                      <Text style={styles.statValue}>18</Text>
                  </View>

                  <View style={[styles.statBox, styles.absent]}>
                      <Text style={styles.statLabel}>ABSENT</Text>
                      <Text style={styles.statValue}>04</Text>
                  </View>

                  <View style={[styles.statBox, styles.holiday]}>
                      <Text style={styles.statLabel}>HOLIDAY</Text>
                      <Text style={styles.statValue}>04</Text>
                  </View>
                  </View>
              </View>
              <View style={styles.calenderContainer}>
                  <Calendar attendanceData={attendanceData} />
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
    paddingBottom: 100,
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