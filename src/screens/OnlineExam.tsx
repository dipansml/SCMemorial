import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';

import AppHeader from '../component/AppHeader';
import {openParentDrawer} from '../navigation/navigationRef';
import {SafeAreaView} from 'react-native-safe-area-context';

import Colors from '../theme/colors';
import {
  Button,
  card,
  container,
  FontFamily,
  FontSize,
  iconBox,
} from '../theme/fonts_dimen';

import { Api } from '../services/Api';
import StorageManager from '../services/StorageManager';

import StudentAttemptExamData from '../Model/Exam/StudentAttemptExam';
import FullScreenLoader from '../view/FullScreenLoader';

const OnlineExam = ({navigation}: {navigation: any}) => {
  const [questionSetId, setQuestionSetId] = useState('');
  const [questionSetIdError, setQuestionSetIdError] = useState('');
  const [detail, setDetail] =
      useState<StudentAttemptExamData | null>(null);
  const [loading, setLoading] =
      useState(false);    

  const handleSubmit = () => {
    const value = questionSetId.trim();

    if (!value) {
      setQuestionSetIdError(
        'Please enter Question Set ID',
      );
      return;
    }

    // Clear previous error
    setQuestionSetIdError('');

    console.log('Question Set ID:', value);
    getDetail(value)
  };


  const getDetail = async (value: string) => {

    try {

      setLoading(true);

      const response =
        await Api.getStudentAttemptExam({
          user_id:await StorageManager.getStudentId(),
          set_unique_id: value,
        });

      console.log(
        'Student Attempt Exam Response:',
        response
      );

      if (
        response &&
        response.status === 200 &&
        response.data
      ) {
        setDetail(response.data);
        navigation.navigate('ExamDetail', {
            examDetail: response.data,
          });
      } else {
        Alert.alert(
          'Error',
          response?.message ||
            'Failed to load data'
        );
      }

    } catch (error: any) {

      console.log(
        'Dashboard Error:',
        error?.response?.data ||
          error.message
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

  return (
    <SafeAreaView style={styles.container}>
      <FullScreenLoader visible={loading} />
      <AppHeader
        title="Online Exam"
        onMenuPress={openParentDrawer}
        onBellPress={() => console.log('Bell')}
        onProfilePress={() => console.log('Profile')}
        navigation={navigation}
      />

      <View style={styles.content}>

        {/* =========================
            EXAM CARD
        ========================== */}
        <View style={styles.examCard}>

          {/* TITLE */}
          <Text style={styles.examTitle}>
            Exam Center
          </Text>

          {/* SUB TITLE */}
          <Text style={styles.examSubtitle}>
            Attempt Examination
          </Text>

          {/* LABEL */}
          <Text style={styles.inputLabel}>
            Enter Question Set ID
          </Text>

          {/* INPUT */}
          <TextInput
            value={questionSetId}
            onChangeText={text => {
              setQuestionSetId(text);

              if (text.trim()) {
                setQuestionSetIdError('');
              }
            }}
            placeholder="Enter Question Set ID"
            placeholderTextColor={Colors.text_hint}
            style={[
              styles.input,
              questionSetIdError && styles.inputError,
            ]}
            keyboardType="default"
            autoCapitalize="none"
          />
          {questionSetIdError ? (
            <Text style={styles.errorText}>
              {questionSetIdError}
            </Text>
          ) : null}

          {/* SUBMIT */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.submitButton}
            onPress={handleSubmit}>

            <Text style={styles.submitText}>
              Submit
            </Text>

          </TouchableOpacity>

        </View>

      </View>

    </SafeAreaView>
  );
};

export default OnlineExam;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  content: {
    flex: 1,
    paddingHorizontal: card.padding_card_medium,
    paddingTop: 10,
  },

  /* =========================
     EXAM CARD
  ========================== */

  examCard: {
    width: '100%',

    backgroundColor:
      Colors.background_list_item,

    borderWidth: 1,
    borderColor:
      Colors.border_color,

    borderRadius:
      card.border_radius_card_small,

    paddingHorizontal:
      card.padding_card_medium,

    paddingVertical: 14,

    alignItems: 'center',

    elevation: 1,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },

  /* =========================
     TITLE
  ========================== */

  examTitle: {
    fontFamily:
      FontFamily.bold,

    fontSize:
      FontSize.medium,

    color:
      Colors.text,

    textAlign: 'center',

    marginBottom: 2,
  },

  examSubtitle: {
    fontFamily:
      FontFamily.regular,

    fontSize:
      FontSize.vv_small,

    color:
      Colors.text_light,

    textAlign: 'center',

    marginBottom: 12,
  },

  /* =========================
     LABEL
  ========================== */

  inputLabel: {
    width: '100%',

    fontFamily:
      FontFamily.semiBold,

    fontSize:
      FontSize.vv_small,

    color:
      Colors.text,

    textAlign: 'center',

    marginBottom: 5,
  },

  /* =========================
     INPUT
  ========================== */

  input: {
    width: '100%',
    height: 40,

    backgroundColor:
      Colors.inputBackground,

    borderWidth: 1,
    borderColor:
      Colors.transparent,

    borderRadius:
      card.border_radius_card_small,

    paddingHorizontal: 10,

    fontFamily:
      FontFamily.regular,

    fontSize:
      FontSize.very_small,

    color:
      Colors.text,

    textAlign: 'center',

    marginBottom: 12,
  },

  /* =========================
     SUBMIT
  ========================== */

  submitButton: {
    width: '100%',
    height: 40,

    backgroundColor:
      Colors.primary,

    borderRadius:
      card.border_radius_card_medium,

    justifyContent: 'center',
    alignItems: 'center',

    elevation: 3,

    shadowColor: Colors.primary,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },

  submitText: {
    fontFamily:
      FontFamily.semiBold,

    fontSize:
      FontSize.small,

    color:
      Colors.button_text,

    textAlign: 'center',
  },
  inputError: {
    borderWidth: 1,
    borderColor: Colors.red,
  },

  errorText: {
    width: '100%',
    marginTop: -8,
    marginBottom: 8,

    fontFamily: FontFamily.regular,
    fontSize: FontSize.very_small,
    color: Colors.red,
    textAlign: 'left',
  },
});