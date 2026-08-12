import { FeeStructureData } from './FeeStructureData';


export interface FeeStructureResponse {
  status: number;
  message: string;
  data: FeeStructureData;
}