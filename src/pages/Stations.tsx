import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowLeft, Filter } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

const Stations = () => {
  const { id } = useParams();
  const isDetailView = !!id;
  const [selectedFuel, setSelectedFuel] = useState("regular");
  const [sortBy, setSortBy] = useState("price");
  const [maxDistance, setMaxDistance] = useState(10);

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

  if (isDetailView && station) {
    return (
      <div className="flex flex-col gap-6 pb-20">
        <section className="bg-primary p-6 -mx-6 -mt-6">
          <div className="flex items-center gap-2 text-white mb-4">
            <Link to="/">
              <Button variant="ghost" className="text-white hover:text-white/80 p-2">
                <ArrowLeft className="h-6 w-6" />
              </Button>
            </Link>
            <h1 className="text-lg font-medium">{station.name}</h1>
          </div>
          <Card className="p-4">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="font-medium">{station.address}</p>
                  <p className="text-sm text-gray-500">{station.distance}</p>
                  <p className="text-xs text-gray-400 mt-1">Última atualização: {station.lastUpdate}</p>
                </div>
              </div>
            </div>
          </Card>
        </section>

        <section>
          <h2 className="text-lg font-medium mb-4">Preços Atuais</h2>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(station.prices).map(([type, price]) => (
              <Card key={type} className="p-4">
                <p className="text-sm text-gray-500 capitalize">{type}</p>
                <p className="text-lg font-medium">R$ {price.toFixed(2)}</p>
              </Card>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 pb-20">
      <section className="bg-primary p-6 -mx-6 -mt-6">
        <h1 className="text-white text-lg font-medium mb-2">Postos Próximos</h1>
      </section>

      <div className="flex gap-2 mt-4">
        <Select value={selectedFuel} onValueChange={setSelectedFuel}>
          <SelectTrigger className="bg-white">
            <SelectValue placeholder="Tipo de combustível" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="regular">Gasolina Comum</SelectItem>
            <SelectItem value="premium">Gasolina Premium</SelectItem>
            <SelectItem value="ethanol">Etanol</SelectItem>
            <SelectItem value="diesel">Diesel</SelectItem>
          </SelectContent>
        </Select>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="bg-white">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filtros</SheetTitle>
            </SheetHeader>
            <div className="space-y-6 mt-6">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Ordenar por
                </label>
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
                <label className="text-sm font-medium mb-2 block">
                  Distância máxima: {maxDistance}km
                </label>
                <Slider
                  value={[maxDistance]}
                  onValueChange={([value]) => setMaxDistance(value)}
                  max={20}
                  step={1}
                />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="space-y-3">
        {stations.map((station) => (
          <Link key={station.id} to={`/stations/${station.id}`}>
            <Card className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary" />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{station.name}</p>
                      <p className="text-sm text-gray-500">{station.address}</p>
                      <p className="text-xs text-gray-400 mt-1">{station.lastUpdate}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-primary font-medium">
                        R$ {station.prices[selectedFuel as keyof typeof station.prices].toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-500">{station.distance}</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Stations;
