import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { Station } from './useStations';
import { useLocation } from '@/contexts/LocationContext';
import { calculateDistance } from '@/utils/distance';

export const useStation = (id: string | undefined) => {
  const { location } = useLocation();

  return useQuery({
    queryKey: ['station', id],
    queryFn: async () => {
      if (!id) return null;

      const { data, error } = await supabase
        .from('stations')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching station:', error);
        throw new Error(`Erro ao buscar posto: ${error.message}`);
      }

      if (!data) {
        throw new Error('Posto não encontrado');
      }

      // Garante que o objeto prices existe
      const station: Station = {
        ...data,
        prices: {
          regular: data.prices?.regular || 0,
          premium: data.prices?.premium || 0,
          ethanol: data.prices?.ethanol || 0,
          diesel: data.prices?.diesel || 0
        }
      };

      // Calcula a distância se tivermos a localização
      if (location) {
        station.calculatedDistance = calculateDistance(
          location.lat,
          location.lng,
          station.latitude,
          station.longitude
        );
      }

      return station;
    },
    enabled: !!id,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
    staleTime: Infinity
  });
};
