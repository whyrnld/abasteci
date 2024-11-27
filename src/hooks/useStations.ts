import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface Station {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  prices: {
    regular: number;
    premium: number;
    ethanol: number;
    diesel: number;
  };
  distance?: string;
  lastUpdate?: string;
}

export const useStations = () => {
  const { data: stations, isLoading } = useQuery({
    queryKey: ['stations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stations')
        .select(`
          *,
          prices (
            regular,
            premium,
            ethanol,
            diesel,
            updated_at
          )
        `)
        .order('name');

      if (error) throw error;

      return data.map((station: any) => ({
        ...station,
        prices: station.prices[0],
        lastUpdate: new Date(station.prices[0].updated_at).toLocaleString(),
        distance: '1.2km', // TODO: Calculate real distance
      })) as Station[];
    },
  });

  return {
    stations,
    isLoading,
  };
};