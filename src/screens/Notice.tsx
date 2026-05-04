import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppHeader from '../component/AppHeader';
import { openParentDrawer } from '../navigation/navigationRef';
import { SafeAreaView } from 'react-native-safe-area-context';
import NoticeList from '../component/NoticeComponent';
import { NoticeItem } from '../component/NoticeCard';

interface State {
  notices: NoticeItem[];
}


const Notice = () => {
  const [state] = React.useState<State>({
    notices: [
      {
        id: '1',
        important: true,
        title: 'Emergency Campus Maintenance',
        description:
          'The East Wing of the campus will be closed for emergency maintenance from Friday evening Sunday.',
        date: 'Oct 24, 2023',
      },
      {
        id: '2',
        important: true,
        title: 'Final Semester Lab Schedule',
        description:
          'The final semester laboratory examinations for Computer Science and Engineering students have...',
        date: 'Oct 22, 2023',
      },
      {
        id: '3',
        important: false,
        title: 'Winter Break Announcement',
        description:
          'Official dates for the upcoming winter vacation.',
        date: 'Oct 24, 2023',
      },
    ],
  });
  return (
    <SafeAreaView style={styles.container}>
      
      <AppHeader
        title="Notices & Announcements"
        onMenuPress={openParentDrawer}
        onBellPress={() => console.log('Bell')}
        onProfilePress={() => console.log('Profile')}
      />

      <View style={styles.content}>
        <NoticeList data={state.notices} />
      </View>

    </SafeAreaView>
  );
};

export default Notice;

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
});