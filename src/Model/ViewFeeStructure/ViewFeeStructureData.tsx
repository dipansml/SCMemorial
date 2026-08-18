import { FeeStructureItem } from './FeeStructureItem';
import { SessionYear } from './SessionYear';

export interface ViewFeeStructureData {
  user_id: string;
  code: string;
  form_details: Record<string, any> | null;
  session_year: SessionYear;
  fee_structure: FeeStructureItem[];
  student_transaction_details: Record<string, any> | null;
  apr_mnth_payment: Record<string, any> | null;
  student_stationary_price: Record<string, any> | null;
  student_tblc_price: Record<string, any> | null;
}
