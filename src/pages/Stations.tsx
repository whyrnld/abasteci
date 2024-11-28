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
  const { location } = useLocation();
  
  const { stations, isLoading } = useStations();

  // Filter and sort stations
  const processedStations = stations?.filter(station => {
    if (!location) return true;
    const distance = station.calculatedDistance || 0;
    return distance <= maxDistance;
  }).sort((a, b) => {
    if (sortBy === "distance") {
      const distanceA = a.calculatedDistance || 0;
      const distanceB = b.calculatedDistance || 0;
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
    const station = stations.find(s => s.id === parseInt(id));
    if (station) {
      const drivingTimeMinutes = calculateDrivingTime(station.calculatedDistance || 0);
      const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`;

      return (
        <div className="flex flex-col min-h-screen bg-gray-50">
          <section className="bg-gradient-to-r from-primary to-[#10B981] p-6">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-white">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-lg font-medium text-white truncate">{station.name}</h1>
            </div>
          </section>

          <div className="flex flex-col gap-4 p-4 pb-20">
            <div className="flex gap-4 items-start">
              <img 
                src={station.image_url || 'https://images.unsplash.com/photo-1483058712412-4245e9b90334'} 
                alt={station.name} 
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-1 text-gray-500 shrink-0" />
                  <p className="text-sm text-gray-600">{station.address}</p>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {station.calculatedDistance?.toFixed(1)}km • {drivingTimeMinutes} min de carro
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card className="p-4 bg-gradient-to-br from-green-50 to-white">
                <div className="flex items-center gap-2 mb-2">
                  <Fuel className="w-4 h-4 text-green-600" />
                  <p className="text-sm text-gray-600">Comum</p>
                </div>
                <p className="text-lg font-bold text-green-700">R$ {station.prices.regular.toFixed(2)}</p>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-blue-50 to-white">
                <div className="flex items-center gap-2 mb-2">
                  <Droplets className="w-4 h-4 text-blue-600" />
                  <p className="text-sm text-gray-600">Aditivada</p>
                </div>
                <p className="text-lg font-bold text-blue-700">R$ {station.prices.premium.toFixed(2)}</p>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-yellow-50 to-white">
                <div className="flex items-center gap-2 mb-2">
                  <Fuel className="w-4 h-4 text-yellow-600" />
                  <p className="text-sm text-gray-600">Etanol</p>
                </div>
                <p className="text-lg font-bold text-yellow-700">R$ {station.prices.ethanol.toFixed(2)}</p>
              </Card>
              <Card className="p-4 bg-gradient-to-br from-gray-50 to-white">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="w-4 h-4 text-gray-600" />
                  <p className="text-sm text-gray-600">Diesel</p>
                </div>
                <p className="text-lg font-bold text-gray-700">R$ {station.prices.diesel.toFixed(2)}</p>
              </Card>
            </div>

            {station.cnpj && (
              <p className="text-xs text-gray-500">CNPJ: {station.cnpj}</p>
            )}
            <p className="text-xs text-gray-500">Última atualização: {station.lastUpdate}</p>

            <div className="w-full h-48 rounded-lg overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyD-nDc6tXCTKcFJvWQmWEFuKVKT7w7B9Wo&q=${station.latitude},${station.longitude}`}
                allowFullScreen
              />
            </div>

            <a 
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2"
            >
              <Button className="w-full" size="lg">
                <Navigation className="mr-2 h-4 w-4" />
                Ir até o posto
              </Button>
            </a>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="flex flex-col gap-6 pb-20">
      <section className="bg-gradient-to-r from-primary to-[#10B981] p-6 -mx-6 -mt-6">
        <div className="flex flex-col gap-4">
          <h1 className="text-white text-lg font-medium">Postos</h1>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-white shrink-0" />
            <LocationSelector />
          </div>
        </div>
      </section>

      <div className="space-y-4">
        <div className="flex gap-2">
          <div className="flex-1">
            <Select value={selectedFuel} onValueChange={setSelectedFuel}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Tipo de combustível" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="regular">Gasolina</SelectItem>
                <SelectItem value="ethanol">Etanol</SelectItem>
                <SelectItem value="diesel">Diesel</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-4 bg-white p-4 rounded-lg">
          <div>
            <label className="text-sm text-gray-500 mb-2 block">Ordenar por</label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price">Preço</SelectItem>
                <SelectItem value="distance">Distância</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm text-gray-500 mb-2 block">
              Distância máxima: {maxDistance}km
            </label>
            <Slider
              value={[maxDistance]}
              onValueChange={([value]) => setMaxDistance(value)}
              max={100}
              step={1}
            />
          </div>
        </div>
      </div>

      <StationsList 
        stations={processedStations || []} 
        selectedFuel={selectedFuel}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Stations;