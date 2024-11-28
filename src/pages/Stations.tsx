import { useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FiltersModal } from "@/components/stations/FiltersModal";
import { StationsList } from "@/components/stations/StationsList";
import { useStations } from "@/hooks/useStations";
import { useParams } from "react-router-dom";

const Stations = () => {
  const [selectedFuel, setSelectedFuel] = useState("regular");
  const [sortBy, setSortBy] = useState("price");
  const [maxDistance, setMaxDistance] = useState(10);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const { id } = useParams();
  
  const { stations, isLoading } = useStations();

  // Filter stations based on maxDistance
  const filteredStations = stations?.filter(station => {
    if (!station.calculatedDistance) return true;
    return station.calculatedDistance <= maxDistance;
  });

  // If we have an ID parameter, we should show the station details
  if (id && stations) {
    const station = stations.find(s => s.id === parseInt(id));
    if (station) {
      return (
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">{station.name}</h1>
          <div className="space-y-4">
            <img 
              src={station.image_url || 'https://images.unsplash.com/photo-1483058712412-4245e9b90334'} 
              alt={station.name} 
              className="w-full h-48 object-cover rounded-lg"
            />
            <p className="text-gray-600">{station.address}</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Comum</p>
                <p className="text-xl font-bold text-primary">R$ {station.prices.regular.toFixed(2)}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Aditivada</p>
                <p className="text-xl font-bold text-primary">R$ {station.prices.premium.toFixed(2)}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Etanol</p>
                <p className="text-xl font-bold text-primary">R$ {station.prices.ethanol.toFixed(2)}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500">Diesel</p>
                <p className="text-xl font-bold text-primary">R$ {station.prices.diesel.toFixed(2)}</p>
              </div>
            </div>
            {station.cnpj && (
              <p className="text-sm text-gray-500">CNPJ: {station.cnpj}</p>
            )}
            <p className="text-sm text-gray-500">Última atualização: {station.lastUpdate}</p>
          </div>
        </div>
      );
    }
  }

  return (
    <div className="flex flex-col gap-6 pb-20">
      <section className="bg-gradient-to-r from-primary to-secondary p-6 pt-8 -mx-6 -mt-6">
        <h1 className="text-white text-lg font-medium">Postos Próximos</h1>
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
        stations={filteredStations || []} 
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