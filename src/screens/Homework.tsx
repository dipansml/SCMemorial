import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Alert,
} from 'react-native';

import AppHeader from '../component/AppHeader';
import { openParentDrawer } from '../navigation/navigationRef';
import { SafeAreaView } from 'react-native-safe-area-context';
import HomeworkComponent from '../component/HomeworkComponent';
import StorageManager from '../services/StorageManager';
import { Api } from '../services/Api';
import { formatHeaderTitle } from '../utils/helper';
import FullScreenLoader from '../view/FullScreenLoader';

const Homework = ({
  navigation,
}: {
  navigation: any;
}) => {

  const [homeworkData, setHomeworkData] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {
    loadHomeworkList();
  }, []);

  const loadHomeworkList = async () => {

    try {

      setLoading(true);

      const response =
        await Api.getStudentHomework({
          user_id:
            await StorageManager.getStudentId(),
        });

      console.log(
        'Homework Response:',
        response
      );

      if (
        response &&
        response.status === 200 &&
        response.data?.homework
      ) {

        const groupedData: any[] = [];

        let lastHeader = '';

        response.data.homework.forEach(
          (item: any, index: number) => {

            console.log(
              'Date:',
              item.assignment_date
            );

            const headerTitle =
              formatHeaderTitle(
                formatHeaderTitle(item.assignment_date)
              );

            // ✅ Add header only once
            if (
              headerTitle !== lastHeader
            ) {

              groupedData.push({
                id: `header-${index}`,
                type: 'header',
                title: headerTitle,
              });

              lastHeader = headerTitle;
            }

            // ✅ Add item
            groupedData.push({
              id: item.id,
              type: 'item',
              title: item.title,
              subject:
                item.subject || 'Homework',
              completed:
                item.completed,
            });
          }
        );

        setHomeworkData(groupedData);

      } else {

        Alert.alert(
          'Error',
          response?.message ||
            'Failed to load homework'
        );
      }

    } catch (error: any) {

      console.log(
        'Homework Error:',
        error?.response?.data ||
          error.message
      );

      Alert.alert(
        'Error',
        error?.response?.data
          ?.message ||
          'Something went wrong'
      );

    } finally {

      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <FullScreenLoader visible={loading} />
      <AppHeader
        title="Homework"
        onMenuPress={openParentDrawer}
        onBellPress={() =>
          console.log('Bell')
        }
        onProfilePress={() =>
          console.log('Profile')
        }
        navigation={navigation}
      />

      <View style={styles.content}>
        <HomeworkComponent
          data={homeworkData}
        />
      </View>

    </SafeAreaView>
  );
};

export default Homework;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    flex: 1,
  },
});