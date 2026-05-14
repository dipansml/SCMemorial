import { HomeworkData } from './HomeworkData';


export interface StudentHomeworkResponse {
  status: number;
  message: string;
  data: HomeworkData;
}