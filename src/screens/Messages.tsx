import React from 'react';
import { View, SafeAreaView, StyleSheet } from 'react-native';
import AppHeader from '../component/AppHeader';
import { openParentDrawer } from '../navigation/navigationRef';

const Messages = () => {
  return (
    <SafeAreaView style={styles.container}>
      
      <AppHeader
        title="Messages"
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

export default Messages;

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
});