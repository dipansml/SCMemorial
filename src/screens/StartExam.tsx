import React, {useEffect, useMemo, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from 'react-native';

import AppHeader from '../component/AppHeader';
import {openParentDrawer} from '../navigation/navigationRef';
import {SafeAreaView} from 'react-native-safe-area-context';

import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../App';

import {
  LiveExamData,
  ExamOption,
  StudentExamAnswer,
} from '../Model/ExamDataset/LiveExamData';

import {demoLiveExamResponse} from '../Model/ExamDataset/DemoLiveExamData';

import Colors from '../theme/colors';

import {
  Button,
  card,
  container,
  FontFamily,
  FontSize,
  iconBox,
} from '../theme/fonts_dimen';

type Props = NativeStackScreenProps<RootStackParamList, 'StartExam'>;

const StartExam = ({navigation, route}: Props) => {
  const {examDetail} = route.params;

  /*
   * ---------------------------------------------------------
   * DEMO DATA
   * ---------------------------------------------------------
   *
   * For now we use demoLiveExamResponse.
   *
   * Later replace this with API response:
   *
   * const examData = apiResponse.data;
   *
   */
  const [examData, setExamData] = useState<LiveExamData | null>(
    demoLiveExamResponse.data,
  );

  const [currentQuestionIndex, setCurrentQuestionIndex] =
    useState<number>(0);

  /*
   * Selected answer dataset.
   *
   * Example:
   * {
   *   "6": "18",
   *   "7": "22"
   * }
   *
   * key   = question_id
   * value = option_id
   */
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  /*
   * ---------------------------------------------------------
   * TIMER
   * ---------------------------------------------------------
   *
   * exm_time is in MINUTES.
   *
   * Example:
   * exm_time = "10"
   *
   * Timer = 10 * 60 = 600 seconds
   *
   * start_time and end_time are NOT used.
   */
  const examDurationSeconds = useMemo(() => {
    if (!examData?.exm_time) {
      return 0;
    }

    const minutes = Number(examData.exm_time);

    if (isNaN(minutes) || minutes <= 0) {
      return 0;
    }

    return minutes * 60;
  }, [examData?.exm_time]);

  const [remainingSeconds, setRemainingSeconds] = useState<number>(
    examDurationSeconds,
  );

  /*
   * Start / reset timer when exam data changes.
   */
  useEffect(() => {
    if (examDurationSeconds > 0) {
      setRemainingSeconds(examDurationSeconds);
    }
  }, [examDurationSeconds]);

  /*
   * Countdown timer
   */
  useEffect(() => {
    if (!examData || examDurationSeconds <= 0) {
      return;
    }

    if (remainingSeconds <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setRemainingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(timer);

          /*
           * Timer finished.
           * Automatically submit the exam.
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
   * ---------------------------------------------------------
   * FORMAT TIMER
   * ---------------------------------------------------------
   *
   * 600 => 10:00
   * 65  => 01:05
   */
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;

    return `${String(minutes).padStart(2, '0')}:${String(
      secs,
    ).padStart(2, '0')}`;
  };

  /*
   * Current question
   */
  const currentQuestion =
    examData?.examset?.[currentQuestionIndex];

  /*
   * ---------------------------------------------------------
   * SELECT ANSWER
   * ---------------------------------------------------------
   */
  const handleAnswerSelect = (option: ExamOption) => {
    if (!currentQuestion) {
      return;
    }

    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion.question.question_id]: option.option_id,
    }));
  };

  /*
   * ---------------------------------------------------------
   * PREVIOUS
   * ---------------------------------------------------------
   */
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  /*
   * ---------------------------------------------------------
   * NEXT
   * ---------------------------------------------------------
   */
  const handleNext = () => {
    if (!examData) {
      return;
    }

    if (currentQuestionIndex < examData.examset.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      /*
       * Last question.
       * Show submit confirmation.
       */
      showSubmitPopup();
    }
  };

  /*
   * ---------------------------------------------------------
   * CREATE SUBMISSION DATA
   * ---------------------------------------------------------
   *
   * API format:
   *
   * {
   *   user_id: "10212",
   *   set_unique_id: "5E3464B4B893A",
   *   set_id: "4",
   *   result_id: "41",
   *   questionids: [6, 7],
   *   optionids: [18, 22]
   * }
   */
  const createSubmissionData = (): StudentExamAnswer | null => {
    if (!examData) {
      return null;
    }

    const questionids: number[] = [];
    const optionids: number[] = [];

    examData.examset.forEach(item => {
      const questionId = item.question.question_id;

      const selectedOptionId =
        selectedAnswers[questionId];

      /*
       * Only add questions that have an answer.
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
   * ---------------------------------------------------------
   * ACTUAL SUBMIT
   * ---------------------------------------------------------
   */
  const submitExam = () => {
    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    const answerData = createSubmissionData();

    console.log(
      '========== EXAM SUBMISSION ==========',
    );

    console.log(
      'Student Exam Answer:',
      JSON.stringify(answerData, null, 2),
    );

    /*
     * Later API call goes here:
     *
     * await Api.submitExam(answerData);
     */

    setTimeout(() => {
      setIsSubmitting(false);

      Alert.alert(
        'Exam Submitted',
        'Your exam has been submitted successfully.',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.goBack();
            },
          },
        ],
      );
    }, 500);
  };

  /*
   * ---------------------------------------------------------
   * SUBMIT POPUP
   * ---------------------------------------------------------
   */
  const showSubmitPopup = () => {
    const answeredCount =
      Object.keys(selectedAnswers).length;

    const totalQuestions =
      examData?.examset?.length || 0;

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
          onPress: submitExam,
        },
      ],
    );
  };

  /*
   * ---------------------------------------------------------
   * AUTOMATIC SUBMIT
   * ---------------------------------------------------------
   */
  const handleAutoSubmit = () => {
    if (isSubmitting) {
      return;
    }

    const answerData = createSubmissionData();

    console.log(
      '========== AUTO SUBMIT ==========',
    );

    console.log(
      'Student Exam Answer:',
      JSON.stringify(answerData, null, 2),
    );

    /*
     * Later:
     *
     * await Api.submitExam(answerData);
     */

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      Alert.alert(
        'Time Up',
        'Your exam time has ended. Your exam has been submitted automatically.',
        [
          {
            text: 'OK',
            onPress: () => {
              navigation.goBack();
            },
          },
        ],
      );
    }, 300);
  };

  /*
   * ---------------------------------------------------------
   * CHECK SELECTED OPTION
   * ---------------------------------------------------------
   */
  const selectedOptionId =
    currentQuestion
      ? selectedAnswers[
          currentQuestion.question.question_id
        ]
      : undefined;

  /*
   * ---------------------------------------------------------
   * LOADING
   * ---------------------------------------------------------
   */
  if (!examData || !currentQuestion) {
    return (
      <SafeAreaView style={styles.container}>
        <AppHeader
          title={
            examDetail?.set_details?.title ||
            'Online Exam'
          }
          onMenuPress={openParentDrawer}
          isMenuVisible={false}
          isNotificationVisible={false}
          onBellPress={() => {}}
          onProfilePress={() => {}}
          navigation={navigation}
        />

        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>
            Loading exam...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const question = currentQuestion.question;
  const options = currentQuestion.option || [];

  /*
   * ---------------------------------------------------------
   * IMAGE SOURCE
   * ---------------------------------------------------------
   *
   * If question_file / option_file contains a URL,
   * Image can directly use {uri: file}.
   *
   * If your API returns only a file name, prepend
   * your image base URL here.
   */
  const getImageSource = (file: string) => {
    if (!file) {
      return null;
    }

    if (
      file.startsWith('http://') ||
      file.startsWith('https://')
    ) {
      return {uri: file};
    }

    /*
     * Change this according to your server.
     *
     * Example:
     * return {
     *   uri: `http://182.73.216.93/scms.beas.in/uploads/${file}`,
     * };
     */

    return {uri: file};
  };

  const questionImageSource =
    getImageSource(question.question_file);

  const isLastQuestion =
    currentQuestionIndex ===
    examData.examset.length - 1;

  return (
    <SafeAreaView style={styles.container}>
      <AppHeader
        title={
          examDetail?.set_details?.title ||
          'Online Exam'
        }
        onMenuPress={openParentDrawer}
        isMenuVisible={false}
        isNotificationVisible={false}
        onBellPress={() => {}}
        onProfilePress={() => {}}
        navigation={navigation}
      />

      <View style={styles.content}>
        {/* ================================================= */}
        {/* TIMER + QUESTION NUMBER + MARKS */}
        {/* ================================================= */}

        <View style={styles.examTopCard}>
          <View style={styles.timerContainer}>
            <Text style={styles.timerLabel}>
              Time Left
            </Text>

            <Text
              style={[
                styles.timerText,
                remainingSeconds <= 60 &&
                  styles.timerDanger,
              ]}>
              {formatTime(remainingSeconds)}
            </Text>
          </View>

          <View style={styles.questionCounter}>
            <Text style={styles.questionCounterText}>
              {currentQuestionIndex + 1}
            </Text>

            <Text style={styles.questionCounterTotal}>
              / {examData.examset.length}
            </Text>
          </View>

          <View style={styles.marksContainer}>
            <Text style={styles.marksValue}>
              {question.marks || '0'}
            </Text>

            <Text style={styles.marksLabel}>
              Point
            </Text>
          </View>
        </View>

        {/* ================================================= */}
        {/* QUESTION */}
        {/* ================================================= */}

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={
            styles.scrollContent
          }
          showsVerticalScrollIndicator={false}>
          <View style={styles.questionCard}>
            <Text style={styles.questionLabel}>
              Question {currentQuestionIndex + 1}
            </Text>

            {/* QUESTION TEXT */}

            {!!question.question?.trim() && (
              <Text style={styles.questionText}>
                {question.question}
              </Text>
            )}

            {/* QUESTION IMAGE */}

            {questionImageSource && (
              <Image
                source={questionImageSource}
                style={styles.questionImage}
                resizeMode="contain"
              />
            )}
          </View>

          {/* ================================================= */}
          {/* OPTIONS */}
          {/* ================================================= */}

          <View style={styles.optionsCard}>
            <Text style={styles.answerLabel}>
              Choose your answer
            </Text>

            {options.map((option, index) => {
              const isSelected =
                selectedOptionId ===
                option.option_id;

              const optionImageSource =
                getImageSource(
                  option.option_file,
                );

              return (
                <TouchableOpacity
                  key={option.option_id}
                  activeOpacity={0.8}
                  onPress={() =>
                    handleAnswerSelect(option)
                  }
                  style={[
                    styles.optionCard,
                    isSelected &&
                      styles.optionCardSelected,
                  ]}>
                  {/* RADIO BUTTON */}

                  <View
                    style={[
                      styles.radioOuter,
                      isSelected &&
                        styles.radioOuterSelected,
                    ]}>
                    {isSelected && (
                      <View
                        style={
                          styles.radioInner
                        }
                      />
                    )}
                  </View>

                  {/* OPTION CONTENT */}

                  <View
                    style={
                      styles.optionContent
                    }>
                    {/* OPTION TEXT */}

                    {!!option.option?.trim() && (
                      <Text
                        style={
                          styles.optionText
                        }>
                        {option.option}
                      </Text>
                    )}

                    {/* OPTION IMAGE */}

                    {optionImageSource && (
                      <Image
                        source={
                          optionImageSource
                        }
                        style={
                          styles.optionImage
                        }
                        resizeMode="contain"
                      />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Extra space for bottom buttons */}
          <View style={styles.bottomSpace} />
        </ScrollView>

        {/* ================================================= */}
        {/* PREVIOUS / NEXT */}
        {/* ================================================= */}

        <View style={styles.navigationContainer}>
          <TouchableOpacity
            activeOpacity={0.8}
            disabled={currentQuestionIndex === 0}
            onPress={handlePrevious}
            style={[
              styles.navigationButton,
              styles.previousButton,
              currentQuestionIndex === 0 &&
                styles.navigationButtonDisabled,
            ]}>
            <Text
              style={[
                styles.navigationButtonText,
                currentQuestionIndex === 0 &&
                  styles.navigationButtonTextDisabled,
              ]}>
              Previous
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            disabled={isSubmitting}
            onPress={handleNext}
            style={[
              styles.navigationButton,
              styles.nextButton,
            ]}>
            <Text
              style={styles.nextButtonText}>
              {isLastQuestion
                ? 'Submit'
                : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default StartExam;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  content: {
    flex: 1,
  },

  /* ============================================== */
  /* LOADING */
  /* ============================================== */

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

  /* ============================================== */
  /* TOP CARD */
  /* ============================================== */

  examTopCard: {
    marginHorizontal: card.padding,
    marginTop: card.padding_samll,
    marginBottom: card.padding_samll,

    backgroundColor:
      Colors.background_list_item,

    borderRadius:
      card.border_radius_card,

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

  /* ============================================== */
  /* TIMER */
  /* ============================================== */

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

  /* ============================================== */
  /* QUESTION COUNTER */
  /* ============================================== */

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

  /* ============================================== */
  /* MARKS */
  /* ============================================== */

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

  /* ============================================== */
  /* SCROLL */
  /* ============================================== */

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    paddingHorizontal: card.padding,
    paddingBottom: 20,
  },

  /* ============================================== */
  /* QUESTION CARD */
  /* ============================================== */

  questionCard: {
    backgroundColor:
      Colors.background_list_item,

    borderRadius:
      card.border_radius_card,

    padding: card.padding,

    marginBottom: card.margin_bottom,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 4,

    elevation: 2,
  },

  questionLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.regular,
    color: Colors.primary,
    marginBottom: 10,
  },

  questionText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.medium,
    lineHeight: 24,
    color: Colors.text,
  },

  questionImage: {
    width: '100%',
    height: 180,
    marginTop: 14,
    borderRadius:
      card.border_radius_card_small,
  },

  /* ============================================== */
  /* ANSWERS */
  /* ============================================== */

  optionsCard: {
    backgroundColor:
      Colors.background_list_item,

    borderRadius:
      card.border_radius_card,

    padding: card.padding,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 4,

    elevation: 2,
  },

  answerLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.medium,
    color: Colors.text,
    marginBottom: 12,
  },

  optionCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',

    minHeight: 52,

    borderWidth: 1,
    borderColor: Colors.border_color,

    borderRadius:
      card.border_radius_card_small,

    padding: 12,

    marginBottom: 10,

    backgroundColor:
      Colors.background_list_item,
  },

  optionCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.drawerItemActive,
  },

  /* ============================================== */
  /* RADIO */
  /* ============================================== */

  radioOuter: {
    width: 22,
    height: 22,

    borderRadius: 11,

    borderWidth: 2,
    borderColor: Colors.iconBackGrey,

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 12,
    marginTop: 2,
  },

  radioOuterSelected: {
    borderColor: Colors.primary,
  },

  radioInner: {
    width: 11,
    height: 11,

    borderRadius: 6,

    backgroundColor: Colors.primary,
  },

  /* ============================================== */
  /* OPTION CONTENT */
  /* ============================================== */

  optionContent: {
    flex: 1,
  },

  optionText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.regular,
    lineHeight: 21,
    color: Colors.text,
  },

  optionImage: {
    width: '100%',
    height: 120,
    marginTop: 8,
    borderRadius:
      card.border_radius_card_small,
  },

  /* ============================================== */
  /* BOTTOM NAVIGATION */
  /* ============================================== */

  navigationContainer: {
    flexDirection: 'row',

    paddingHorizontal: card.padding,
    paddingTop: 10,
    paddingBottom: 10,

    backgroundColor:
      Colors.background_list_item,

    borderTopWidth: 1,
    borderTopColor: Colors.border_color,
  },

  navigationButton: {
    flex: 1,

    height: 46,

    borderRadius:
      card.border_radius_card_small,

    justifyContent: 'center',
    alignItems: 'center',
  },

  previousButton: {
    backgroundColor:
      Colors.button_color_light,

    marginRight: 6,
  },

  nextButton: {
    backgroundColor:
      Colors.primary,

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
    height: 10,
  },
});