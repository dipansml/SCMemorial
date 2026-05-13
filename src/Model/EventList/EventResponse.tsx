import {EventData} from './EventData';

export interface EventResponse {
  status: number;
  message: string;
  data: EventData;
}