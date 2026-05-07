import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ActivityIndicator,
  Alert,
} from 'react-native';

import Colors from '../theme/colors';
import {
  FontSize,
  FontFamily,
  Header,
  container,
} from '../theme/fonts_dimen';

import StudentListItem from '../component/StudentListItem';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import type { RootStackParamList } from '../../App';

import { SafeAreaView } from 'react-native-safe-area-context';

import { Api } from '../services/Api';
import { StudentListResponse } from '../Model/StudentList/StudentListResponse';
import { Student } from '../Model/StudentList/Student';
import StorageManager from '../services/StorageManager'; 

type StudentSelectionProps = {
  navigation: NativeStackNavigationProp<RootStackParamList>;
};

const StudentSelection = ({
  navigation,
}: StudentSelectionProps) => {

  const [loading, setLoading] = useState(false);

  const [studentList, setStudentList] =
    useState<Student[]>([]);

  useEffect(() => {
    loadStudentList();
  }, []);

  const loadStudentList = async () => {

    try {

      setLoading(true);

      const response: StudentListResponse =
        await Api.getStudentList();

      console.log(
        'Student List Response:',
        response
      );

      if (
        response &&
        response.status === 200
      ) {

        setStudentList(
          response.data.student_list || []
        );

      } else {

        Alert.alert(
          'Error',
          response.message ||
            'Failed to load students'
        );
      }

    } catch (error: any) {

      console.log(
        'Student List Error:',
        error
      );

      Alert.alert(
        'Error',
        'Something went wrong'
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Select Student
        </Text>
      </View>

      <View style={styles.content}>

        {loading ? (

          <ActivityIndicator
            size="large"
            color={Colors.button_color}
          />

        ) : (

          <View style={styles.list}>

            <StudentListItem
              data={studentList}
              onItemPress={async (
                item: Student,
                index: number
              ) => {

                console.log(
                  'Clicked index:',
                  index
                );

                console.log(
                  'Item:',
                  item
                );
                await StorageManager.setStudentId(item.user_id);
                navigation.replace(
                  'LandingParents'
                );
              }}
            />

          </View>

        )}

      </View>

    </SafeAreaView>
  );
};

export default StudentSelection;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: container.container_padding,
  },

  header: {
    height: Header.height,
    backgroundColor:
      Colors.NavBarHeader_color,
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
    flex: 1,
  },
});