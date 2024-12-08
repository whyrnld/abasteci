import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, Map, ArrowRight, Droplet, Fuel, Zap, Truck } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { PriceAlertDialog } from "./PriceAlertDialog";
import { FavoriteButton } from "./FavoriteButton";
import { format } from "date-fns";
import { PriceHistory } from "./PriceHistory";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    image_url?: string;
    updated_at?: string;
  };
  onBack?: () => void;
}

export const StationDetails = ({ station, onBack }: StationDetailsProps) => {
  const navigate = useNavigate();
  const [selectedFuel, setSelectedFuel] = useState("regular");

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const estimatedTime = station.calculatedDistance ? Math.round(station.calculatedDistance * 2) : null; // Rough estimate: 30km/h average speed

  const openGoogleMaps = () => {
    if (station.calculatedDistance) {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${station.address}`, '_blank');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <section className="bg-gradient-to-r from-primary to-secondary p-6 -mx-6 -mt-6">
        <div className="flex items-center justify-between mb-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleBack}
            className="text-white hover:text-white/80"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <FavoriteButton stationId={station.id} />
        </div>
        
        <h1 className="text-xl font-semibold text-white mb-2">{station.name}</h1>
      </section>

      <div className="px-6">
        <div className="flex items-start gap-4 mb-6">
          {station.image_url && (
            <img 
              src={station.image_url} 
              alt={station.name} 
              className="w-16 h-16 rounded-lg object-cover"
            />
          )}
          <div className="flex-1">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-1 text-gray-500 shrink-0" />
              <p className="text-sm text-gray-700">{station.address}</p>
            </div>
            {station.calculatedDistance && (
              <div className="flex items-center gap-2 mt-2">
                <p className="text-sm text-gray-500">
                  {station.calculatedDistance.toFixed(1)}km de distância
                  {estimatedTime && ` • ${estimatedTime} min`}
                </p>
              </div>
            )}
            {station.updated_at && (
              <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                <span>Atualizado em {format(new Date(station.updated_at), 'dd/MM/yyyy HH:mm')}</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="p-4 bg-blue-50">
            <div className="flex items-center gap-2 mb-2">
              <Droplet className="w-5 h-5 text-blue-600" />
              <span className="text-sm text-gray-600">Gasolina Comum</span>
            </div>
            <p className="text-xl font-semibold">{formatCurrency(station.prices.regular)}</p>
          </Card>

          <Card className="p-4 bg-purple-50">
            <div className="flex items-center gap-2 mb-2">
              <Fuel className="w-5 h-5 text-purple-600" />
              <span className="text-sm text-gray-600">Gasolina Aditivada</span>
            </div>
            <p className="text-xl font-semibold">{formatCurrency(station.prices.premium)}</p>
          </Card>

          <Card className="p-4 bg-green-50">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-5 h-5 text-green-600" />
              <span className="text-sm text-gray-600">Etanol</span>
            </div>
            <p className="text-xl font-semibold">{formatCurrency(station.prices.ethanol)}</p>
          </Card>

          <Card className="p-4 bg-orange-50">
            <div className="flex items-center gap-2 mb-2">
              <Truck className="w-5 h-5 text-orange-600" />
              <span className="text-sm text-gray-600">Diesel</span>
            </div>
            <p className="text-xl font-semibold">{formatCurrency(station.prices.diesel)}</p>
          </Card>
        </div>

        <PriceAlertDialog
          stationId={station.id}
          stationName={station.name}
          currentPrices={station.prices}
        />

        <div className="mt-6">
          <iframe
            title="Station Map"
            width="100%"
            height="200"
            frameBorder="0"
            style={{ pointerEvents: "none" }}
            src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyD-nDc6tXCTKcFJvWQmWEFuKVKT7w7B9Wo&q=${encodeURIComponent(station.address)}&zoom=15&maptype=roadmap&disableDefaultUI=true`}
            allowFullScreen
            className="rounded-lg mb-4"
          />

          <Button 
            variant="outline" 
            className="w-full mb-6" 
            onClick={openGoogleMaps}
            disabled={!station.calculatedDistance}
          >
            <Map className="w-4 h-4 mr-2" />
            <span>Traçar rota até o posto</span>
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Histórico de preços</h3>
              <Select value={selectedFuel} onValueChange={setSelectedFuel}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tipo de combustível" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">Gasolina Comum</SelectItem>
                  <SelectItem value="premium">Gasolina Aditivada</SelectItem>
                  <SelectItem value="ethanol">Etanol</SelectItem>
                  <SelectItem value="diesel">Diesel</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <PriceHistory stationId={station.id} selectedFuel={selectedFuel} />
          </div>
        </div>
      </div>
    </div>
  );
};