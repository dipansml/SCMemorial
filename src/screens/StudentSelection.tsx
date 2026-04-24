import React from 'react';
import { View, SafeAreaView, StyleSheet, Text,} from 'react-native';
import Colors from '../theme/colors';
import { FontSize, FontFamily, Header, container } from '../theme/fonts_dimen';
import StudentListItem from '../component/StudentListItem';
import { StudentItemType } from '../component/StudentListItem';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
 
  type StudentSelectionProps = {
    navigation: NativeStackNavigationProp<
      RootStackParamList
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
                navigation.replace('LandingParents');
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
  content: { 
    flex: 1,
    backgroundColor: Colors.background,
    padding: container.container_padding,
   },
  header: {
    height: Header.height,
    paddingTop: Header.paddingTop,
    backgroundColor: Colors.NavBarHeader_color,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: FontSize.xlarge,
    color: Colors.white,
    marginLeft: 10,
    fontFamily: FontFamily.bold,
    textAlign: 'center',
  },
  list: {
    padding: 0,
  },
});