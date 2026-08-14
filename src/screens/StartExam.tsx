import React, {useEffect, useState} from 'react';

import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
} from 'react-native';

import AppHeader from '../component/AppHeader';
import {openParentDrawer} from '../navigation/navigationRef';

import type {NativeStackScreenProps} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../../App';

import {SafeAreaView} from 'react-native-safe-area-context';
import { card, container, FontFamily, FontSize } from '../theme/fonts_dimen';
import Colors from '../theme/colors';

import {
  demoExamQuestions,
  ExamQuestion,
} from '../Model/ExamDataset/DemoExamData';

type Props = NativeStackScreenProps<
  RootStackParamList,
  'StartExam'
>;

interface AnswerState {
  questionId: string;
  selectedAnswerId: string | null;
}

const StartExam = ({navigation, route}: Props) => {
  const {examDetail} = route.params;

  /*
   * --------------------------------------------------
   * EXAM DATA
   * --------------------------------------------------
   *
   * Currently using demo data.
   *
   * Later replace this with API response.
   */
  const questions: ExamQuestion[] =
    demoExamQuestions;

  /*
   * --------------------------------------------------
   * TIMER
   * --------------------------------------------------
   *
   * Demo: 20 minutes 35 seconds
   *
   * In future:
   * examDetail.set_details.exm_time
   * can be converted into seconds.
   */
  const [timeLeft, setTimeLeft] =
    useState(20 * 60 + 35);

  const [currentQuestionIndex, setCurrentQuestionIndex] =
    useState(0);

  const [showSubmitModal, setShowSubmitModal] =
    useState(false);

  const [isAutoSubmit, setIsAutoSubmit] =
    useState(false);

  /*
   * --------------------------------------------------
   * ANSWER DATASET
   * --------------------------------------------------
   *
   * Stores selected answer for every question.
   */
  const [examAnswers, setExamAnswers] =
    useState<AnswerState[]>(
      questions.map(question => ({
        questionId: question.id,
        selectedAnswerId: null,
      })),
    );

  const currentQuestion =
    questions[currentQuestionIndex];

  const selectedAnswer =
    examAnswers.find(
      item =>
        item.questionId ===
        currentQuestion.id,
    )?.selectedAnswerId;

  /*
   * --------------------------------------------------
   * FORMAT TIMER
   * --------------------------------------------------
   */
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(
      seconds / 60,
    );

    const remainingSeconds =
      seconds % 60;

    return `${String(minutes).padStart(
      2,
      '0',
    )}:${String(remainingSeconds).padStart(
      2,
      '0',
    )}`;
  };

  /*
   * --------------------------------------------------
   * COUNTDOWN
   * --------------------------------------------------
   */
  useEffect(() => {
    if (timeLeft <= 0) {
      handleAutoSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  /*
   * --------------------------------------------------
   * SELECT ANSWER
   * --------------------------------------------------
   */
  const selectAnswer = (
    answerId: string,
  ) => {
    setExamAnswers(prev =>
      prev.map(item =>
        item.questionId ===
        currentQuestion.id
          ? {
              ...item,
              selectedAnswerId:
                answerId,
            }
          : item,
      ),
    );
  };

  /*
   * --------------------------------------------------
   * PREVIOUS QUESTION
   * --------------------------------------------------
   */
  const handlePrevious = () => {
    if (currentQuestionIndex === 0) {
      return;
    }

    setCurrentQuestionIndex(
      prev => prev - 1,
    );
  };

  /*
   * --------------------------------------------------
   * NEXT QUESTION
   * --------------------------------------------------
   */
  const handleNext = () => {
    if (
      currentQuestionIndex <
      questions.length - 1
    ) {
      setCurrentQuestionIndex(
        prev => prev + 1,
      );
    } else {
      /*
       * Last question
       * Show submit popup
       */
      setIsAutoSubmit(false);
      setShowSubmitModal(true);
    }
  };

  /*
   * --------------------------------------------------
   * SUBMIT BUTTON
   * --------------------------------------------------
   */
  const handleSubmitClick = () => {
    setIsAutoSubmit(false);
    setShowSubmitModal(true);
  };

  /*
   * --------------------------------------------------
   * TIMER AUTO SUBMIT
   * --------------------------------------------------
   */
  const handleAutoSubmit = () => {
    console.log(
      'Time finished - Auto Submit',
    );

    console.log(
      'Final Answers:',
      JSON.stringify(
        examAnswers,
        null,
        2,
      ),
    );

    /*
     * API call will be added here.
     */
    navigation.goBack();
  };

  /*
   * --------------------------------------------------
   * FINAL SUBMIT
   * --------------------------------------------------
   */
  const handleFinalSubmit = () => {
    setShowSubmitModal(false);

    console.log(
      'Exam Submitted',
    );

    console.log(
      'Exam ID:',
      examDetail?.set_unique_id,
    );

    console.log(
      'Answers:',
      JSON.stringify(
        examAnswers,
        null,
        2,
      ),
    );

    /*
     * Future API:
     *
     * await Api.submitExam({
     *   set_unique_id:
     *     examDetail.set_unique_id,
     *   answers: examAnswers,
     * });
     */

    navigation.goBack();
  };

  /*
   * --------------------------------------------------
   * QUESTION RENDER
   * --------------------------------------------------
   */
  const renderQuestion = () => {
    return (
      <>
        {/* QUESTION */}
        <Text style={styles.questionLabel}>
          Question :
        </Text>

        <Text style={styles.questionText}>
          {currentQuestion.questionText}
        </Text>

        {/* QUESTION IMAGE */}
        {currentQuestion.questionImage && (
          <Image
            source={
              currentQuestion.questionImage
            }
            style={styles.questionImage}
            resizeMode="contain"
          />
        )}

        {/* ANSWER LABEL */}
        <Text
          style={
            styles.answerLabel
          }>
          Answer set :
        </Text>

        {/* ANSWERS */}
        <View style={styles.answerContainer}>
          {currentQuestion.answers.map(
            answer => {
              const isSelected =
                selectedAnswer ===
                answer.id;

              return (
                <TouchableOpacity
                  key={answer.id}
                  activeOpacity={0.8}
                  style={[
                    styles.answerItem,

                    isSelected &&
                      styles.answerItemSelected,

                    answer.answerImage &&
                      styles.imageAnswerItem,
                  ]}
                  onPress={() =>
                    selectAnswer(
                      answer.id,
                    )
                  }>

                  {/* RADIO */}
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

                  {/* ANSWER TEXT */}
                  {answer.answerText && (
                    <Text
                      style={
                        styles.answerText
                      }>
                      {answer.answerText}
                    </Text>
                  )}

                  {/* ANSWER IMAGE */}
                  {answer.answerImage && (
                    <Image
                      source={
                        answer.answerImage
                      }
                      style={
                        styles.answerImage
                      }
                      resizeMode="contain"
                    />
                  )}

                </TouchableOpacity>
              );
            },
          )}
        </View>
      </>
    );
  };

  return (
    <SafeAreaView
      style={styles.container}>

      <AppHeader
        title={
          examDetail.set_details.title
        }
        onMenuPress={
          openParentDrawer
        }
        isMenuVisible={false}
        isNotificationVisible={
          false
        }
        onBellPress={() =>
          console.log('Bell')
        }
        onProfilePress={() =>
          console.log('Profile')
        }
        navigation={navigation}
      />

      <View style={styles.content}>

        <ScrollView
          showsVerticalScrollIndicator={
            false
          }
          contentContainerStyle={
            styles.scrollContent
          }>

          <View style={styles.examCard}>

            {/* =========================
                TIMER
            ========================== */}
            <View
              style={
                styles.timerContainer
              }>

              <View
                style={
                  styles.timerLeft
                }>

                <Image
                  source={require(
                    '../assets/images/icons/clock.png',
                  )}
                  style={
                    styles.smallIcon
                  }
                  resizeMode="contain"
                />

                <Text
                  style={
                    styles.timerLabel
                  }>
                  Time Left :
                </Text>

                <Text
                  style={
                    styles.timerText
                  }>
                  {formatTime(
                    timeLeft,
                  )}
                </Text>

              </View>

            </View>

            {/* =========================
                QUESTION NUMBER
            ========================== */}
            <View
              style={
                styles.questionNumberContainer
              }>

              <View
                style={
                  styles.questionNumberLeft
                }>

                <Image
                  source={require(
                    '../assets/images/icons/question.png',
                  )}
                  style={
                    styles.smallIcon
                  }
                  resizeMode="contain"
                />

                <Text
                  style={
                    styles.questionNumberLabel
                  }>
                  Question Number :
                </Text>

                <Text
                  style={
                    styles.currentQuestionNumber
                  }>
                  {String(
                    currentQuestionIndex +
                      1,
                  ).padStart(2, '0')}
                </Text>

                <Text
                  style={
                    styles.totalQuestionText
                  }>
                  / {questions.length}
                </Text>

              </View>

              {/* POINT */}
              <Text
                style={
                  styles.pointText
                }>
                Point :{' '}
                {currentQuestion.marks}
              </Text>

            </View>

            {/* =========================
                QUESTION AREA
            ========================== */}
            <View
              style={
                styles.questionCard
              }>

              {renderQuestion()}

            </View>

            {/* =========================
                SUBMIT
            ========================== */}
            <TouchableOpacity
              activeOpacity={0.8}
              style={
                styles.submitButton
              }
              onPress={
                handleSubmitClick
              }>

              <Text
                style={
                  styles.submitButtonText
                }>
                Submit
              </Text>

            </TouchableOpacity>

            {/* =========================
                PREVIOUS / NEXT
            ========================== */}
            <View
              style={
                styles.navigationContainer
              }>

              <TouchableOpacity
                activeOpacity={0.8}
                disabled={
                  currentQuestionIndex ===
                  0
                }
                style={[
                  styles.navigationButton,

                  currentQuestionIndex ===
                    0 &&
                    styles.navigationButtonDisabled,
                ]}
                onPress={
                  handlePrevious
                }>

                <Text
                  style={
                    styles.navigationArrow
                  }>
                  ‹
                </Text>

                <Text
                  style={
                    styles.navigationText
                  }>
                  Previous Question
                </Text>

              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={
                  styles.navigationButton
                }
                onPress={handleNext}>

                <Text
                  style={
                    styles.navigationText
                  }>
                  {currentQuestionIndex ===
                  questions.length - 1
                    ? 'Submit'
                    : 'Next Question'}
                </Text>

                <Text
                  style={
                    styles.navigationArrow
                  }>
                  ›
                </Text>

              </TouchableOpacity>

            </View>

          </View>

        </ScrollView>

      </View>

      {/* ============================
          SUBMIT CONFIRMATION MODAL
      ============================= */}
      <Modal
        visible={showSubmitModal}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setShowSubmitModal(false)
        }>

        <View
          style={
            styles.modalOverlay
          }>

          <View
            style={
              styles.submitModal
            }>

            <Text
              style={
                styles.modalTitle
              }>
              {isAutoSubmit
                ? 'Time Finished'
                : 'Submit Examination'}
            </Text>

            <Text
              style={
                styles.modalMessage
              }>
              {isAutoSubmit
                ? 'Your examination time has ended. Your answers will be submitted automatically.'
                : 'Are you sure you want to submit your examination? You will not be able to change your answers after submission.'}
            </Text>

            {!isAutoSubmit && (
              <View
                style={
                  styles.modalButtonContainer
                }>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={
                    styles.cancelButton
                  }
                  onPress={() =>
                    setShowSubmitModal(
                      false,
                    )
                  }>

                  <Text
                    style={
                      styles.cancelButtonText
                    }>
                    Cancel
                  </Text>

                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.8}
                  style={
                    styles.okButton
                  }
                  onPress={
                    handleFinalSubmit
                  }>

                  <Text
                    style={
                      styles.okButtonText
                    }>
                    OK
                  </Text>

                </TouchableOpacity>

              </View>
            )}

          </View>

        </View>

      </Modal>

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

  scrollContent: {
    padding: card.padding_samll,
    paddingBottom: 20,
  },

  /*
   * ==========================================
   * MAIN CARD
   * ==========================================
   */

  examCard: {
    backgroundColor:
      Colors.background_list_item,

    borderRadius:
      card.border_radius_card_small,

    padding: card.padding_samll,

    borderWidth: 1,

    borderColor:
      Colors.border_color,
  },

  /*
   * ==========================================
   * TIMER
   * ==========================================
   */

  timerContainer: {
    height: 38,

    backgroundColor:
      Colors.background,

    borderRadius:
      card.border_radius_card_small,

    borderWidth: 1,

    borderColor:
      Colors.border_color,

    justifyContent: 'center',

    paddingHorizontal: 8,

    marginBottom: 5,
  },

  timerLeft: {
    flexDirection: 'row',

    alignItems: 'center',
  },

  smallIcon: {
    width: 16,
    height: 16,

    marginRight: 6,

    tintColor:
      Colors.text_theme,
  },

  timerLabel: {
    fontFamily:
      FontFamily.semiBold,

    fontSize:
      FontSize.very_small,

    color: Colors.text,
  },

  timerText: {
    fontFamily:
      FontFamily.bold,

    fontSize:
      FontSize.medium,

    color: Colors.text_theme,

    marginLeft: 6,

    letterSpacing: 1,
  },

  /*
   * ==========================================
   * QUESTION NUMBER
   * ==========================================
   */

  questionNumberContainer: {
    minHeight: 38,

    backgroundColor:
      Colors.background,

    borderRadius:
      card.border_radius_card_small,

    borderWidth: 1,

    borderColor:
      Colors.border_color,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent:
      'space-between',

    paddingHorizontal: 8,

    marginBottom: 7,
  },

  questionNumberLeft: {
    flexDirection: 'row',

    alignItems: 'center',
  },

  questionNumberLabel: {
    fontFamily:
      FontFamily.semiBold,

    fontSize:
      FontSize.very_small,

    color: Colors.text,
  },

  currentQuestionNumber: {
    fontFamily:
      FontFamily.bold,

    fontSize:
      FontSize.regular,

    color:
      Colors.text_theme,

    marginLeft: 6,
  },

  totalQuestionText: {
    fontFamily:
      FontFamily.regular,

    fontSize:
      FontSize.small,

    color: Colors.text,

    marginLeft: 2,
  },

  pointText: {
    fontFamily:
      FontFamily.regular,

    fontSize:
      FontSize.vv_small,

    color: Colors.text,
  },

  /*
   * ==========================================
   * QUESTION
   * ==========================================
   */

  questionCard: {
    backgroundColor:
      Colors.white,

    borderWidth: 1,

    borderColor:
      Colors.border_color,

    borderRadius:
      card.border_radius_card_small,

    padding: card.padding_samll,

    marginBottom: 8,
  },

  questionLabel: {
    fontFamily:
      FontFamily.semiBold,

    fontSize:
      FontSize.small,

    color: Colors.text,

    marginBottom: 5,
  },

  questionText: {
    fontFamily:
      FontFamily.regular,

    fontSize:
      FontSize.small,

    color: Colors.text,

    lineHeight: 17,

    marginBottom: 10,
  },

  questionImage: {
    width: '100%',

    height: 150,

    marginBottom: 10,
  },

  /*
   * ==========================================
   * ANSWERS
   * ==========================================
   */

  answerLabel: {
    fontFamily:
      FontFamily.semiBold,

    fontSize:
      FontSize.small,

    color: Colors.text,

    marginBottom: 7,
  },

  answerContainer: {
    width: '100%',
  },

  answerItem: {
    minHeight: 38,

    borderWidth: 1,

    borderColor:
      Colors.border_color,

    borderRadius:
      card.border_radius_card_small,

    flexDirection: 'row',

    alignItems: 'center',

    paddingHorizontal: 8,

    marginBottom: 5,

    backgroundColor:
      Colors.white,
  },

  answerItemSelected: {
    borderColor:
      Colors.button_color,

    backgroundColor:
      Colors.white,
  },

  imageAnswerItem: {
    minHeight: 105,

    justifyContent: 'flex-start',

    paddingVertical: 5,

    alignItems: 'center',
  },

  /*
   * ==========================================
   * RADIO
   * ==========================================
   */

  radioOuter: {
    width: 14,

    height: 14,

    borderRadius: 7,

    borderWidth: 1,

    borderColor:
      Colors.iconBackGrey,

    justifyContent: 'center',

    alignItems: 'center',

    marginRight: 8,
  },

  radioOuterSelected: {
    borderColor:
      Colors.button_color,
  },

  radioInner: {
    width: 6,

    height: 6,

    borderRadius: 3,

    backgroundColor:
      Colors.button_color,
  },

  answerText: {
    flex: 1,

    fontFamily:
      FontFamily.regular,

    fontSize:
      FontSize.small,

    color: Colors.text,
  },

  answerImage: {
    width: 95,

    height: 90,

    marginHorizontal: 4,
  },

  /*
   * ==========================================
   * SUBMIT
   * ==========================================
   */

  submitButton: {
    height: 38,

    backgroundColor:
      Colors.button_color,

    borderRadius:
      card.border_radius_card_small,

    justifyContent: 'center',

    alignItems: 'center',

    marginBottom: 8,
  },

  submitButtonText: {
    fontFamily:
      FontFamily.semiBold,

    fontSize:
      FontSize.small,

    color: Colors.button_text,
  },

  /*
   * ==========================================
   * PREVIOUS / NEXT
   * ==========================================
   */

  navigationContainer: {
    flexDirection: 'row',

    justifyContent:
      'space-between',

    gap: 6,
  },

  navigationButton: {
    flex: 1,

    height: 36,

    borderWidth: 1,

    borderColor:
      Colors.border_color,

    backgroundColor:
      Colors.white,

    borderRadius:
      card.border_radius_card_small,

    flexDirection: 'row',

    alignItems: 'center',

    justifyContent:
      'center',
  },

  navigationButtonDisabled: {
    opacity: 0.45,
  },

  navigationArrow: {
    fontFamily:
      FontFamily.regular,

    fontSize:
      FontSize.large,

    color:
      Colors.text_theme,

    lineHeight: 20,

    marginHorizontal: 4,
  },

  navigationText: {
    fontFamily:
      FontFamily.regular,

    fontSize:
      FontSize.vv_small,

    color: Colors.text,
  },

  /*
   * ==========================================
   * SUBMIT MODAL
   * ==========================================
   */

  modalOverlay: {
    flex: 1,

    backgroundColor:
      Colors.loaderBackground,

    justifyContent: 'center',

    alignItems: 'center',

    paddingHorizontal: 25,
  },

  submitModal: {
    width: '100%',

    backgroundColor:
      Colors.white,

    borderRadius:
      card.border_radius_card,

    padding: card.padding,

    elevation: 8,

    shadowColor: '#000',

    shadowOffset: {
      width: 0,
      height: 3,
    },

    shadowOpacity: 0.25,

    shadowRadius: 5,
  },

  modalTitle: {
    fontFamily:
      FontFamily.semiBold,

    fontSize:
      FontSize.large,

    color: Colors.text,

    textAlign: 'center',

    marginBottom: 12,
  },

  modalMessage: {
    fontFamily:
      FontFamily.regular,

    fontSize:
      FontSize.small,

    color: Colors.text,

    lineHeight: 20,

    textAlign: 'center',

    marginBottom: 20,
  },

  modalButtonContainer: {
    flexDirection: 'row',

    gap: 10,
  },

  cancelButton: {
    flex: 1,

    height: 40,

    borderWidth: 1,

    borderColor:
      Colors.border_color,

    borderRadius:
      card.border_radius_card_small,

    justifyContent: 'center',

    alignItems: 'center',
  },

  cancelButtonText: {
    fontFamily:
      FontFamily.semiBold,

    fontSize:
      FontSize.small,

    color: Colors.text,
  },

  okButton: {
    flex: 1,

    height: 40,

    backgroundColor:
      Colors.button_color,

    borderRadius:
      card.border_radius_card_small,

    justifyContent: 'center',

    alignItems: 'center',
  },

  okButtonText: {
    fontFamily:
      FontFamily.semiBold,

    fontSize:
      FontSize.small,

    color:
      Colors.button_text,
  },
});