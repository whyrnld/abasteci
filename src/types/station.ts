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