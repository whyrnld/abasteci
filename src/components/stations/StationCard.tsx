import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import type { Station } from "@/hooks/useStations";

interface StationCardProps {
  station: Station;
  selectedFuel: string;
}

export const StationCard = ({ station, selectedFuel }: StationCardProps) => {
  return (
    <Link to={`/stations/${station.id}`}>
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="flex gap-3">
          <img 
            src={station.image_url || 'https://images.unsplash.com/photo-1483058712412-4245e9b90334'} 
            alt={station.name} 
            className="w-10 h-10 object-cover rounded-full"
          />
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <p className="font-medium">{station.name}</p>
              <p className="text-sm text-gray-500">{station.distance}</p>
            </div>
            <p className="text-sm text-gray-500 mt-1">{station.address}</p>
            <div className="flex justify-between items-center mt-2">
              <p className="text-primary font-medium">
                Comum: R$ {station.prices.regular.toFixed(2)}
              </p>
              <p className="text-primary font-medium">
                Aditivada: R$ {station.prices.premium.toFixed(2)}
              </p>
            </div>
            {station.cnpj && (
              <p className="text-xs text-gray-400 mt-1">CNPJ: {station.cnpj}</p>
            )}
            <p className="text-xs text-gray-400 mt-1">{station.lastUpdate}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
};