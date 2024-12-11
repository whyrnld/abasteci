import { useState, useEffect } from "react";
import { Filter, ArrowLeft, Navigation, MapPin, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StationsList } from "@/components/stations/StationsList";
import { LocationSelector } from "@/components/LocationSelector";
import { useStations } from "@/hooks/useStations";
import { useLocation } from "@/contexts/LocationContext";
import { useParams, useNavigate } from "react-router-dom";
import { Slider } from "@/components/ui/slider";
import StationDetails from "@/components/stations/StationDetails";
import { useProfile } from "@/hooks/useProfile";

const Stations = () => {
  const { profile } = useProfile();
  const [selectedFuel, setSelectedFuel] = useState("regular");
  const [sortBy, setSortBy] = useState("distance");
  const [maxDistance, setMaxDistance] = useState(profile?.search_radius || 10);
  const { id } = useParams();
  const navigate = useNavigate();
  const { location, isLoading: locationLoading, getCurrentLocation } = useLocation();
  
  const { data: stations, isLoading: stationsLoading } = useStations();

  // Update maxDistance when profile loads
  useEffect(() => {
    if (profile?.search_radius) {
      setMaxDistance(profile.search_radius);
    }
  }, [profile]);

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

  // If we have an ID parameter, show the station details
  if (id && stations) {
    const singleStation = stations.find(s => s.id.toString() === id);
    if (!singleStation) return null;

    return (
      <div className="flex flex-col min-h-screen bg-gray-50 w-full max-w-full">
        <StationDetails 
          station={singleStation}
          onBack={() => navigate(-1)}
        />
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
        <Button
          variant="outline"
          className="w-full"
          onClick={() => navigate("/price-alerts")}
        >
          <Bell className="w-4 h-4 mr-2" />
          Ver Meus Alertas
        </Button>

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