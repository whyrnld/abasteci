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
}

export const useStations = () => {
  const { data: stations, isLoading } = useQuery({
    queryKey: ['stations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stations')
        .select('*, prices(*)');

      if (error) throw error;
      return data as Station[];
    },
  });

  return {
    stations,
    isLoading,
  };
};