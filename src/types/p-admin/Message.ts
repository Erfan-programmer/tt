export interface Replier {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  mobile: string;
  user_type: string;
  tid?: number;
  referrer_id?: number | null;
  sponsor_id?: number | null;
  dial_code?: string;
  gender?: string;
  two_factor_confirmed?: boolean;
  status?: string;
  sales_volume?: string;
  rank_id?: number | null;
  created_at?: string;
  updated_at?: string;
  verify_at?: string;
}

export interface DepartmentType {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}
export interface Reply {
  id: number;
  ticket_id: number;
  replier_type: "App\\Models\\Client" | "App\\Models\\Admin";
  replier_id: number;
  message: string;
  created_at: string;
  updated_at: string;
  department: DepartmentType;

  attachments: any[];
  replier: Replier;
}

export interface ContractLast {
  id: number;
  client_id: number;
  plan_id: number;
  contract_number: string;
  investment_amount: string;
  canCancelContract: boolean;
  current_balance: string;
  total_income: string;
  total_roi_income: string;
  total_covered_loss: string;
  unrealized_loss_percentage: string;
  consecutive_loss_months: number;
  active_bonus_shield_amount: string;
  start_date: string;
  end_date: string;
  status: string;
  market_status: string;
  tournament_status: string;
  entered_market_at: string;
  tournament_started_at: string;
  tournament_ends_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Wallet {
  id: number;
  title: string;
  address: string;
  description: string;
  icon_path?: string | File;
  is_active?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Crypto {
  id: number;
  title: string;
  network: string;
  description: string;
  icon_path?: string | File;
  created_at?: string;
  updated_at?: string;
}

export interface CashRewardRecipient {
  id: number;
  created_at: string;
  user: string;
  rank: string;
  prize: string;
  wallet_type: string;
  wallet_address: string;
  status: "approved" | "pending" | "rejected" | string;
}

export interface CashRewardHistoryRecipient {
  id: number;
  created_at: string;
  user: string;
  rank: string;
  prize: string;
  wallet_type: string;
  wallet_address: string;
  TXid?: string;
  status: "approved" | "pending" | "rejected" | string;
}
