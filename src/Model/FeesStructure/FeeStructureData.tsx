import { FeeBreakdownItem } from "./FeeBreakdownItem";

export interface FeeStructureData {
  outstanding_amount: string;
  paid_amount: string;
  due_amount: number;
  late_fee: number;
  current_month: string;
  due_month: string;
  fees_breakdown: FeeBreakdownItem[];
}