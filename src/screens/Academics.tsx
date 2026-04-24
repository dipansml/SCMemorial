import React, { useEffect, useState } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Text,
  ScrollView,
} from 'react-native';
import AppHeader from '../component/AppHeader';
import { openParentDrawer } from '../navigation/navigationRef';
import ExamScheduleComponent from '../component/ExamScheduleComponent';

const Academics = () => {

  const [examList, setExamList] = useState([]);

  useEffect(() => {
    // simulate API
    const data = [
      { id: '1', subject: 'Mathematics', date: '25 Apr 2026', time: '10:00 AM - 1:00 PM', status: 'Today' },
      { id: '2', subject: 'Science', date: '25 Apr 2026', time: '10:00 AM - 1:00 PM', status: 'Today' },
      { id: '3', subject: 'English', date: '25 Apr 2026', time: '10:00 AM - 1:00 PM', status: 'Upcoming' },
      { id: '4', subject: 'Geography', date: '25 Apr 2026', time: '10:00 AM - 1:00 PM', status: 'Upcoming' },
      { id: '5', subject: 'Mathematics', date: '25 Apr 2026', time: '10:00 AM - 1:00 PM', status: 'Completed' },
    ];

    setExamList(data);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      
      <AppHeader
        title="Academics"
        onMenuPress={openParentDrawer}
        onBellPress={() => console.log('Bell')}
        onProfilePress={() => console.log('Profile')}
      />

      <ScrollView style={styles.content}>

        {/* 🔹 List Component */}
        <ExamScheduleComponent examList={examList} />

        {/* 🔹 Static Instructions */}
        <View style={styles.instructionsBox}>
          <Text style={styles.instructionsTitle}>Exam Instructions</Text>
          <Text style={styles.instructionsText}>• Carry original Admit Cards.</Text>
          <Text style={styles.instructionsText}>• Reach 30 minutes early.</Text>
          <Text style={styles.instructionsText}>• No mobile phones allowed.</Text>
        </View>

      </ScrollView>

    </SafeAreaView>
  );
};

export default Academics;

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, padding: 16 },

  instructionsBox: {
    backgroundColor: '#F5E6C8',
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
  },
  instructionsTitle: {
    fontWeight: '700',
    marginBottom: 6,
  },
  instructionsText: {
    fontSize: 12,
    marginBottom: 4,
    color: '#444',
  },
});