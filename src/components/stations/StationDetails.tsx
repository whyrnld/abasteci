import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Share2, Heart, MapPin, Phone, ArrowLeft, Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useFavoriteStations } from "@/hooks/useFavoriteStations";
import { useNavigate } from "react-router-dom";
import { formatCurrency, formatPhone } from "@/lib/utils";
import { PriceAlertDialog } from "./PriceAlertDialog";
import { Station } from "@/types";
import { format } from "date-fns";
import { PriceHistory } from "./PriceHistory";

interface StationDetailsProps {
  station: Station;
  onBack?: () => void;
}

const StationDetails = ({ station, onBack }: StationDetailsProps) => {
  const [showPriceAlert, setShowPriceAlert] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { favorites, toggleFavorite } = useFavoriteStations();
  const isFavorite = favorites?.some((f) => f.station_id === station.id);

  const handleShare = async () => {
    try {
      await navigator.share({
        title: station.name,
        text: `Confira os preços em ${station.name}`,
        url: window.location.href,
      });
    } catch (err) {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copiado!",
        description: "Compartilhe com seus amigos.",
      });
    }
  };

  const handleFavorite = async () => {
    await toggleFavorite(station.id);
    toast({
      title: isFavorite ? "Removido dos favoritos" : "Adicionado aos favoritos",
      description: isFavorite
        ? "O posto foi removido dos seus favoritos"
        : "O posto foi adicionado aos seus favoritos",
    });
  };

  const handleCall = () => {
    window.location.href = `tel:${station.phone}`;
  };

  const handleOpenMaps = () => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${station.latitude},${station.longitude}`,
      "_blank"
    );
  };

  const estimatedTime = station.calculatedDistance 
    ? Math.round(station.calculatedDistance * 2) // Rough estimate: 2 minutes per km
    : null;

  return (
    <div className="flex-1 overflow-y-auto pb-20">
      <div className="bg-gradient-to-r from-primary to-secondary p-4">
        <Button
          variant="ghost"
          className="text-white mb-2"
          onClick={() => (onBack ? onBack() : navigate(-1))}
        >
          <ArrowLeft className="h-6 w-6 mr-2" />
          Voltar
        </Button>
        <h1 className="text-xl font-semibold text-white">{station.name}</h1>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <p className="text-sm text-gray-500 mb-2">{station.address}</p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>Atualizado em {format(new Date(station.prices?.updated_at || new Date()), "dd/MM/yyyy HH:mm")}</span>
            </div>
          </div>
          {station.calculatedDistance && (
            <div className="text-right">
              <p className="text-sm font-medium">{station.calculatedDistance.toFixed(1)} km</p>
              {estimatedTime && (
                <p className="text-xs text-gray-500">~{estimatedTime} min</p>
              )}
            </div>
          )}
        </div>

        <div className="flex gap-2 mb-6">
          <Button variant="outline" size="icon" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleFavorite}
            className={isFavorite ? "text-red-500" : ""}
          >
            <Heart className="h-4 w-4" fill={isFavorite ? "currentColor" : "none"} />
          </Button>
        </div>

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
        station={station}
      />
    </div>
  );
};

export default StationDetails;