import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useLocation } from '@/contexts/LocationContext';
import { calculateDistance } from '@/utils/distance';

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
  const { location } = useLocation();

  const { data: stations, isLoading } = useQuery({
    queryKey: ['stations', location?.lat, location?.lng],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stations')
        .select('*, prices!inner(regular, premium, ethanol, diesel, updated_at)')
        .order('name');

      if (error) throw error;

      return data.map((station: any) => {
        const calculatedDistance = location
          ? calculateDistance(
              location.lat,
              location.lng,
              station.latitude,
              station.longitude
            )
          : undefined;

        return {
          ...station,
          prices: {
            regular: station.prices[0].regular,
            premium: station.prices[0].premium,
            ethanol: station.prices[0].ethanol,
            diesel: station.prices[0].diesel,
          },
          lastUpdate: new Date(station.prices[0].updated_at).toLocaleString(),
          calculatedDistance,
        };
      }) as Station[];
    },
    enabled: true,
  });

  return {
    stations,
    isLoading,
  };
};