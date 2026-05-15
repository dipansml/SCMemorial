import { AttendanceData } from './AttendanceData';

export interface StudentAttendanceResponse {
  status: number;
  message: string;
  data: AttendanceData;
}