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
      const { data: stations, error: stationsError } = await supabase
        .from('stations')
        .select('*');

      if (stationsError) {
        console.error('Error fetching stations:', stationsError);
        throw stationsError;
      }

      // Log the stations data to debug
      console.log('Stations data:', stations);

      // Fetch prices for all stations
      const { data: prices, error: pricesError } = await supabase
        .from('prices')
        .select('*')
        .order('created_at', { ascending: false });

      if (pricesError) {
        console.error('Error fetching prices:', pricesError);
        throw pricesError;
      }

      // Log the prices data to debug
      console.log('Prices data:', prices);

      // Group prices by station_id and get the latest price for each station
      const latestPrices = prices.reduce((acc: Record<number, any>, price) => {
        if (!acc[price.station_id] || new Date(price.created_at) > new Date(acc[price.station_id].created_at)) {
          acc[price.station_id] = price;
        }
        return acc;
      }, {});

      // Map stations with their latest prices and calculate distances
      const processedStations = stations?.map((station: any) => {
        const stationPrices = latestPrices[station.id] || {
          regular: 0,
          premium: 0,
          ethanol: 0,
          diesel: 0,
          created_at: new Date().toISOString()
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
            updated_at: stationPrices.created_at
          },
          lastUpdate: new Date(stationPrices.created_at).toLocaleString(),
          calculatedDistance
        };
      }) || [];

      // Log the final processed stations to debug
      console.log('Processed stations:', processedStations);

      return processedStations;
    },
    enabled: !!location,
  });
};