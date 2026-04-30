import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppHeader from '../component/AppHeader';
import { openParentDrawer } from '../navigation/navigationRef';
import { SafeAreaView } from 'react-native-safe-area-context';

const ReturnBookScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      
      <AppHeader
        title="Return Book"
        onBellPress={() => console.log('Bell')}
        onProfilePress={() => console.log('Profile')}
      />

      <View style={styles.content}>
        {/* Your screen content */}
      </View>

    </SafeAreaView>
  );
};

export default ReturnBookScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
});