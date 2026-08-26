import { ReAdmissionApiData } from './ReAdmissionApiData';

export interface ReAdmissionApiResponse {
  status: number;
  message: string;
  data: ReAdmissionApiData;
}
