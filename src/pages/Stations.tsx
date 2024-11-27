import { useState } from "react";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FiltersModal } from "@/components/stations/FiltersModal";
import { StationsList } from "@/components/stations/StationsList";
import { useStations } from "@/hooks/useStations";

const Stations = () => {
  const [selectedFuel, setSelectedFuel] = useState("regular");
  const [sortBy, setSortBy] = useState("price");
  const [maxDistance, setMaxDistance] = useState(10);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  const { stations, isLoading } = useStations();

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
        stations={stations || []} 
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