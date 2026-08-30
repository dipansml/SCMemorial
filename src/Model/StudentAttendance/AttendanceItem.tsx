export type StatusType = 'Present' | 'Absent' | 'Holi Day' | 'Half Day' | 'Default';

export interface AttendanceItem {
  date: string;
  status: StatusType;
}