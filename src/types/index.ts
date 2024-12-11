export interface Station {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  image_url?: string;
  prices?: {
    regular: number;
    premium: number;
    ethanol: number;
    diesel: number;
    updated_at: string;
  };
  calculatedDistance?: number;
}

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
