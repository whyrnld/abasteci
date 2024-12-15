export interface Profile {
  id: string;
  full_name: string;
  cpf: string;
  phone: string;
  birth_date: string;
  email: string | null;
  preferred_fuel_type: string;
  search_radius: number;
  pix_key_type: string | null;
  pix_key: string | null;
  is_premium: boolean;
  referral_code: string | null;
  referred_by: string | null;
}
