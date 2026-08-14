import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
} from 'react-native';
import AppHeader from '../component/AppHeader';
import { openParentDrawer } from '../navigation/navigationRef';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { card, container, FontFamily, FontSize } from '../theme/fonts_dimen';
import Colors from '../theme/colors';
import FullScreenLoader from '../view/FullScreenLoader';

type Props = NativeStackScreenProps<RootStackParamList, 'ExamDetail'>;

const ExamDetail = ({ navigation, route }: Props ) => {
  const { examDetail } = route.params;
  const [loading, setLoading] = useState(false);
  const [showInstruction, setShowInstruction] =
  useState(false);


  return (
    <SafeAreaView style={styles.container}>
      <FullScreenLoader visible={loading} />
      <AppHeader
        title="Exam Details"
        showBack= {true}
        onMenuPress={navigation.goBack}
        onBellPress={() => console.log('Bell')}
        onProfilePress={() => console.log('Profile')}
        navigation={navigation}
      />

      <View style={styles.content}>

        {/* Exam Header Card */}
        <View style={styles.examHeaderCard}>

          <Text style={styles.examTitle}>
            {examDetail?.set_details?.title || 'N/A'}
          </Text>

          <Text style={styles.examSubtitle}>
            {examDetail?.set_details?.subject_name || 'N/A'}
          </Text>

          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              Ready for Examination
            </Text>
          </View>

        </View>

        {/* Exam Information */}
        <View style={styles.infoCard}>

          <Text style={styles.sectionTitle}>
            Exam Details
          </Text>

          <View style={styles.detailsGrid}>

            {/* Class */}
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>
                Class
              </Text>

              <Text style={styles.detailValue}>
                {examDetail?.set_details?.class_name || 'N/A'}
              </Text>
            </View>

            {/* Subject */}
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>
                Subject
              </Text>

              <Text style={styles.detailValue}>
                {examDetail?.set_details?.subject_name || 'N/A'}
              </Text>
            </View>

            {/* Language */}
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>
                Language
              </Text>

              <Text style={styles.detailValue}>
                {examDetail?.set_details?.language || 'N/A'}
              </Text>
            </View>

            {/* Exam Date */}
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>
                Exam Date
              </Text>

              <Text style={styles.detailValue}>
                {examDetail?.set_details?.exam_date || 'N/A'}
              </Text>
            </View>

            {/* Duration */}
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>
                Duration
              </Text>

              <Text style={styles.detailValue}>
                {examDetail?.set_details?.exm_time
                  ? `${examDetail.set_details.exm_time} Minutes`
                  : 'N/A'}
              </Text>
            </View>

            {/* Questions */}
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>
                Total Questions
              </Text>

              <Text style={styles.detailValue}>
                {examDetail?.set_details?.total_questions || '0'}
              </Text>
            </View>

            {/* Total Marks */}
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>
                Total Marks
              </Text>

              <Text style={styles.detailValue}>
                {examDetail?.set_details?.total_marks || 'N/A'}
              </Text>
            </View>

            {/* Set ID */}
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>
                Question Set ID
              </Text>

              <Text style={styles.detailValue}>
                {examDetail?.set_unique_id || 'N/A'}
              </Text>
            </View>

          </View>

        </View>

        {/* Start Exam Button */}
       <TouchableOpacity
          activeOpacity={0.8}
          style={styles.startButton}
          onPress={() => {
            console.log(
              'Start Exam:',
              examDetail?.set_unique_id,
            );

            setShowInstruction(true);
          }}>
          <Text style={styles.startButtonText}>
            Start Examination
          </Text>
        </TouchableOpacity>
      </View>
      <Modal
          visible={showInstruction}
          transparent
          animationType="fade"
          onRequestClose={() =>
            setShowInstruction(false)
          }>

          <View style={styles.modalOverlay}>

            <View style={styles.instructionModal}>

              {/* Header */}
              <Text style={styles.modalTitle}>
                Examination Instructions
              </Text>

              {/* Instructions */}
              <View style={styles.instructionContainer}>

                <Text style={styles.instructionText}>
                  • Read all questions carefully before
                  answering.
                </Text>

                <Text style={styles.instructionText}>
                  • Make sure you have enough time to
                  complete the examination.
                </Text>

                <Text style={styles.instructionText}>
                  • Once you start the examination, the
                  timer will begin.
                </Text>

                <Text style={styles.instructionText}>
                  • Do not close or leave the examination
                  screen while attempting the exam.
                </Text>

                <Text style={styles.instructionText}>
                  • Make sure you submit your answers
                  before the examination time ends.
                </Text>

              </View>

              {/* OK Button */}
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.okButton}
                onPress={() => {
                  setShowInstruction(false);

                  navigation.navigate('StartExam', {
                    examDetail: examDetail,
                  });
                }}>

                <Text style={styles.okButtonText}>
                  OK
                </Text>

              </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      );
    };

export default ExamDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  content: {
    flex: 1,
    paddingHorizontal: card.padding_card_medium,
    paddingTop: card.padding_card_medium,
  },

  /* =========================
     EXAM HEADER
  ========================== */

  examHeaderCard: {
    backgroundColor: Colors.white,

    borderRadius: card.border_radius_card_medium,

    borderWidth: 1,
    borderColor: Colors.border_color,

    padding: card.padding,

    alignItems: 'center',

    elevation: 2,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 3,

    marginBottom: card.margin_bottom,
  },

  examTitle: {
    fontFamily: FontFamily.bold,
    fontSize: FontSize.large,
    color: Colors.text,

    textAlign: 'center',

    marginBottom: 4,
  },

  examSubtitle: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.small,
    color: Colors.text_light,

    textAlign: 'center',

    marginBottom: 10,
  },

  statusBadge: {
    backgroundColor: Colors.present,

    paddingHorizontal: 12,
    paddingVertical: 5,

    borderRadius: 20,
  },

  statusText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.very_small,
    color: Colors.success,
  },

  /* =========================
     DETAILS CARD
  ========================== */

  infoCard: {
    backgroundColor: Colors.white,

    borderRadius: card.border_radius_card_medium,

    borderWidth: 1,
    borderColor: Colors.border_color,

    padding: card.padding,

    marginBottom: card.margin_bottom,

    elevation: 1,
  },

  sectionTitle: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.medium,
    color: Colors.text,

    marginBottom: 14,
  },

  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  detailItem: {
    width: '50%',
    marginBottom: 14,

    paddingRight: 8,
  },

  detailLabel: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.very_small,
    color: Colors.text_light,

    marginBottom: 3,
  },

  detailValue: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.small,
    color: Colors.text,

    lineHeight: 17,
  },

  /* =========================
     START BUTTON
  ========================== */

  startButton: {
    height: 44,

    backgroundColor: Colors.primary,

    borderRadius: card.border_radius_card_medium,

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

  startButtonText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.regular,
    color: Colors.button_text,
  },

  modalOverlay: {
  flex: 1,

  backgroundColor: Colors.loaderBackground,

  justifyContent: 'center',
  alignItems: 'center',

  paddingHorizontal: 20,
},

  instructionModal: {
    width: '100%',

    backgroundColor: Colors.white,

    borderRadius: card.border_radius_card,

    padding: card.padding,

    elevation: 8,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },

  modalTitle: {
    fontFamily: FontFamily.semiBold,

    fontSize: FontSize.large,

    color: Colors.text,

    textAlign: 'center',

    marginBottom: 16,
  },

  instructionContainer: {
    marginBottom: 20,
  },

  instructionText: {
    fontFamily: FontFamily.regular,

    fontSize: FontSize.small,

    color: Colors.text,

    lineHeight: 20,

    marginBottom: 8,
  },

  okButton: {
    height: 42,

    backgroundColor: Colors.primary,

    borderRadius:
      card.border_radius_card_medium,

    justifyContent: 'center',
    alignItems: 'center',
  },

  okButtonText: {
    fontFamily: FontFamily.semiBold,

    fontSize: FontSize.regular,

    color: Colors.button_text,
  },
});