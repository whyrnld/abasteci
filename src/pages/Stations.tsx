import { useState } from "react";
import { Filter, ArrowLeft, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FiltersModal } from "@/components/stations/FiltersModal";
import { StationsList } from "@/components/stations/StationsList";
import { useStations } from "@/hooks/useStations";
import { useParams, Link, useNavigate } from "react-router-dom";

const Stations = () => {
  const [selectedFuel, setSelectedFuel] = useState("regular");
  const [sortBy, setSortBy] = useState("distance");
  const [maxDistance, setMaxDistance] = useState(10);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { stations, isLoading } = useStations();

  // Filter and sort stations
  const processedStations = stations?.filter(station => {
    const distance = typeof station.calculatedDistance === 'number' ? station.calculatedDistance : 0;
    return distance <= maxDistance;
  }).sort((a, b) => {
    if (sortBy === "distance") {
      const distanceA = typeof a.calculatedDistance === 'number' ? a.calculatedDistance : 0;
      const distanceB = typeof b.calculatedDistance === 'number' ? b.calculatedDistance : 0;
      return distanceA - distanceB;
    } else {
      // Sort by price
      const priceA = Number(a.prices[selectedFuel as keyof typeof a.prices]) || 0;
      const priceB = Number(b.prices[selectedFuel as keyof typeof b.prices]) || 0;
      return priceA - priceB;
    }
  });

  const calculateDrivingTime = (distanceKm: number) => {
    // Assuming average speed of 40km/h in city
    const timeInHours = distanceKm / 40;
    const timeInMinutes = Math.round(timeInHours * 60);
    return timeInMinutes;
  };

  // If we have an ID parameter, we should show the station details
  if (id && stations) {
    const station = stations.find(s => s.id === parseInt(id));
    if (station) {
      const drivingTimeMinutes = calculateDrivingTime(station.calculatedDistance || 0);
      const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${station.latitude},${station.longitude}`;

      return (
        <div className="flex flex-col min-h-screen bg-gray-50">
          {/* Header */}
          <div className="fixed top-0 left-0 right-0 bg-white shadow-sm z-10">
            <div className="flex items-center gap-3 p-4 max-w-md mx-auto">
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="text-lg font-semibold truncate">{station.name}</h1>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-col gap-4 p-4 mt-16 max-w-md mx-auto">
            <div className="flex gap-4 items-start">
              <img 
                src={station.image_url || 'https://images.unsplash.com/photo-1483058712412-4245e9b90334'} 
                alt={station.name} 
                className="w-20 h-20 object-cover rounded-lg"
              />
              <div>
                <p className="text-gray-600">{station.address}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {station.calculatedDistance?.toFixed(1)}km • {drivingTimeMinutes} min de carro
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-200 rounded-lg">
                <p className="text-sm text-gray-600">Comum</p>
                <p className="text-xl font-bold text-primary">R$ {station.prices.regular.toFixed(2)}</p>
              </div>
              <div className="p-4 bg-gray-200 rounded-lg">
                <p className="text-sm text-gray-600">Aditivada</p>
                <p className="text-xl font-bold text-primary">R$ {station.prices.premium.toFixed(2)}</p>
              </div>
              <div className="p-4 bg-gray-200 rounded-lg">
                <p className="text-sm text-gray-600">Etanol</p>
                <p className="text-xl font-bold text-primary">R$ {station.prices.ethanol.toFixed(2)}</p>
              </div>
              <div className="p-4 bg-gray-200 rounded-lg">
                <p className="text-sm text-gray-600">Diesel</p>
                <p className="text-xl font-bold text-primary">R$ {station.prices.diesel.toFixed(2)}</p>
              </div>
            </div>

            {station.cnpj && (
              <p className="text-xs text-gray-500">CNPJ: {station.cnpj}</p>
            )}
            <p className="text-xs text-gray-500">Última atualização: {station.lastUpdate}</p>

            {/* Google Maps Embed */}
            <div className="w-full h-48 rounded-lg overflow-hidden">
              <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={`https://www.google.com/maps/embed/v1/place?key=_3czri_x4JO1qGZ6LJCfO1-ZTHI=&q=${station.latitude},${station.longitude}`}
                allowFullScreen
              />
            </div>

            {/* Navigation Button */}
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
      <section className="bg-gradient-to-r from-primary to-secondary p-6 pt-8 -mx-6 -mt-6">
        <h1 className="text-white text-lg font-medium">Postos</h1>
      </section>

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

        <Button variant="outline" onClick={() => setIsFiltersOpen(true)} className="bg-white">
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <StationsList 
        stations={processedStations || []} 
        selectedFuel={selectedFuel}
        isLoading={isLoading}
      />

      <FiltersModal
        open={isFiltersOpen}
        onOpenChange={setIsFiltersOpen}
        sortBy={sortBy}
        setSortBy={setSortBy}
        maxDistance={maxDistance}
        setMaxDistance={setMaxDistance}
      />
    </div>
  );
};

export default Stations;
