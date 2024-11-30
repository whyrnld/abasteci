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

  return useQuery({
    queryKey: ['stations', location?.lat, location?.lng],
    queryFn: async () => {
      // First, fetch all stations
      const { data: stations, error: stationsError } = await supabase
        .from('stations')
        .select('*');

      if (stationsError) {
        console.error('Error fetching stations:', stationsError);
        throw stationsError;
      }

      if (!stations || stations.length === 0) {
        console.log('No stations found in database');
        return [];
      }

      // Then, fetch the latest prices for each station
      const { data: prices, error: pricesError } = await supabase
        .from('prices')
        .select('*')
        .in('station_id', stations.map(s => s.id))
        .order('updated_at', { ascending: false });

      if (pricesError) {
        console.error('Error fetching prices:', pricesError);
        throw pricesError;
      }

      // Group prices by station_id and get the latest price for each station
      const latestPrices = prices.reduce((acc: Record<number, any>, price) => {
        if (!acc[price.station_id] || new Date(price.updated_at) > new Date(acc[price.station_id].updated_at)) {
          acc[price.station_id] = price;
        }
        return acc;
      }, {});

      // Map stations with their latest prices and calculate distances
      return stations.map((station: any) => {
        const stationPrices = latestPrices[station.id] || {
          regular: 0,
          premium: 0,
          ethanol: 0,
          diesel: 0,
          updated_at: new Date().toISOString()
        };

        let calculatedDistance;
        if (location) {
          calculatedDistance = calculateDistance(
            location.lat,
            location.lng,
            station.latitude,
            station.longitude
          );
        }

        return {
          ...station,
          prices: {
            regular: stationPrices.regular || 0,
            premium: stationPrices.premium || 0,
            ethanol: stationPrices.ethanol || 0,
            diesel: stationPrices.diesel || 0,
            updated_at: stationPrices.updated_at
          },
          lastUpdate: new Date(stationPrices.updated_at).toLocaleString(),
          calculatedDistance
        };
      });
    },
    enabled: true,
  });
};