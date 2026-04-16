import React from 'react';
import { View, SafeAreaView, StyleSheet, Text, Platform, StatusBar } from 'react-native';
import AppHeader from '../component/AppHeader';
import Colors from '../theme/colors';
import { FontSize, FontFamily, Header } from '../theme/fonts_dimen';
import StudentListItem from '../component/StudentListItem';
import { StudentItemType } from '../component/StudentListItem';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  DashboardParents : undefined;
};
 
  type StudentSelectionProps = {
    navigation: NativeStackNavigationProp<
      RootStackParamList,
      'DashboardParents'
    >;
  };

const StudentSelection = ({ navigation }: StudentSelectionProps) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Select Student</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.list}>
           <StudentListItem 
              onItemPress={(item: StudentItemType, index: number) => {
                console.log('Clicked index:', index);
                console.log('Item:', item);
                navigation.replace('DashboardParents');
              }}
            />
        </View>
      </View>

    </SafeAreaView>
  );
};

export default StudentSelection;

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1 },
  header: {
    height: Header.height,
    paddingTop: Header.paddingTop,
    backgroundColor: Colors.NavBarHeader_color,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
  },
  headerTitle: {
    fontSize: FontSize.xlarge,
    color: Colors.white,
    marginLeft: 10,
    fontFamily: FontFamily.bold,
    textAlign: 'center',
  },
  list: {
    padding: 20,
    marginTop: 5,
  },
});