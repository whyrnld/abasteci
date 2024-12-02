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
  calculatedDistance: number; // Alterado de number | null para number
}

export const useStations = () => {
  const { location } = useLocation();

  return useQuery({
    queryKey: ['stations', location?.lat, location?.lng],
    queryFn: async () => {
      console.log('Fetching stations with location:', location);

      try {
        // Primeiro, busca todas as estações
        const { data: stations, error: stationsError } = await supabase
          .from('stations')
          .select('*');

        if (stationsError) {
          console.error('Error fetching stations:', stationsError);
          throw new Error(`Erro ao buscar postos: ${stationsError.message}`);
        }

        if (!stations || stations.length === 0) {
          console.log('No stations found in database');
          return [];
        }

        console.log(`Found ${stations.length} stations in database`);

        // Depois, busca os preços mais recentes
        const { data: prices, error: pricesError } = await supabase
          .from('prices')
          .select('*')
          .in('station_id', stations.map(s => s.id))
          .order('created_at', { ascending: false });

        if (pricesError) {
          console.error('Error fetching prices:', pricesError);
          // Não vamos lançar erro aqui, apenas logar e continuar com preços zerados
          console.log('Continuing with zero prices due to error');
        }

        // Mesmo sem preços, retornamos as estações
        const processedStations = stations.map(station => {
          // Converte as coordenadas para números e valida
          const latitude = Number(station.latitude);
          const longitude = Number(station.longitude);

          if (isNaN(latitude) || isNaN(longitude)) {
            console.warn('Invalid coordinates for station:', station);
            return null;
          }

          // Encontra o preço mais recente para esta estação
          const stationPrices = prices?.find(p => p.station_id === station.id) || {
            regular: 0,
            premium: 0,
            ethanol: 0,
            diesel: 0,
            created_at: new Date().toISOString()
          };

          // Calcula a distância se tivermos a localização do usuário
          let calculatedDistance: number = 0;
          if (location?.lat && location?.lng) {
            try {
              calculatedDistance = calculateDistance(
                location.lat,
                location.lng,
                latitude,
                longitude
              );
            } catch (error) {
              console.warn('Error calculating distance for station:', station.name, error);
            }
          }

          return {
            ...station,
            latitude,
            longitude,
            prices: {
              regular: Number(stationPrices.regular) || 0,
              premium: Number(stationPrices.premium) || 0,
              ethanol: Number(stationPrices.ethanol) || 0,
              diesel: Number(stationPrices.diesel) || 0,
              updated_at: stationPrices.created_at
            },
            calculatedDistance
          };
        }).filter(station => station !== null);

        console.log('Processed stations:', processedStations);
        return processedStations;

      } catch (error) {
        console.error('Unexpected error in useStations:', error);
        throw error;
      }
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
    staleTime: Infinity
  });
};