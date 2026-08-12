export type StatusType = 'Present' | 'Absent' | 'Holiday' | 'Default';

export interface AttendanceItem {
  date: string;
  status: StatusType;
}