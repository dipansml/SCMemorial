import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

import {
  ExamSetItem,
  ExamOption,
  StudentExamAnswer,
} from '../Model/ExamDataset/LiveExamData';

import Colors from '../theme/colors';

import {
  Button,
  card,
  container,
  FontFamily,
  FontSize,
  iconBox,
} from '../theme/fonts_dimen';

import {BASE_URL_IMAGE} from '../services/RestApi';

interface Props {
  examItem: ExamSetItem;
  questionNumber: number;
  selectedOptionId?: string;
  onSelectOption: (option: ExamOption) => void;
}

const ExamQuestionAnswer = ({
  examItem,
  questionNumber,
  selectedOptionId,
  onSelectOption,
}: Props) => {
  const question = examItem.question;
  const options = examItem.option || [];

  const hasQuestionText =
    question.question &&
    question.question.trim().length > 0;

  const hasQuestionImage =
    question.question_file &&
    question.question_file.trim().length > 0;

  /**
   * Replace this function later with your actual
   * image URL/base URL logic when API integration is done.
   */
  const getImageSource = (file: string) => {
    if (!file) {
      return null;
    }

    return {
      uri: BASE_URL_IMAGE + file,
    };
  };

  return (
    <View style={styles.container}>

      {/* Question Header */}
      <View style={styles.questionHeader}>
        <Text style={styles.questionNumber}>
          Question {questionNumber}
        </Text>

        {/* <View style={styles.marksContainer}>
          <Text style={styles.marksText}>
            {question.marks || '0'} Point
          </Text>
        </View> */}
      </View>

      {/* Question Card */}
      <View style={styles.questionCard}>

        {/* Question Text */}
        {hasQuestionText && (
          <Text style={styles.questionText}>
            {question.question}
          </Text>
        )}

        {/* Question Image */}
        {hasQuestionImage && (
          <Image
            source={getImageSource(question.question_file)!}
            style={styles.questionImage}
            resizeMode="contain"
          />
        )}

      </View>

      {/* Options */}
      <View style={styles.optionsContainer}>

        {options.map((option, index) => {
          const isSelected =
            selectedOptionId === option.option_id;

          const hasOptionText =
            option.option &&
            option.option.trim().length > 0;

          const hasOptionImage =
            option.option_file &&
            option.option_file.trim().length > 0;

          return (
            <TouchableOpacity
              key={option.option_id}
              activeOpacity={0.8}
              style={[
                styles.optionCard,
                isSelected && styles.selectedOptionCard,
              ]}
              onPress={() => onSelectOption(option)}
            >

              {/* Radio Button */}
              <View
                style={[
                  styles.radioOuter,
                  isSelected && styles.radioOuterSelected,
                ]}
              >
                {isSelected && (
                  <View style={styles.radioInner} />
                )}
              </View>

              {/* Option Content */}
              <View style={styles.optionContent}>

                {/* Option Text */}
                {hasOptionText && (
                  <Text
                    style={[
                      styles.optionText,
                      isSelected && styles.selectedOptionText,
                    ]}
                  >
                    {option.option}
                  </Text>
                )}

                {/* Option Image */}
                {hasOptionImage && (
                  <Image
                    source={getImageSource(option.option_file)!}
                    style={styles.optionImage}
                    resizeMode="contain"
                  />
                )}

              </View>

              {/* A/B/C/D */}
              {/* <View
                style={[
                  styles.optionNumber,
                  isSelected &&
                    styles.optionNumberSelected,
                ]}
              >
                <Text
                  style={[
                    styles.optionNumberText,
                    isSelected &&
                      styles.optionNumberTextSelected,
                  ]}
                >
                  {String.fromCharCode(65 + index)}
                </Text>
              </View> */}

            </TouchableOpacity>
          );
        })}

      </View>
    </View>
  );
};

export default ExamQuestionAnswer;

const styles = StyleSheet.create({

  container: {
    flex: 1,
  },

  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  questionNumber: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.medium,
    color: Colors.text,
  },

  marksContainer: {
    backgroundColor: Colors.tab_icon_back,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  marksText: {
    fontFamily: FontFamily.medium,
    fontSize: FontSize.small,
    color: Colors.theme_color,
  },

  questionCard: {
    backgroundColor: Colors.background_list_item,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,

    borderWidth: 1,
    borderColor: Colors.border_color,

    elevation: 2,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },

  questionText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.medium,
    lineHeight: 24,
    color: Colors.text,
  },

  questionImage: {
    width: '100%',
    height: 180,
    marginTop: 12,
    borderRadius: 10,
  },

  optionsContainer: {
    gap: 10,
  },

  optionCard: {
    minHeight: 58,

    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: Colors.background_list_item,

    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border_color,

    paddingHorizontal: 12,
    paddingVertical: 10,
  },

  selectedOptionCard: {
    borderColor: Colors.primary,
    backgroundColor: Colors.tab_icon_back,
  },

  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,

    borderWidth: 2,
    borderColor: Colors.tintColor,

    justifyContent: 'center',
    alignItems: 'center',

    marginRight: 10,
  },

  radioOuterSelected: {
    borderColor: Colors.primary,
  },

  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },

  optionContent: {
    flex: 1,
    justifyContent: 'center',
  },

  optionText: {
    fontFamily: FontFamily.regular,
    fontSize: FontSize.regular,
    color: Colors.text,
    lineHeight: 20,
  },

  selectedOptionText: {
    fontFamily: FontFamily.semiBold,
    color: Colors.primary,
  },

  optionImage: {
    width: '100%',
    height: 120,
    marginTop: 4,
  },

  optionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,

    justifyContent: 'center',
    alignItems: 'center',

    backgroundColor: Colors.light_gray,

    marginLeft: 8,
  },

  optionNumberSelected: {
    backgroundColor: Colors.primary,
  },

  optionNumberText: {
    fontFamily: FontFamily.semiBold,
    fontSize: FontSize.small,
    color: Colors.menu_tint,
  },

  optionNumberTextSelected: {
    color: Colors.white,
  },
});