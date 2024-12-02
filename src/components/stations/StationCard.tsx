import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import type { Station } from "@/hooks/useStations";
import { useLocation } from "@/contexts/LocationContext";
import { Navigation } from "lucide-react";

interface StationCardProps {
  station: Station;
  selectedFuel: string;
}

export const StationCard: React.FC<StationCardProps> = ({ station, selectedFuel }) => {
  const { location } = useLocation();

  // Get the price for the selected fuel type and ensure it's a number
  const price = Number(station.prices[selectedFuel as keyof typeof station.prices]) || 0;

  return (
    <Link to={`/stations/${station.id}`} className="block w-full">
      <Card className="p-4 hover:shadow-md transition-shadow w-full">
        <div className="flex gap-4 w-full">
          <img 
            src={station.image_url || 'https://cdn1.iconfinder.com/data/icons/prettyoffice8/256/Gas-pump.png'} 
            alt={station.name} 
            className="w-20 h-20 object-cover rounded-lg shrink-0"
          />
          <div className="flex-1 flex justify-between min-w-0">
            <div className="min-w-0 flex-1">
              <h3 className="font-medium text-lg truncate">{station.name}</h3>
              <p className="text-gray-500 text-sm line-clamp-2">{station.address}</p>
              {location && typeof station.calculatedDistance === 'number' && (
                <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
                  <Navigation className="w-4 h-4" />
                  <span>{station.calculatedDistance.toFixed(1)}km</span>
                </div>
              )}
            </div>
            <div className="text-right shrink-0">
              {price > 0 && (
                <div className="text-lg font-bold text-green-600">
                  R$ {price.toFixed(2)}
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};