import React, { useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  ImageBackground,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';

import AppHeader from '../component/AppHeader';
import { openParentDrawer } from '../navigation/navigationRef';
import ExamScheduleComponent from '../component/ExamScheduleComponent';
import { card, container, FontFamily, FontSize } from '../theme/fonts_dimen';
import Colors from '../theme/colors';
import { CommonStyles } from '../style/CommonStyles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Api } from '../services/Api';
import { ExamDetail } from '../Model/ExamList/ExamDetail';
import StorageManager from '../services/StorageManager';

type ExamItem = {
  id: string;
  subject_name: string;
  exam_date: string;
  exm_time: string;
};

const Academics = ({ navigation }: { navigation: any }) => {

  const [examList, setExamList] = useState<ExamItem[]>([]);
  const [loading, setLoading] = useState(false);

  // =========================
  // LOAD EXAM LIST API
  // =========================

  const loadExamList = async () => {
    try {
      setLoading(true);

      const response = await Api.getStudentExamList({ user_id: await StorageManager.getStudentId() });

      console.log('Exam List Response:', response);

      if (
        response &&
        response.status === 200 &&
        response.data?.exam_details
      ) {

        const formattedData: ExamItem[] =
          response.data.exam_details.map((item: ExamDetail) => ({
            id: item.id,
            subject_name: item.subject_name,
            exam_date: item.exam_date,
            exm_time: item.exm_time,
          }));

        setExamList(formattedData);

      } else {
        Alert.alert(
          'Error',
          response?.message || 'Failed to load exam list'
        );
      }

    } catch (error: any) {
      console.log(
        'Exam List Error:',
        error?.response?.data || error.message
      );

      Alert.alert(
        'Error',
        error?.response?.data?.message ||
          'Something went wrong'
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // USE EFFECT
  // =========================

  useEffect(() => {
    loadExamList();
  }, []);

  const FullScreenLoader = ({ visible }: { visible: boolean }) => {
    if (!visible) return null;

    return (
      <View style={CommonStyles.loaderOverlay}>
        <ActivityIndicator size="large" color={Colors.loaderColor} />
        <Text style={CommonStyles.loaderText}>Loading...</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FullScreenLoader visible={loading} />

      <AppHeader
        title="Academics"
        onMenuPress={openParentDrawer}
        onBellPress={() => console.log('Bell')}
        onProfilePress={() => console.log('Profile')}
        navigation={navigation}
      />

      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 28,
        }}
      >

        {/* 🔹 List Component */}
        <ExamScheduleComponent examList={examList} />

        {/* 🔹 Static Instructions */}
        <View style={styles.cardWrapper}>
          <ImageBackground
            source={require('../assets/images/instruction_bg.png')}
            style={styles.cardImage}
          >
            <View style={styles.cardPadding}>
              <Text style={styles.instructionsTitle}>
                Exam Instructions
              </Text>

              <View style={styles.instructions}>
                <Image
                  source={require('../assets/images/icons/instruction_yes.png')}
                  style={styles.instructionIcon}
                  resizeMode="contain"
                />
                <Text style={styles.instructionsText}>
                  Carry original Admit Cards to every examination.
                </Text>
              </View>

              <View style={styles.instructions}>
                <Image
                  source={require('../assets/images/icons/instruction_yes.png')}
                  style={styles.instructionIcon}
                  resizeMode="contain"
                />
                <Text style={styles.instructionsText}>
                  Report to the examination hall 30 minutes before the start time.
                </Text>
              </View>

              <View style={styles.instructions}>
                <Image
                  source={require('../assets/images/icons/instruction_yes.png')}
                  style={styles.instructionIcon}
                  resizeMode="contain"
                />
                <Text style={styles.instructionsText}>
                  Only transparent stationary pouches are allowed.
                </Text>
              </View>

              <View style={styles.instructions}>
                <Image
                  source={require('../assets/images/icons/instruction_no.png')}
                  style={styles.instructionIcon}
                  resizeMode="contain"
                />
                <Text style={styles.instructionsText}>
                  Mobile phones and smartwatches are strictly prohibited.
                </Text>
              </View>

            </View>
          </ImageBackground>
        </View>

        <TouchableOpacity
          style={[
            CommonStyles.button,
            { marginBottom: 10 },
          ]}
        >
          <Image
            source={require('../assets/images/icons/download.png')}
            style={CommonStyles.buttonIcon}
            resizeMode="contain"
          />

          <Text style={CommonStyles.buttonText}>
            Download PDF Schedule
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

export default Academics;

const styles = StyleSheet.create({
  container: { flex: 1, 
    backgroundColor: Colors.background,
  },

  content: {
    padding: container.container_padding,
  },

  instructionsBox: {
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
    overflow: 'hidden',
  },

  cardWrapper: {
    borderRadius: card.border_radius_card,
    overflow: 'hidden',
    backgroundColor: Colors.instruction_box,
    elevation: 3,
    marginTop: 10,
    marginBottom: 10,
  },

  cardImage: {
    justifyContent: 'center',
  },

  cardPadding: {
    padding: card.padding,
  },

  instructionsTitle: {
    marginBottom: 10,
    color: Colors.textColorInpuHeader,
    fontSize: FontSize.medium,
    fontFamily: FontFamily.medium,
  },

  instructionsText: {
    color: Colors.instruction_text,
    fontSize: FontSize.very_small,
    fontFamily: FontFamily.regular,
    flex: 1,
  },

  instructions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },

  instructionIcon: {
    width: 10,
    height: 10,
    marginRight: 6,
    tintColor: Colors.instruction_text,
  },
});