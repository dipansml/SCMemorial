import React, { useEffect, useMemo, useRef, useState } from 'react';

import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  NativeModules,
  BackHandler,
} from 'react-native';

import AppHeader from '../component/AppHeader';
import { openParentDrawer } from '../navigation/navigationRef';
import { SafeAreaView } from 'react-native-safe-area-context';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';

import {
  LiveExamData,
  ExamOption,
  StudentExamAnswer,
} from '../Model/ExamDataset/LiveExamData';

//import {demoLiveExamResponse} from '../Model/ExamDataset/DemoLiveExamData';

import Colors from '../theme/colors';

import { card, FontFamily, FontSize } from '../theme/fonts_dimen';

import ExamQuestionAnswer from '../component/ExamQuestionAnswer';
import { Api } from '../services/Api';
import StorageManager from '../services/StorageManager';
import FullScreenLoader from '../view/FullScreenLoader';

const { ExamMode } = NativeModules;

type Props = NativeStackScreenProps<RootStackParamList, 'StartExam'>;

const StartExam = ({ navigation, route }: Props) => {
  const { examDetail } = route.params;

  const [loading, setLoading] = useState(false);

  /*
   * =========================================================
   * EXAM DATA
   * =========================================================
   *
   * Currently using demo data.
   *
   * Later replace:
   *
   * setExamData(apiResponse.data);
   *
   * No other page logic needs to change.
   */
  const [examData, setExamData] = useState<LiveExamData | null>();

  // =========================
  // LOAD Question List API
  // =========================

  const loadQuestion = async () => {
    try {
      setLoading(true);

      const response = await Api.getExamQuestion({
        user_id: await StorageManager.getStudentId(),
        set_unique_id: examDetail.set_unique_id,
        set_id: examDetail.set_details.set_id,
      });

      console.log('Question List Response:', response);

      if (response && response.status === 200 && response.data) {
        setExamData(response.data);
      } else {
        Alert.alert('Error', response?.message || 'Failed to load exam list');
      }
    } catch (error: any) {
      console.log('Exam List Error:', error?.response?.data || error.message);

      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Something went wrong',
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOAD API WHEN PAGE OPENS
  // =========================

  useEffect(() => {
    loadQuestion();
  }, []);

  // =========================
  // Call exam submit  API
  // =========================

  const callSubmitExamApi = async (
    data: StudentExamAnswer,
    isAutomatic: boolean,
  ) => {
    try {
      setLoading(true);
      console.log('Student Exam Answer:', JSON.stringify(data, null, 2));

      const response = await Api.submitExam(data);

      console.log('Submit Exam Response:', response);

      if (response && response.status === 200) {
        isSubmittingRef.current = false;
        setIsSubmitting(false);

        if (isAutomatic) {
          Alert.alert(
            'Time Up',
            //'Your exam time has ended. Your exam has been submitted automatically.',
            response.message,
            [
              {
                text: 'OK',
                onPress: () => {
                  navigation.goBack();
                },
              },
            ],
            {
              cancelable: false,
            },
          );
        } else {
          Alert.alert(
            'Exam Submitted',
            //'Your exam has been submitted successfully.',
            response.message,
            [
              {
                text: 'OK',
                onPress: () => {
                  navigation.goBack();
                },
              },
            ],
            {
              cancelable: false,
            },
          );
        }
      } else {
        Alert.alert('Error', response?.message || 'Failed to load exam list');
      }
    } catch (error: any) {
      console.log('Exam List Error:', error?.response?.data || error.message);

      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Something went wrong',
      );
    } finally {
      setLoading(false);
    }
  };

  /*
   * =========================================================
   * CURRENT QUESTION
   * =========================================================
   */
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  /*
   * =========================================================
   * SELECTED ANSWERS
   * =========================================================
   *
   * Example:
   *
   * {
   *   "6": "18",
   *   "7": "22"
   * }
   *
   * question_id -> option_id
   */
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});

  /*
   * IMPORTANT:
   *
   * useRef always contains the latest selected answers.
   *
   * This fixes the auto-submit problem where the timer
   * was submitting an old/empty answer dataset.
   */
  const selectedAnswersRef = useRef<Record<string, string>>({});

  /*
   * Keep ref synchronized with state.
   */
  useEffect(() => {
    selectedAnswersRef.current = selectedAnswers;
  }, [selectedAnswers]);

  /*
   * =========================================================
   * SUBMITTING FLAG
   * =========================================================
   */
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  /*
   * Ref also prevents timer/manual submit from triggering
   * submission twice.
   */
  const isSubmittingRef = useRef<boolean>(false);

  /*
   * =========================================================
   * EXAM TIME
   * =========================================================
   *
   * exm_time is in MINUTES.
   *
   * Example:
   *
   * exm_time = "10"
   *
   * Timer = 10 * 60 = 600 seconds
   *
   * start_time and end_time are NOT used.
   */
  const examDurationSeconds = useMemo(() => {
    if (!examDetail?.set_details.exm_time) {
      return 0;
    }

    const minutes = Number(examDetail?.set_details.exm_time);

    if (Number.isNaN(minutes) || minutes <= 0) {
      return 0;
    }

    return minutes * 60;
  }, [examDetail?.set_details.exm_time]);

  /*
   * =========================================================
   * TIMER STATE
   * =========================================================
   */
  const [remainingSeconds, setRemainingSeconds] =
    useState<number>(examDurationSeconds);

  /*
   * =========================================================
   * RESET TIMER WHEN EXAM DATA CHANGES
   * =========================================================
   */
  useEffect(() => {
    if (examDurationSeconds > 0) {
      setRemainingSeconds(examDurationSeconds);
    }
  }, [examDurationSeconds]);

  /*
   * =========================================================
   * CREATE SUBMISSION DATA
   * =========================================================
   *
   * This function accepts answers directly.
   *
   * This is important because auto-submit must use the
   * latest answers from the ref.
   */
  const createSubmissionData = (
    answers: Record<string, string>,
  ): StudentExamAnswer | null => {
    if (!examData) {
      return null;
    }

    const questionids: number[] = [];
    const optionids: number[] = [];

    examData.examset.forEach(item => {
      const questionId = item.question.question_id;

      const selectedOptionId = answers[questionId];

      /*
       * Only submit answered questions.
       */
      if (selectedOptionId) {
        questionids.push(Number(questionId));

        optionids.push(Number(selectedOptionId));
      }
    });

    return {
      user_id: examData.user_id,
      set_unique_id: examData.set_unique_id,
      set_id: examData.set_id,
      result_id: examData.result_id,
      questionids,
      optionids,
    };
  };

  /*
   * =========================================================
   * FINAL SUBMIT
   * =========================================================
   */
  const submitExam = (isAutomatic: boolean = false) => {
    /*
     * Prevent double submit.
     */
    if (isSubmittingRef.current) {
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);

    /*
     * IMPORTANT:
     *
     * Read the latest answers from ref.
     */
    const latestAnswers = selectedAnswersRef.current;

    const answerData = createSubmissionData(latestAnswers);

    console.log('================================');

    console.log(isAutomatic ? 'AUTO SUBMIT' : 'MANUAL SUBMIT');

    console.log('Selected Answers:', JSON.stringify(latestAnswers, null, 2));

    console.log('Student Exam Answer:', JSON.stringify(answerData, null, 2));

    console.log('================================');

    /*
     * =====================================================
     * call submitExam API
     * =====================================================
     */

    if (answerData) {
      callSubmitExamApi(answerData, isAutomatic);
    }

    /*
     * Demo delay.
     */
    //   setTimeout(() => {
    //     isSubmittingRef.current = false;
    //     setIsSubmitting(false);

    //     if (isAutomatic) {
    //       Alert.alert(
    //         'Time Up',
    //         'Your exam time has ended. Your exam has been submitted automatically.',
    //         [
    //           {
    //             text: 'OK',
    //             onPress: () => {
    //               navigation.goBack();
    //             },
    //           },
    //         ],
    //         {
    //           cancelable: false,
    //         },
    //       );
    //     } else {
    //       Alert.alert(
    //         'Exam Submitted',
    //         'Your exam has been submitted successfully.',
    //         [
    //           {
    //             text: 'OK',
    //             onPress: () => {
    //               navigation.goBack();
    //             },
    //           },
    //         ],
    //         {
    //           cancelable: false,
    //         },
    //       );
    //     }
    //   }, 500);
  };

  /*
   * =========================================================
   * AUTO SUBMIT
   * =========================================================
   */
  const handleAutoSubmit = () => {
    if (isSubmittingRef.current) {
      return;
    }

    /*
     * Directly submit.
     *
     * No confirmation popup for auto submit.
     */
    submitExam(true);
  };

  /*
   * =========================================================
   * COUNTDOWN TIMER
   * =========================================================
   *
   * Only exm_time is used.
   *
   * start_time and end_time are completely ignored.
   */
  useEffect(() => {
    if (!examData || examDurationSeconds <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);

          /*
           * Timer finished.
           */
          handleAutoSubmit();

          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [examData, examDurationSeconds]);

  /*
   * =========================================================
   * FORMAT TIMER
   * =========================================================
   */
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);

    const secs = seconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(
      2,
      '0',
    )}`;
  };

  /*
   * =========================================================
   * CURRENT QUESTION
   * =========================================================
   */
  const currentQuestion = examData?.examset?.[currentQuestionIndex];

  /*
   * =========================================================
   * SELECT OPTION
   * =========================================================
   *
   * This is the ONLY option selection function.
   */
  const handleSelectOption = (option: ExamOption) => {
    if (!currentQuestion) {
      return;
    }

    const questionId = currentQuestion.question.question_id;

    const optionId = option.option_id;

    if (!questionId || !optionId) {
      return;
    }

    /*
     * Update state.
     */
    setSelectedAnswers(prev => {
      const updatedAnswers = {
        ...prev,
        [questionId]: optionId,
      };

      /*
       * IMPORTANT:
       * Update ref immediately as well.
       *
       * Therefore if timer finishes immediately after
       * selecting an answer, auto-submit still gets it.
       */
      selectedAnswersRef.current = updatedAnswers;

      console.log('Selected Answer:', JSON.stringify(updatedAnswers, null, 2));

      return updatedAnswers;
    });
  };

  /*
   * =========================================================
   * PREVIOUS QUESTION
   * =========================================================
   */
  const handlePrevious = () => {
    if (currentQuestionIndex > 0 && !isSubmittingRef.current) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  /*
   * =========================================================
   * SUBMIT POPUP
   * =========================================================
   */
  const showSubmitPopup = () => {
    if (isSubmittingRef.current) {
      return;
    }

    const answeredCount = Object.keys(selectedAnswersRef.current).length;

    const totalQuestions = examData?.examset?.length || 0;

    Alert.alert(
      'Submit Exam',
      `You have answered ${answeredCount} of ${totalQuestions} questions.\n\nAre you sure you want to submit the exam?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () => {
            submitExam(false);
          },
        },
      ],
    );
  };

  /*
   * =========================================================
   * NEXT QUESTION
   * =========================================================
   */
  const handleNext = () => {
    if (!examData || isSubmittingRef.current) {
      return;
    }

    if (currentQuestionIndex < examData.examset.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      /*
       * Last question.
       */
      showSubmitPopup();
    }
  };

  useEffect(() => {
    // Hide navigation when exam screen opens
    if (ExamMode && ExamMode.enableExamMode) {
      ExamMode.enableExamMode();
    }

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        // Prevent Android back button during exam
        return true;
      },
    );

    return () => {
      // Restore navigation when leaving StartExam
      if (ExamMode && ExamMode.disableExamMode) {
        ExamMode.disableExamMode();
      }

      backHandler.remove();
    };
  }, []);

  /*
   * =========================================================
   * LOADING
   * =========================================================
   */
  if (!examData || !currentQuestion) {
    return (
      <SafeAreaView style={styles.container}>
        <FullScreenLoader visible={loading} />
        <AppHeader
          title={examDetail?.set_details?.title || 'Online Exam'}
          onMenuPress={openParentDrawer}
          isMenuVisible={false}
          isNotificationVisible={false}
          onBellPress={() => {}}
          onProfilePress={() => {}}
          navigation={navigation}
        />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading exam...</Text>
        </View>
      </SafeAreaView>
    );
  }

  /*
   * =========================================================
   * CURRENT QUESTION ID
   * =========================================================
   */
  const currentQuestionId = currentQuestion.question.question_id;

  /*
   * IMPORTANT:
   *
   * Get selected option for CURRENT question.
   *
   * When Previous/Next is pressed, this automatically
   * changes to the selected answer of that question.
   */
  const selectedOptionId = selectedAnswers[currentQuestionId];

  const isLastQuestion = currentQuestionIndex === examData.examset.length - 1;

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        title={examDetail?.set_details?.title || 'Online Exam'}
        onMenuPress={openParentDrawer}
        isMenuVisible={false}
        isNotificationVisible={false}
        onBellPress={() => {}}
        onProfilePress={() => {}}
        navigation={navigation}
      />

      <View style={styles.content}>
        {/* ================================================= */}
        {/* TOP INFORMATION */}
        {/* ================================================= */}

        <View style={styles.examTopCard}>
          {/* TIMER */}

          <View style={styles.timerContainer}>
            <Text style={styles.timerLabel}>Time Left</Text>

            <Text
              style={[
                styles.timerText,
                remainingSeconds <= 60 && styles.timerDanger,
              ]}
            >
              {formatTime(remainingSeconds)}
            </Text>
          </View>

          {/* QUESTION NUMBER */}

          <View style={styles.questionCounter}>
            <Text style={styles.questionCounterText}>
              {currentQuestionIndex + 1}
            </Text>

            <Text style={styles.questionCounterTotal}>
              / {examData.examset.length}
            </Text>
          </View>

          {/* MARKS */}

          <View style={styles.marksContainer}>
            <Text style={styles.marksValue}>
              {currentQuestion.question.marks || '0'}
            </Text>

            <Text style={styles.marksLabel}>Point</Text>
          </View>
        </View>

        {/* ================================================= */}
        {/* QUESTION + ANSWER */}
        {/* ================================================= */}

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <ExamQuestionAnswer
            key={currentQuestionId}
            examItem={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            selectedOptionId={selectedOptionId}
            onSelectOption={handleSelectOption}
          />

          {/* Bottom space */}

          <View style={styles.bottomSpace} />
        </ScrollView>

        {/* ================================================= */}
        {/* PREVIOUS / NEXT */}
        {/* ================================================= */}

        <View style={styles.navigationContainer}>
          {/* PREVIOUS */}

          <TouchableOpacity
            activeOpacity={0.8}
            disabled={currentQuestionIndex === 0 || isSubmitting}
            onPress={handlePrevious}
            style={[
              styles.navigationButton,
              styles.previousButton,

              currentQuestionIndex === 0 && styles.navigationButtonDisabled,
            ]}
          >
            <Text
              style={[
                styles.navigationButtonText,

                currentQuestionIndex === 0 &&
                  styles.navigationButtonTextDisabled,
              ]}
            >
              Previous
            </Text>
          </TouchableOpacity>

          {/* NEXT / SUBMIT */}

          <TouchableOpacity
            activeOpacity={0.8}
            disabled={isSubmitting}
            onPress={handleNext}
            style={[styles.navigationButton, styles.nextButton]}
          >
            <Text style={styles.nextButtonText}>
              {isLastQuestion ? 'Submit' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default StartExam;

/* ========================================================= */
/* STYLES */
/* ========================================================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  content: {
    flex: 1,
  },

  /* ======================================================= */
  /* LOADING */
  /* ======================================================= */

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.medium,
    color: Colors.text_light,
  },

  /* ======================================================= */
  /* TOP CARD */
  /* ======================================================= */

  examTopCard: {
    marginHorizontal: card.padding,

    marginTop: card.padding_samll,

    marginBottom: card.padding_samll,

    backgroundColor: Colors.background_list_item,

    borderRadius: card.border_radius_card,

    padding: card.padding,

    flexDirection: 'row',

    alignItems: 'center',

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.08,

    shadowRadius: 4,

    elevation: 2,
  },

  /* ======================================================= */
  /* TIMER */
  /* ======================================================= */

  timerContainer: {
    flex: 1,
  },

  timerLabel: {
    fontFamily: FontFamily.regular,

    fontSize: FontSize.small,

    color: Colors.text_light,

    marginBottom: 2,
  },

  timerText: {
    fontFamily: FontFamily.bold,

    fontSize: FontSize.large,

    color: Colors.primary,
  },

  timerDanger: {
    color: Colors.red,
  },

  /* ======================================================= */
  /* QUESTION COUNTER */
  /* ======================================================= */

  questionCounter: {
    flex: 1,

    alignItems: 'center',

    justifyContent: 'center',

    flexDirection: 'row',
  },

  questionCounterText: {
    fontFamily: FontFamily.bold,

    fontSize: FontSize.xlarge,

    color: Colors.primary,
  },

  questionCounterTotal: {
    fontFamily: FontFamily.regular,

    fontSize: FontSize.medium,

    color: Colors.text_light,

    marginLeft: 2,
  },

  /* ======================================================= */
  /* MARKS */
  /* ======================================================= */

  marksContainer: {
    flex: 1,

    alignItems: 'flex-end',
  },

  marksValue: {
    fontFamily: FontFamily.bold,

    fontSize: FontSize.large,

    color: Colors.success,
  },

  marksLabel: {
    fontFamily: FontFamily.regular,

    fontSize: FontSize.small,

    color: Colors.text_light,
  },

  /* ======================================================= */
  /* SCROLL */
  /* ======================================================= */

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: card.padding,

    paddingBottom: 20,
  },

  /* ======================================================= */
  /* BOTTOM NAVIGATION */
  /* ======================================================= */

  navigationContainer: {
    flexDirection: 'row',

    paddingHorizontal: card.padding,

    paddingTop: 10,

    paddingBottom: 10,

    backgroundColor: Colors.background_list_item,

    borderTopWidth: 1,

    borderTopColor: Colors.border_color,
  },

  navigationButton: {
    flex: 1,

    height: 46,

    borderRadius: card.border_radius_card_small,

    justifyContent: 'center',

    alignItems: 'center',
  },

  previousButton: {
    backgroundColor: Colors.button_color_light,

    marginRight: 6,
  },

  nextButton: {
    backgroundColor: Colors.primary,

    marginLeft: 6,
  },

  navigationButtonDisabled: {
    backgroundColor: Colors.light_gray,
  },

  navigationButtonText: {
    fontFamily: FontFamily.semiBold,

    fontSize: FontSize.regular,

    color: Colors.text,
  },

  navigationButtonTextDisabled: {
    color: Colors.button_text_inactive,
  },

  nextButtonText: {
    fontFamily: FontFamily.semiBold,

    fontSize: FontSize.regular,

    color: Colors.white,
  },

  bottomSpace: {
    height: 20,
  },
});
