export type QuestionType =
  | 'TEXT_TEXT'
  | 'TEXT_IMAGE'
  | 'IMAGE_IMAGE'
  | 'IMAGE_TEXT'
  | 'IMAGE_TEXT_IMAGE';

export interface ExamAnswer {
  id: string;
  answerText?: string;
  answerImage?: any;
}

export interface ExamQuestion {
  id: string;
  questionNumber: number;
  marks: number;

  questionType: QuestionType;

  questionText: string;
  questionImage?: any;

  answers: ExamAnswer[];
}

export const demoExamQuestions: ExamQuestion[] = [
  // --------------------------------------------------
  // 1. TEXT QUESTION + TEXT ANSWER
  // --------------------------------------------------
  {
    id: 'Q1',
    questionNumber: 1,
    marks: 1,
    questionType: 'TEXT_TEXT',

    questionText:
      'Which is the capital of India?',

    answers: [
      {
        id: 'Q1_A',
        answerText: 'Mumbai',
      },
      {
        id: 'Q1_B',
        answerText: 'New Delhi',
      },
      {
        id: 'Q1_C',
        answerText: 'Kolkata',
      },
      {
        id: 'Q1_D',
        answerText: 'Chennai',
      },
    ],
  },

  // --------------------------------------------------
  // 2. TEXT QUESTION + IMAGE ANSWER
  // --------------------------------------------------
  {
    id: 'Q2',
    questionNumber: 2,
    marks: 1,
    questionType: 'TEXT_IMAGE',

    questionText:
      'Which map represents India?',

    answers: [
      {
        id: 'Q2_A',
        answerImage: require('../../assets/images/exam/india_map.png'),
      },
      {
        id: 'Q2_B',
        answerImage: require('../../assets/images/exam/india_map.png'),
      },
      {
        id: 'Q2_C',
        answerImage: require('../../assets/images/exam/india_map.png'),
      },
      {
        id: 'Q2_D',
        answerImage: require('../../assets/images/exam/india_map.png'),
      },
    ],
  },

  // --------------------------------------------------
  // 3. TEXT + IMAGE QUESTION + IMAGE ANSWER
  // --------------------------------------------------
  {
    id: 'Q3',
    questionNumber: 3,
    marks: 1,

    questionType: 'IMAGE_IMAGE',

    questionText:
      'Identify the state shown in the following map.',

    questionImage: require('../../assets/images/exam/question_map.png'),

    answers: [
      {
        id: 'Q3_A',
        answerImage: require('../../assets/images/exam/india_map.png'),
      },
      {
        id: 'Q3_B',
        answerImage: require('../../assets/images/exam/india_map.png'),
      },
      {
        id: 'Q3_C',
        answerImage: require('../../assets/images/exam/india_map.png'),
      },
      {
        id: 'Q3_D',
        answerImage: require('../../assets/images/exam/india_map.png'),
      },
    ],
  },

  // --------------------------------------------------
  // 4. TEXT + IMAGE QUESTION + TEXT ANSWER
  // --------------------------------------------------
  {
    id: 'Q4',
    questionNumber: 4,
    marks: 1,

    questionType: 'IMAGE_TEXT',

    questionText:
      'Look at the image and identify the correct option.',

    questionImage: require('../../assets/images/exam/question_map.png'),

    answers: [
      {
        id: 'Q4_A',
        answerText: 'West Bengal',
      },
      {
        id: 'Q4_B',
        answerText: 'Bihar',
      },
      {
        id: 'Q4_C',
        answerText: 'Odisha',
      },
      {
        id: 'Q4_D',
        answerText: 'Assam',
      },
    ],
  },

  // --------------------------------------------------
  // 5. TEXT + IMAGE QUESTION + TEXT + IMAGE ANSWER
  // --------------------------------------------------
  {
    id: 'Q5',
    questionNumber: 5,
    marks: 1,

    questionType: 'IMAGE_TEXT_IMAGE',

    questionText:
      'Identify the correct map from the options below.',

    questionImage: require('../../assets/images/exam/question_map.png'),

    answers: [
      {
        id: 'Q5_A',
        answerText: 'India',
        answerImage: require('../../assets/images/exam/india_map.png'),
      },
      {
        id: 'Q5_B',
        answerText: 'Asia',
        answerImage: require('../../assets/images/exam/india_map.png'),
      },
      {
        id: 'Q5_C',
        answerText: 'Europe',
        answerImage: require('../../assets/images/exam/india_map.png'),
      },
      {
        id: 'Q5_D',
        answerText: 'World',
        answerImage: require('../../assets/images/exam/india_map.png'),
      },
    ],
  },
];