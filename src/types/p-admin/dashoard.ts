export interface AdminDashboardDataBoxType {
  title: string | number;
  subTitle: string | number;
  chart?: string;
  status?: string;
  bgColor?: string;
}

// types/blog.ts
export interface Category {
  id: number | string;
  title: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

export interface BlogCategory {
  id?: number;
  title?: string;
  icon?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Blog {
  id?: number;
  blog_category_id?: number;
  image?: string;
  title?: string;
  tags?: string[];
  short_description?: string;
  long_description?: string;
  author?: string;
  references?: string;
  created_at?: string;
  updated_at?: string;
  category?: BlogCategory;
}

export interface BlogListResponse {
  data: Blog[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export interface walletTransactionProps {
  success: boolean;
  message: string;
  data: {
    id: number;
    date: string;
    amount: string;
    from_user: null;
    to_user: number;
    type: string;
    details: string;
    status: string;
  };
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  errors: null;
}

export type BlogInlineBoxViewProps = {
  blogs: Blog[];
  onEdit?: (blog: Blog) => void;
  onDelete?: (blog: Blog) => void;
  onView?: (blog: Blog) => void;
};

export interface CountryType {
  id: number;
  name: string;
  code: string;
  dial_code: string;
}

export interface PlanType {
  id: number;
  name: string;
  type: string;
  duration_months: number;
  min_investment: string;
  user_percentage: string;
  company_percentage: string;
  withdrawal_fee_percentage: string;
  can_earn_referral: boolean;
  can_earn_commission: boolean;
  can_earn_annual_sales: boolean;
  has_loss_coverage: boolean;
  has_bonus_shield: boolean;
  is_active: boolean;
  is_tournament_eligible: boolean;
  tournament_duration_days: number | null;
  created_at: string;
  updated_at: string;
}

export interface UserProfileType {
  id: number;
  tid: number;
  referrer_id: number | null;
  sponsor_id: number | null;
  first_name: string;
  last_name: string;
  dial_code: string;
  email: string;
  mobile: string;
  gender: string;
  user_type: string;
  two_factor_confirmed: boolean;
  status: string;
  sales_volume: string;
  rank_id: number | null;
  created_at: string;
  updated_at: string;
  verify_at: string | null;
  country: CountryType;
  plan: PlanType;
}

export interface DashboardResponse {
  user_stats: {
    total: number;
    total_new_today: number;
    investors: number;
    investors_new_today: number;
    marketers: number;
    marketers_new_today: number;
    contract_free: number;
    expired_contracts: number;
  };
  tasks: {
    pending_deposits: number;
    pending_investments: number;
    pending_withdrawals: number;
    pending_cancellations: number;
  };
  system_overview: {
    total_investment: string;
    total_roi_paid: number;
    total_referrals_paid: number;
    total_commissions_paid: number;
    total_payouts: number;
    total_t_wallet_balance: string;
    inactive_accounts: number;
    award_winners: number;
    total_renewals: number;
    total_cancellations: number;
    total_fees: number;
    capital_health: {
      total_dd: number;
      risky: number;
      normal: number;
      perfect: number;
    };
  };
  ranks_overview: {
    Bronze: number;
    Silver: number;
    Gold: number;
    "Rank 5": number;
    "Rank 6": number;
    "Rank 7": number;
    "Rank 9": number;
    [key: string]: number;
  };
}




export interface Reward {
  type: string;
  description?: string;
  cash_value?: number;
  amount?: number;
}

export interface Rank {
  id: number;
  name: string;
  level: number;
  min_sales_volume: number;
  prize_description: string | null;
  required_downline_rank_id: number | null;
  required_downline_rank_count: number;
  rewards: string | Reward[] | null; 
  tournament_prize_amount: string;
  created_at: string;
  updated_at: string;
  icon_path: string | null;
  description: string | null;
}

export interface Meta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface RankApiResponse {
  success: boolean;
  message: string;
  data: Rank[];
  meta: Meta;
  errors: any;
}
