import { StudentListData } from "./StudentListData";

export interface StudentListResponse {
  status: number;
  message: string;
  data: StudentListData;
}