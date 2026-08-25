import React from 'react';
import {View, StyleSheet} from 'react-native';
import AppHeader from '../component/AppHeader';
import {SafeAreaView} from 'react-native-safe-area-context';
import Colors from '../theme/colors';
import AllBookListComponent from '../component/AllBookListComponent';

const AllBook = ({navigation}: {navigation: any}) => {
  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        title="All Books"
        showBack={true}
        onMenuPress={navigation.goBack}
        onBellPress={() => console.log('Bell')}
        onProfilePress={() => console.log('Profile')}
        navigation={navigation}
      />

      <View style={styles.content}>
        <AllBookListComponent />
      </View>
    </SafeAreaView>
  );
};

export default AllBook;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  content: {
    flex: 1,
  },
});