import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, MapPin, Bell } from "lucide-react";
import { formatCurrency, formatPhone } from "@/lib/utils";
import { PriceAlertDialog } from "./PriceAlertDialog";
import { PriceHistory } from "./PriceHistory";
import { Station } from "@/types";
import { StationHeader } from "./StationHeader";
import { StationInfo } from "./StationInfo";
import { StationActions } from "./StationActions";

interface StationDetailsProps {
  station: Station;
  onBack?: () => void;
}

const StationDetails = ({ station, onBack }: StationDetailsProps) => {
  const [showPriceAlert, setShowPriceAlert] = useState(false);

  const handleCall = () => {
    window.location.href = `tel:${station.phone}`;
  };

  const handleOpenMaps = () => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${station.latitude},${station.longitude}`,
      "_blank"
    );
  };

  return (
    <div className="flex-1 overflow-y-auto pb-20">
      <StationHeader name={station.name} onBack={onBack} />

      <div className="p-6">
        <StationInfo 
          address={station.address}
          updatedAt={station.prices?.updated_at || new Date().toISOString()}
          distance={station.calculatedDistance}
        />

        <StationActions stationId={station.id} stationName={station.name} />

        <Card className="p-4 mb-6">
          <h2 className="font-medium mb-3">Preços</h2>
          <div className="space-y-2">
            {station.prices?.regular > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm">Gasolina Comum</span>
                <Badge variant="outline">
                  {formatCurrency(station.prices.regular)}
                </Badge>
              </div>
            )}
            {station.prices?.premium > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm">Gasolina Aditivada</span>
                <Badge variant="outline">
                  {formatCurrency(station.prices.premium)}
                </Badge>
              </div>
            )}
            {station.prices?.ethanol > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm">Etanol</span>
                <Badge variant="outline">
                  {formatCurrency(station.prices.ethanol)}
                </Badge>
              </div>
            )}
            {station.prices?.diesel > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm">Diesel</span>
                <Badge variant="outline">
                  {formatCurrency(station.prices.diesel)}
                </Badge>
              </div>
            )}
          </div>
          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={() => setShowPriceAlert(true)}
          >
            <Bell className="w-4 h-4 mr-2" />
            Criar alerta de preço
          </Button>
        </Card>

        <PriceHistory stationId={station.id} selectedFuel="regular" />

        <div className="mt-6">
          <img
            src={`https://maps.googleapis.com/maps/api/staticmap?center=${station.latitude},${station.longitude}&zoom=15&size=600x300&maptype=roadmap&markers=color:red%7C${station.latitude},${station.longitude}&key=AIzaSyD-nDc6tXCTKcFJvWQmWEFuKVKT7w7B9Wo`}
            alt="Station Location"
            className="w-full h-[200px] object-cover rounded-lg mb-4"
          />
          
          <div className="grid grid-cols-2 gap-4">
            {station.phone && (
              <Button
                variant="outline"
                className="w-full"
                onClick={handleCall}
              >
                <Phone className="h-4 w-4 mr-2" />
                {formatPhone(station.phone)}
              </Button>
            )}
            <Button
              variant="outline"
              className="w-full"
              onClick={handleOpenMaps}
            >
              <MapPin className="h-4 w-4 mr-2" />
              Ver no mapa
            </Button>
          </div>
        </div>
      </div>

      <PriceAlertDialog
        open={showPriceAlert}
        onOpenChange={setShowPriceAlert}
        stationId={station.id}
        prices={station.prices || { regular: 0, premium: 0, ethanol: 0, diesel: 0 }}
      />
    </div>
  );
};

export default StationDetails;