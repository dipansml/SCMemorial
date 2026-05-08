import React from 'react';
import { View, StyleSheet } from 'react-native';
import AppHeader from '../component/AppHeader';
import { openParentDrawer } from '../navigation/navigationRef';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type AllBookProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
}; 

const AllBooksScreen = ({ navigation }: AllBookProps) => {
  return (
    <SafeAreaView style={styles.container}>
      
      <AppHeader
        title="All Books"
        onBellPress={() => console.log('Bell')}
        onProfilePress={() => console.log('Profile')}
        navigation={navigation}
      />

      <View style={styles.content}>
        {/* Your screen content */}
      </View>

    </SafeAreaView>
  );
};

export default AllBooksScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
});