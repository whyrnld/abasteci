import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";
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
    // Open in Google Maps
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(station.address)}`);
  };

  return (
    <Link to={`/stations/${station.id}`}>
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3">
          <MapPin className="w-5 h-5 text-primary" />
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{station.name}</p>
                <p className="text-sm text-gray-500">{station.address}</p>
                <p className="text-xs text-gray-400 mt-1">{station.lastUpdate}</p>
              </div>
              <div className="text-right">
                <div className="space-y-1">
                  <p className="text-primary font-medium">
                    Comum: R$ {station.prices.regular.toFixed(2)}
                  </p>
                  <p className="text-primary font-medium">
                    Aditivada: R$ {station.prices.premium.toFixed(2)}
                  </p>
                </div>
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