import { useState } from "react";
import { Filter, ArrowLeft, Navigation, MapPin, Droplets, Fuel, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StationsList } from "@/components/stations/StationsList";
import { LocationSelector } from "@/components/LocationSelector";
import { useStations } from "@/hooks/useStations";
import { useLocation } from "@/contexts/LocationContext";
import { useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

const Stations = () => {
  const [selectedFuel, setSelectedFuel] = useState("regular");
  const [sortBy, setSortBy] = useState("distance");
  const [maxDistance, setMaxDistance] = useState(10);
  const { id } = useParams();
  const navigate = useNavigate();
  const { location, isLoading: locationLoading, getCurrentLocation } = useLocation();
  
  const { data: stations, isLoading: stationsLoading } = useStations();

  // Filter and sort stations
  const processedStations = stations?.filter(station => {
    if (!location) return true;
    const distance = station.calculatedDistance;
    return typeof distance === 'number' && distance <= maxDistance;
  }).sort((a, b) => {
    if (sortBy === "distance" && location) {
      const distanceA = a.calculatedDistance ?? Number.MAX_VALUE;
      const distanceB = b.calculatedDistance ?? Number.MAX_VALUE;
      return distanceA - distanceB;
    } else {
      const priceA = Number(a.prices[selectedFuel as keyof typeof a.prices]) || 0;
      const priceB = Number(b.prices[selectedFuel as keyof typeof b.prices]) || 0;
      return priceA - priceB;
    }
  });

  const calculateDrivingTime = (distanceKm: number) => {
    const timeInHours = distanceKm / 40;
    const timeInMinutes = Math.round(timeInHours * 60);
    return timeInMinutes;
  };

  // If we have an ID parameter, show the station details
  if (id && stations) {
    const singleStation = stations.find(s => s.id.toString() === id);
    if (!singleStation) return null;

    const drivingTimeMinutes = calculateDrivingTime(singleStation.calculatedDistance || 0);
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${singleStation.latitude},${singleStation.longitude}`;

    return (
      <div className="flex flex-col min-h-screen bg-gray-50 w-full max-w-full">
        <section className="w-full bg-gradient-to-r from-primary to-[#10B981] p-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-white">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-medium text-white">{singleStation.name}</h1>
          </div>
        </section>

        <div className="flex flex-col gap-4 p-4 pb-20 w-full">
          <div className="flex gap-4 items-start">
            <img 
              src={singleStation.image_url || 'https://cdn1.iconfinder.com/data/icons/prettyoffice8/256/Gas-pump.png'} 
              alt={singleStation.name} 
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h2 className="font-medium text-lg">{singleStation.name}</h2>
              <p className="text-gray-500 text-sm">{singleStation.address}</p>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500 border-t border-b border-gray-200 py-2">
            {location && typeof singleStation.calculatedDistance === 'number' && (
              <div className="flex items-center gap-1">
                <Navigation className="w-4 h-4" />
                <span>{singleStation.calculatedDistance.toFixed(1)}km ({drivingTimeMinutes} min)</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <span>Atualizado: {new Date(singleStation.prices.updated_at).toLocaleDateString()} às {new Date(singleStation.prices.updated_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <Droplets className="w-5 h-5" />
                <span className="font-medium">Comum</span>
              </div>
              <div className="text-2xl font-bold text-blue-700">
                R$ {singleStation.prices.regular.toFixed(2)}
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100">
              <div className="flex items-center gap-2 text-purple-600 mb-2">
                <Fuel className="w-5 h-5" />
                <span className="font-medium">Aditivada</span>
              </div>
              <div className="text-2xl font-bold text-purple-700">
                R$ {singleStation.prices.premium.toFixed(2)}
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100">
              <div className="flex items-center gap-2 text-green-600 mb-2">
                <Droplets className="w-5 h-5" />
                <span className="font-medium">Etanol</span>
              </div>
              <div className="text-2xl font-bold text-green-700">
                R$ {singleStation.prices.ethanol.toFixed(2)}
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-amber-50 to-amber-100">
              <div className="flex items-center gap-2 text-amber-600 mb-2">
                <Truck className="w-5 h-5" />
                <span className="font-medium">Diesel</span>
              </div>
              <div className="text-2xl font-bold text-amber-700">
                R$ {singleStation.prices.diesel.toFixed(2)}
              </div>
            </Card>
          </div>
          
<div className="w-full h-48 rounded-lg overflow-hidden mt-4 ">
            <img
              src={`https://maps.googleapis.com/maps/api/staticmap?center=${singleStation.latitude},${singleStation.longitude}&zoom=15&size=800x400&markers=color:red%7C${singleStation.latitude},${singleStation.longitude}&key=AIzaSyD-nDc6tXCTKcFJvWQmWEFuKVKT7w7B9Wo`}
              alt="Localização do posto"
              className="w-full h-full object-cover"
            />
          </div>
          <Button 
            onClick={() => window.open(mapsUrl, '_blank')}
          >
            <Navigation className="w-4 h-4 mr-2" />
            Navegar até o posto
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 w-full max-w-full">
      <section className="w-full bg-gradient-to-r from-primary to-[#10B981] p-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-white">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-bold text-white">Postos de Combustível</h1>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-white shrink-0" />
            <LocationSelector />
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-4 p-4 pb-20 w-full">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <span className="text-sm font-medium text-gray-700">Combustível</span>
            <Select value={selectedFuel} onValueChange={setSelectedFuel}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de combustível" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="regular">Comum</SelectItem>
                <SelectItem value="premium">Aditivada</SelectItem>
                <SelectItem value="ethanol">Etanol</SelectItem>
                <SelectItem value="diesel">Diesel</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <span className="text-sm font-medium text-gray-700">Ordem</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="distance">Distância</SelectItem>
                <SelectItem value="price">Preço</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {location && (
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Distância máxima</span>
              <span className="text-sm font-medium">{maxDistance}km</span>
            </div>
            <Slider
              value={[maxDistance]}
              onValueChange={([value]) => setMaxDistance(value)}
              max={100}
              step={2}
              className="w-full"
            />
          </div>
        )}
        
        {!location && (
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={getCurrentLocation}
            disabled={locationLoading}
          >
            <MapPin className="w-4 h-4 mr-2" />
            {locationLoading ? "Obtendo localização..." : "Usar minha localização"}
          </Button>
        )}

        {stationsLoading ? (
          <div className="text-center py-4">Carregando postos...</div>
        ) : processedStations && processedStations.length > 0 ? (
          <StationsList stations={processedStations} selectedFuel={selectedFuel} />
        ) : (
          <div className="text-center py-4">Nenhum posto encontrado</div>
        )}
      </div>
    </div>
  );
};

export default Stations;
