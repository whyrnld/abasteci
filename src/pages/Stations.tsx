import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Filter, ArrowLeft } from "lucide-react";
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
      latitude: -23.5629,
      longitude: -46.6544,
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
      latitude: -23.5589,
      longitude: -46.6535,
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
      latitude: -23.5647,
      longitude: -46.6698,
    },
  ];

  const station = stations.find(s => s.id === Number(id));

  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [nearestStation, setNearestStation] = useState<number | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  useEffect(() => {
    if (userLocation && stations) {
      const nearest = stations.reduce((prev, curr) => {
        const prevDistance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          prev.latitude,
          prev.longitude
        );
        const currDistance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          curr.latitude,
          curr.longitude
        );
        return prevDistance < currDistance ? prev : curr;
      });
      setNearestStation(nearest.id);
    }
  }, [userLocation, stations]);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  if (id && station) {
    return (
      <div className="flex flex-col gap-6 pb-20">
        <section className="bg-gradient-to-r from-primary to-secondary p-6 pt-8 -mx-6 -mt-6">
          <div className="flex items-center gap-2">
            <Link to="/stations">
              <Button variant="ghost" size="icon" className="text-white hover:text-white/80">
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </Link>
            <h1 className="text-white text-lg font-medium">{station.name}</h1>
          </div>
        </section>

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

        <PriceHistory stationId={station.id} selectedFuel={selectedFuel} />

        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-medium">Preços Atuais</h2>
            <p className="text-sm text-gray-500">Atualizado em {station.lastUpdate}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 border rounded-lg bg-white">
              <p className="text-sm text-gray-500">Comum</p>
              <p className="text-lg font-medium">R$ {station.prices.regular.toFixed(2)}</p>
            </div>
            <div className="p-4 border rounded-lg bg-white">
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

      <PriceStats stations={stations} selectedFuel={selectedFuel} />

      <div className="space-y-6">
        {stations.map((station) => (
          <div key={station.id} className={`${station.id === nearestStation ? 'ring-2 ring-primary' : ''}`}>
            <StationCard
              station={station}
              selectedFuel={selectedFuel}
            />
          </div>
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
