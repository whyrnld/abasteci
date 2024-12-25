export interface Profile {
  id: string;
  full_name: string;
  cpf: string;
  phone: string;
  birth_date: string;
  email: string | null;
  is_premium: boolean;
  referral_code: string | null;
  referred_by: string | null;
  preferred_fuel_type: string;
  search_radius: number;
  pix_key_type: string | null;
  pix_key: string | null;
  created_at: string;
  updated_at: string;
}

export interface Station {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  cnpj: string | null;
  image_url: string | null;
  brand_id: number | null;
  created_at: string;
  phone?: string;
  prices?: {
    regular: number;
    premium: number;
    ethanol: number;
    diesel: number;
    updated_at: string;
  };
  calculatedDistance?: number;
}

export interface Referral {
  id: number;
  referrer_id: string;
  referred_id: string;
  status: 'pending' | 'completed';
  bonus_paid: boolean;
  created_at: string;
  referred?: Profile;
}
