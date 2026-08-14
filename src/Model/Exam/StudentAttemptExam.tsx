export interface StudentAttemptExamResponse {
  status: number;
  message: string;
  data: StudentAttemptExamData;
}

export default interface StudentAttemptExamData {
  user_id: string;
  set_unique_id: string;
  set_details: SetDetails;
}

export interface SetDetails {
  set_id: string;
  set_unique_id: string;
  class_id: string;
  subject_id: string;
  language: string;
  session_year_id: string;
  title: string;
  exm_time: string;
  status: string;
  marks: string;
  deleted: string;
  created_by: string;
  created_date: string;
  modified_by: string;
  modified_date: string;
  exam_date: string;
  total_questions: string;
  total_marks: string | null;
  class_name: string;
  subject_name: string;
}