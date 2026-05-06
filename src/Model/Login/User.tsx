import { UserDetails } from './UserDetails';

export interface User {
  id: string;
  name: string;
  email: string;
  dept_id: string;
  session_year_id: string;
  session_year_name: string;
  user_details: UserDetails;
}