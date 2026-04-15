import React from 'react';
import { View, SafeAreaView, StyleSheet } from 'react-native';
import AppHeader from '../component/AppHeader';

const DashboardParents = () => {
  return (
    <SafeAreaView style={styles.container}>
      
      <AppHeader
        title="Dashboard"
        onMenuPress={() => console.log('Menu')}
        onBellPress={() => console.log('Bell')}
        onProfilePress={() => console.log('Profile')}
      />

      <View style={styles.content}>
        {/* Your screen content */}
      </View>

    </SafeAreaView>
  );
};

export default DashboardParents;

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
});