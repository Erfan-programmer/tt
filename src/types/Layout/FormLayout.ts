export type datas = {
  title: string;
  mobileTitle?: string;
  mobileSubTitle?: string;
  subTitle?: string;
};
export type DatasPage = {
  register: datas;
};

export type PaymentData = {
  wallet_address: string;
  currency_amount: number;
  usd_amount: number;
  billing_currency: string;
  invoice_number: number;
  qr: string;
};

export interface RankType {
  id: number;
  icon_path: string;
  name: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM" | string;
  can_send_messages: boolean;
  level: number;
  description: string;
  min_sales_volume: number;
  prize_description: string;
  required_downline_rank_id: number;
  required_downline_rank_count: number;
  rewards: string;
  tournament_prize_amount: string;
  created_at: string;
  updated_at: string;
}

export interface AchievementType {
  id: number;
  client_id: number;
  rank_id: number;
  badge_description: string;
  earned_at: string;
  created_at: string;
  updated_at: string;
  rank: RankType;
}
