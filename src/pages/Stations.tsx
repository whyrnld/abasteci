import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StationCard } from "@/components/stations/StationCard";
import { FiltersModal } from "@/components/stations/FiltersModal";
import { PriceStats } from "@/components/stations/PriceStats";
import { PriceHistory } from "@/components/stations/PriceHistory";

const Stations = () => {
  const { id } = useParams();
  const [selectedFuel, setSelectedFuel] = useState("regular");
  const [sortBy, setSortBy] = useState("price");
  const [maxDistance, setMaxDistance] = useState(10);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const stations = [
    {
      id: 1,
      name: "Posto Shell",
      distance: "1.2km",
      address: "Av. Paulista, 1000",
      prices: {
        regular: 5.49,
        premium: 6.29,
        ethanol: 3.99,
        diesel: 6.29,
      },
      lastUpdate: "Há 2 horas",
    },
    {
      id: 2,
      name: "Posto Ipiranga",
      distance: "1.8km",
      address: "Rua Augusta, 500",
      prices: {
        regular: 5.39,
        premium: 6.19,
        ethanol: 3.89,
        diesel: 6.19,
      },
      lastUpdate: "Há 3 horas",
    },
    {
      id: 3,
      name: "Posto BR",
      distance: "2.1km",
      address: "Av. Rebouças, 800",
      prices: {
        regular: 5.45,
        premium: 6.25,
        ethanol: 3.95,
        diesel: 6.25,
      },
      lastUpdate: "Há 4 horas",
    },
  ];

  const station = stations.find(s => s.id === Number(id));

  if (id && station) {
    return (
      <div className="flex flex-col gap-6 pb-20">
        <section className="bg-primary p-6 -mx-6 -mt-6">
          <Link to="/stations">
            <Button variant="ghost" className="text-white hover:text-white/80 p-2">
              ←
            </Button>
          </Link>
          <h1 className="text-white text-lg font-medium mt-2">{station.name}</h1>
        </section>

        <Select value={selectedFuel} onValueChange={setSelectedFuel}>
          <SelectTrigger>
            <SelectValue placeholder="Tipo de combustível" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="regular">Gasolina</SelectItem>
            <SelectItem value="ethanol">Etanol</SelectItem>
            <SelectItem value="diesel">Diesel</SelectItem>
          </SelectContent>
        </Select>

        <PriceHistory stationId={station.id} selectedFuel={selectedFuel} />

        <div className="space-y-4">
          <h2 className="text-lg font-medium">Preços Atuais</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-gray-500">Comum</p>
              <p className="text-lg font-medium">R$ {station.prices.regular.toFixed(2)}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <p className="text-sm text-gray-500">Aditivada</p>
              <p className="text-lg font-medium">R$ {station.prices.premium.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-20">
      <section className="bg-primary p-6 -mx-6 -mt-6">
        <h1 className="text-white text-lg font-medium">Postos Próximos</h1>
      </section>

      <div className="flex gap-2">
        <Select value={selectedFuel} onValueChange={setSelectedFuel} className="flex-1">
          <SelectTrigger>
            <SelectValue placeholder="Tipo de combustível" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="regular">Gasolina</SelectItem>
            <SelectItem value="ethanol">Etanol</SelectItem>
            <SelectItem value="diesel">Diesel</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={() => setIsFiltersOpen(true)}>
          <Filter className="h-4 w-4" />
        </Button>
      </div>

      <PriceStats stations={stations} selectedFuel={selectedFuel} />

      <div className="space-y-3">
        {stations.map((station) => (
          <StationCard
            key={station.id}
            station={station}
            selectedFuel={selectedFuel}
          />
        ))}
      </div>

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
