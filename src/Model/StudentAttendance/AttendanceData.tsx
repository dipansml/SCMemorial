import { AttendanceItem } from './AttendanceItem';

export interface AttendanceData {
  name: string;
  class: string;
  roll: string;
  academic_year: string;
  present: number;
  absent: number;
  holiday: number;
  gender: string;
  attendance_percentage: number;
  AttendanceItem: AttendanceItem[];
}