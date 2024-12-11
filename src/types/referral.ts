export interface Referral {
  id: number;
  referred: {
    full_name: string;
    created_at: string;
  };
  status: string;
  bonus_paid: boolean;
  created_at: string;
}