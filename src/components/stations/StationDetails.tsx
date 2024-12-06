import { Navigation, Droplets, Fuel, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import type { Station } from "@/hooks/useStations";

interface StationDetailsProps {
  station: Station;
  onBack: () => void;
}

export const StationDetails = ({ station, onBack }: StationDetailsProps) => {
  const { data: brand } = useQuery({
    queryKey: ['brand', station.brand_id],
    queryFn: async () => {
      if (!station.brand_id) return null;
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .eq('id', station.brand_id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!station.brand_id
  });

  const calculateDrivingTime = (distanceKm: number) => {
    const timeInHours = distanceKm / 40;
    return Math.round(timeInHours * 60);
  };

  const drivingTimeMinutes = calculateDrivingTime(station.calculatedDistance || 0);
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`;

  return (
    <>
      <section className="w-full bg-gradient-to-r from-primary to-[#10B981] p-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="text-white">
            <Navigation className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-medium text-white">{station.name}</h1>
        </div>
      </section>

      <div className="flex flex-col gap-4 p-4 pb-20 w-full">
        <div className="flex gap-4 items-start">
          <img 
            src={brand?.image_url || 'https://cdn1.iconfinder.com/data/icons/prettyoffice8/256/Gas-pump.png'} 
            alt={station.name} 
            className="w-20 h-20 object-cover rounded-lg"
          />
          <div className="flex-1">
            <h2 className="font-medium text-lg">{station.name}</h2>
            <p className="text-gray-500 text-sm">{station.address}</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500 border-t border-b border-gray-200 py-2">
          {typeof station.calculatedDistance === 'number' && (
            <div className="flex items-center gap-1">
              <Navigation className="w-4 h-4" />
              <span>{station.calculatedDistance.toFixed(1)}km ({drivingTimeMinutes} min)</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <span>Atualizado: {new Date(station.prices.updated_at).toLocaleDateString()} às {new Date(station.prices.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100">
            <div className="flex items-center gap-2 text-blue-600 mb-2">
              <Droplets className="w-5 h-5" />
              <span className="font-medium">Comum</span>
            </div>
            <div className="text-2xl font-bold text-blue-700">
              R$ {station.prices.regular.toFixed(2)}
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100">
            <div className="flex items-center gap-2 text-purple-600 mb-2">
              <Fuel className="w-5 h-5" />
              <span className="font-medium">Aditivada</span>
            </div>
            <div className="text-2xl font-bold text-purple-700">
              R$ {station.prices.premium.toFixed(2)}
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100">
            <div className="flex items-center gap-2 text-green-600 mb-2">
              <Droplets className="w-5 h-5" />
              <span className="font-medium">Etanol</span>
            </div>
            <div className="text-2xl font-bold text-green-700">
              R$ {station.prices.ethanol.toFixed(2)}
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-amber-50 to-amber-100">
            <div className="flex items-center gap-2 text-amber-600 mb-2">
              <Truck className="w-5 h-5" />
              <span className="font-medium">Diesel</span>
            </div>
            <div className="text-2xl font-bold text-amber-700">
              R$ {station.prices.diesel.toFixed(2)}
            </div>
          </Card>
        </div>
        
        <div className="w-full h-48 rounded-lg overflow-hidden mt-4">
          <img
            src={`https://maps.googleapis.com/maps/api/staticmap?center=${station.latitude},${station.longitude}&zoom=15&size=800x400&markers=color:red%7C${station.latitude},${station.longitude}&key=AIzaSyD-nDc6tXCTKcFJvWQmWEFuKVKT7w7B9Wo`}
            alt="Localização do posto"
            className="w-full h-full object-cover"
          />
        </div>
        <Button 
          onClick={() => window.open(mapsUrl, '_blank')}
        >
          <Navigation className="w-4 h-4 mr-2" />
          Traçar rota até o posto
        </Button>
      </div>
    </>
  );
};