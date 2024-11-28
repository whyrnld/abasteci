import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

export interface Station {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  cnpj: string | null;
  image_url: string | null;
  prices: {
    regular: number;
    premium: number;
    ethanol: number;
    diesel: number;
    updated_at: string;
  };
  distance: string;
  lastUpdate: string;
  calculatedDistance?: number;
}

export const useStations = () => {
  const { data: stations, isLoading } = useQuery({
    queryKey: ['stations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stations')
        .select('*, prices!inner(regular, premium, ethanol, diesel, updated_at)')
        .order('name');

      if (error) throw error;

      return data.map((station: any) => ({
        ...station,
        prices: {
          regular: station.prices[0].regular,
          premium: station.prices[0].premium,
          ethanol: station.prices[0].ethanol,
          diesel: station.prices[0].diesel,
        },
        lastUpdate: new Date(station.prices[0].updated_at).toLocaleString(),
        distance: '1.2km', // This will be replaced by calculated distance
      })) as Station[];
    },
  });

  return {
    stations,
    isLoading,
  };
};