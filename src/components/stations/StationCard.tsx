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
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="flex gap-3">
          <img 
            src={getLogo(station.name)} 
            alt={station.name} 
            className="w-10 h-10 object-contain"
          />
          <div className="flex-1 space-y-2">
            <div>
              <div className="flex justify-between items-start">
                <p className="font-medium">{station.name}</p>
                <p className="text-sm text-gray-500">{station.distance}</p>
              </div>
              <p className="text-sm text-gray-500">{station.address}</p>
            </div>
            
            <p className="text-primary font-medium">
              Comum: R$ {station.prices.regular.toFixed(2)} • Aditivada: R$ {station.prices.premium.toFixed(2)}
            </p>
            
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-400">{station.lastUpdate}</p>
              <Button 
                variant="secondary" 
                size="sm"
                onClick={handleCreateRoute}
              >
                Criar Rota
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};