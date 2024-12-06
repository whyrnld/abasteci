import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import type { Station } from "@/hooks/useStations";
import { useLocation } from "@/contexts/LocationContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

interface StationCardProps {
  station: Station;
  selectedFuel: string;
  className?: string;
}

export const StationCard: React.FC<StationCardProps> = ({ station, selectedFuel, className = "" }) => {
  const { location } = useLocation();

  const { data: brand } = useQuery({
    queryKey: ['brand', station.brand_id],
    queryFn: async () => {
      if (!station.brand_id) return null;
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .eq('id', station.brand_id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!station.brand_id
  });

  // Get the price for the selected fuel type and ensure it's a number
  const price = Number(station.prices[selectedFuel as keyof typeof station.prices]) || 0;

  return (
    <Link to={`/stations/${station.id}`} className={`block w-full ${className}`}>
      <Card className={`p-4 hover:shadow-md transition-shadow w-full ${className}`}>
        <div className="flex gap-4 w-full">
          <img 
            src={brand?.image_url || 'https://cdn1.iconfinder.com/data/icons/prettyoffice8/256/Gas-pump.png'} 
            alt={station.name} 
            className="w-20 h-20 object-cover rounded-lg shrink-0"
          />
          <div className="flex-1 flex justify-between min-w-0">
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-lg truncate">{station.name}</h3>
              <p className="text-gray-500 text-sm line-clamp-2">{station.address}</p>
            </div>
            <div className="text-right ml-4">
              {price > 0 && (
                <p className="font-medium text-lg">R$ {price.toFixed(2)}</p>
              )}
              {location && typeof station.calculatedDistance === 'number' && (
                <p className="text-sm text-gray-500">{station.calculatedDistance.toFixed(1)}km</p>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};