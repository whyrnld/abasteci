export interface Profile {
  id: string;
  full_name: string;
  cpf: string;
  phone: string;
  birth_date: string;
  email: string | null;
  preferred_fuel_type?: string;
  search_radius?: number;
  pix_key?: string;
  pix_key_type?: string;
  is_premium?: boolean;
  referral_code?: string;
  referred_by?: string;
}