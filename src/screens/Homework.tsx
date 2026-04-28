import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppHeader from '../component/AppHeader';
import { openParentDrawer } from '../navigation/navigationRef';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeworkComponent from '../component/HomeworkComponent';

const Homework = () => {
   const homeworkData = [
        { id: 'h1', type: 'header', title: 'Today' },

        {
          id: '1',
          type: 'item',
          title: 'Learn Chapter 5 with one Essay',
          subject: 'English',
          completed: false,
        },
        {
          id: '2',
          type: 'item',
          title: 'Exercise Trigonometry 1st topic',
          subject: 'Maths',
          completed: true,
        },
        {
          id: '3',
          type: 'item',
          title: 'Hindi writing 3 pages',
          subject: 'Hindi',
          completed: true,
        },
        {
          id: '4',
          type: 'item',
          title: 'Test for History first session',
          subject: 'Social Science',
          completed: false,
        },

         { id: 'h2', type: 'header', title: 'Yesterday' },

        {
          id: '5',
          type: 'item',
          title: 'Learn Chapter 5 with one Essay',
          subject: 'English',
          completed: false,
        },
        {
          id: '6',
          type: 'item',
          title: 'Exercise Trigonometry 1st topic',
          subject: 'Maths',
          completed: true,
        },
        {
          id: '7',
          type: 'item',
          title: 'Hindi writing 3 pages',
          subject: 'Hindi',
          completed: true,
        },
        {
          id: '8',
          type: 'item',
          title: 'Test for History first session',
          subject: 'Social Science',
          completed: false,
        },
      ];
  return (
    <SafeAreaView style={styles.container}>
      
      <AppHeader
        title="Homework"
        onMenuPress={openParentDrawer}
        onBellPress={() => console.log('Bell')}
        onProfilePress={() => console.log('Profile')}
      />

      <View style={styles.content}>
        <HomeworkComponent data={homeworkData} />
      </View>

    </SafeAreaView>
  );
};

export default Homework;

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
});