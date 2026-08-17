export interface ExamQuestion {
  question_id: string;
  set_id: string;
  question: string;
  question_file: string;
  marks: string;
  option_number: string;
  deleted: string;
  created_by: string;
  created_date: string;
  modified_by: string;
  modified_date: string;
}

export interface ExamOption {
  option_id: string;
  question_id: string;
  option: string;
  option_file: string;
  is_correct: string;
  deleted: string;
  created_by: string;
  created_date: string;
  modified_by: string;
  modified_date: string;
}

export interface ExamSetItem {
  question: ExamQuestion;
  option: ExamOption[];
}

export interface LiveExamData {
  user_id: string;
  set_unique_id: string;
  set_id: string;
  exm_time: string;
  examset: ExamSetItem[];
  num_of_ques: number;
  start_time: string;
  end_time: string;
  result_id: string;
}

export interface LiveExamResponse {
  status: number;
  message: string;
  data: LiveExamData;
}

export interface StudentExamAnswer {
  user_id: string;
  set_unique_id: string;
  set_id: string;
  result_id: string;
  questionids: number[];
  optionids: number[];
}