export type StatusType = 'Present' | 'Absent' | 'Holiday' | 'Half Day' | 'Default';

export interface AttendanceItem {
  date: string;
  status: StatusType;
}