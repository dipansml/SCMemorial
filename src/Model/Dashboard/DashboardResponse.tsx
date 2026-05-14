// DashboardResponse.ts

import { DashboardData } from './DashboardData';

export interface DashboardResponse {
  status: number;
  message: string;
  data: DashboardData;
}