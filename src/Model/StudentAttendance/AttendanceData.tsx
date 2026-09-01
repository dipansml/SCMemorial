import { AttendanceItem } from './AttendanceItem';
import { ExtraClassItem } from './ExtraClassItem'


export interface AttendanceData {
  name: string;
  class: string;
  roll: string;
  academic_year: string;
  present: number;
  absent: number;
  holiday: number;
  halfday: number;
  gender: string;
  image: string;
  attendance_percentage: number;
  AttendanceItem: AttendanceItem[];
  ExtraClass: ExtraClassItem[];
}