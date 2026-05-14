import { StudentDetails } from './StudentDetails';
import { PerformanceOverview } from './PerformanceOverview';
import { DueInfo } from './DueInfo';
import { LibraryItem } from '../StudentLibrary/LibraryItem';

export interface DashboardData {
  studentdetails: StudentDetails;
  performance_overview: PerformanceOverview[];
  due_info: DueInfo;
  books: LibraryItem[];
}