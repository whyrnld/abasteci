import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";

interface StationCardProps {
  station: {
    id: number;
    name: string;
    distance: string;
    address: string;
    prices: {
      regular: number;
      premium: number;
      ethanol: number;
      diesel: number;
    };
    lastUpdate: string;
  };
  selectedFuel: string;
}

export const StationCard = ({ station, selectedFuel }: StationCardProps) => {
  const getLogo = (name: string) => {
    const baseUrl = "https://images.unsplash.com/";
    if (name.toLowerCase().includes('shell')) return `${baseUrl}photo-1487058792275-0ad4aaf24ca7`;
    if (name.toLowerCase().includes('ipiranga')) return `${baseUrl}photo-1485827404703-89b55fcc595e`;
    if (name.toLowerCase().includes('br')) return `${baseUrl}photo-1486312338219-ce68d2c6f44d`;
    return `${baseUrl}photo-1483058712412-4245e9b90334`;
  };

  return (
    <Link to={`/stations/${station.id}`}>
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="flex gap-3">
          <img 
            src={getLogo(station.name)} 
            alt={station.name} 
            className="w-10 h-10 object-cover rounded-full"
          />
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <p className="font-medium">{station.name}</p>
              <p className="text-sm text-gray-500">{station.distance}</p>
            </div>
            <p className="text-sm text-gray-500 mt-1">{station.address}</p>
            <p className="text-primary font-medium mt-2">
              Comum: R$ {station.prices.regular.toFixed(2)} • Aditivada: R$ {station.prices.premium.toFixed(2)}
            </p>
            <p className="text-xs text-gray-400 mt-2">{station.lastUpdate}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
};