import React from 'react';
import { View, SafeAreaView, StyleSheet } from 'react-native';
import AppHeader from '../component/AppHeader';
import { openParentDrawer } from '../navigation/navigationRef';

const Notice = () => {
  return (
    <SafeAreaView style={styles.container}>
      
      <AppHeader
        title="Notices & Announcements"
        onMenuPress={openParentDrawer}
        onBellPress={() => console.log('Bell')}
        onProfilePress={() => console.log('Profile')}
      />

      <View style={styles.content}>
        {/* Your screen content */}
      </View>

    </SafeAreaView>
  );
};

export default Notice;

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
});