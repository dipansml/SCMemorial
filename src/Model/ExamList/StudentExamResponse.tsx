import { StudentExamData } from './StudentExamData';

export interface StudentExamResponse {
  status: number;
  message: string;
  data: StudentExamData;
}