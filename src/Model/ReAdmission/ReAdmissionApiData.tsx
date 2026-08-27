import { ReAdmissionFormDetails } from './ReAdmissionFormDetails';
import { ReAdmissionStationaryApiItem } from './ReAdmissionStationaryApiItem';
import { ReAdmissionStoppage } from './ReAdmissionStoppage';

export interface ReAdmissionApiData {
  user_id: string;
  form_details: ReAdmissionFormDetails;
  stationary_total_price: string;
  stationary_item_list: ReAdmissionStationaryApiItem[];
  section_list: ReAdmissionStoppage[];
}
