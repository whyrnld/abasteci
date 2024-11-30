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
      const { data: stationsData, error: stationsError } = await supabase
        .from('stations')
        .select('*');

      if (stationsError) throw stationsError;

      const { data: pricesData, error: pricesError } = await supabase
        .from('prices')
        .select('*')
        .order('updated_at', { ascending: false });

      if (pricesError) throw pricesError;

      // Group prices by station_id and get the latest price for each station
      const latestPrices = pricesData.reduce((acc: any, price) => {
        if (!acc[price.station_id] || new Date(price.updated_at) > new Date(acc[price.station_id].updated_at)) {
          acc[price.station_id] = price;
        }
        return acc;
      }, {});

      return stationsData.map((station: any) => {
        const stationPrices = latestPrices[station.id] || {
          regular: 0,
          premium: 0,
          ethanol: 0,
          diesel: 0,
          updated_at: new Date().toISOString()
        };

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
            regular: stationPrices.regular,
            premium: stationPrices.premium,
            ethanol: stationPrices.ethanol,
            diesel: stationPrices.diesel,
          },
          lastUpdate: new Date(stationPrices.updated_at).toLocaleString(),
          calculatedDistance,
        };
      }) as Station[];
    },
    enabled: true,
  });
};