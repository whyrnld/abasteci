import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
  const handleCreateRoute = (e: React.MouseEvent) => {
    e.preventDefault();
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(station.address)}`);
  };

  const getLogo = (name: string) => {
    if (name.toLowerCase().includes('shell')) return '/logos/shell.png';
    if (name.toLowerCase().includes('ipiranga')) return '/logos/ipiranga.png';
    if (name.toLowerCase().includes('br')) return '/logos/petrobras.png';
    return '/logos/default.png';
  };

  return (
    <Link to={`/stations/${station.id}`}>
      <Card className="p-4 hover:shadow-md transition-shadow bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-center gap-4">
          <img 
            src={getLogo(station.name)} 
            alt={station.name} 
            className="w-12 h-12 object-contain"
          />
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{station.name}</p>
                <p className="text-sm text-gray-500">{station.address}</p>
                <p className="text-xs text-gray-400 mt-1">{station.lastUpdate}</p>
              </div>
              <div className="text-right">
                <p className="text-primary font-medium">
                  Comum: R$ {station.prices.regular.toFixed(2)} • Aditivada: R$ {station.prices.premium.toFixed(2)}
                </p>
                <p className="text-sm text-gray-500">{station.distance}</p>
              </div>
            </div>
            <Button 
              variant="secondary" 
              className="mt-3 w-full"
              onClick={handleCreateRoute}
            >
              Criar Rota
            </Button>
          </div>
        </div>
      </Card>
    </Link>
  );
};