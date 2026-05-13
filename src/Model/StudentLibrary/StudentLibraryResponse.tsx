import { LibraryData } from './LibraryData';

export interface StudentLibraryResponse {
  status: number;
  message: string;
  data: LibraryData;
}