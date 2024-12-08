import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import PriceHistory from "./PriceHistory";
import PriceStats from "./PriceStats";
import PriceAlertDialog from "./PriceAlertDialog";
import FavoriteButton from "./FavoriteButton";

interface StationDetailsProps {
  station: {
    id: number;
    name: string;
    address: string;
    prices: {
      regular: number;
      premium: number;
      ethanol: number;
      diesel: number;
    };
    calculatedDistance?: number | null;
  };
}

const StationDetails = ({ station }: StationDetailsProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6">
      <section className="bg-gradient-to-r from-primary to-secondary p-6 -mx-6 -mt-6">
        <div className="flex items-center justify-between mb-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(-1)}
            className="text-white hover:text-white/80"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <FavoriteButton stationId={station.id} />
        </div>
        
        <div className="text-white">
          <h1 className="text-xl font-semibold mb-2">{station.name}</h1>
          <div className="flex items-center text-white/90">
            <MapPin className="w-4 h-4 mr-1" />
            <p className="text-sm">{station.address}</p>
          </div>
          {station.calculatedDistance && (
            <p className="text-sm text-white/80 mt-1">
              {station.calculatedDistance.toFixed(1)}km de distância
            </p>
          )}
        </div>
      </section>

      <PriceAlertDialog
        stationId={station.id}
        stationName={station.name}
        currentPrices={station.prices}
      />

      <Card className="p-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Gasolina Comum</p>
            <p className="text-xl font-semibold">{formatCurrency(station.prices.regular)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Gasolina Aditivada</p>
            <p className="text-xl font-semibold">{formatCurrency(station.prices.premium)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Etanol</p>
            <p className="text-xl font-semibold">{formatCurrency(station.prices.ethanol)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Diesel</p>
            <p className="text-xl font-semibold">{formatCurrency(station.prices.diesel)}</p>
          </div>
        </div>
      </Card>

      <PriceHistory stationId={station.id} />
      <PriceStats stationId={station.id} />
    </div>
  );
};

export default StationDetails;