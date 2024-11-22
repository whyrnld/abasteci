import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";

const Stations = () => {
  const stations = [
    {
      id: 1,
      name: "Posto Shell",
      distance: "1.2km",
      address: "Av. Paulista, 1000",
      prices: {
        gasoline: 5.49,
        ethanol: 3.99,
        diesel: 6.29,
      },
      lastUpdate: "Há 2 horas",
    },
    // ... more stations
  ];

  return (
    <div className="flex flex-col gap-6 pb-20">
      <section className="bg-primary p-6 -mx-6 -mt-6">
        <h1 className="text-white text-lg font-medium mb-2">Postos Próximos</h1>
      </section>

      <div className="space-y-4">
        {stations.map((station) => (
          <Card key={station.id} className="p-4">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary mt-1" />
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="font-medium">{station.name}</h3>
                  <span className="text-sm text-gray-500">{station.distance}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">{station.address}</p>
                <div className="mt-3 space-y-1">
                  <p className="text-sm">Gasolina: R$ {station.prices.gasoline.toFixed(2)}</p>
                  <p className="text-sm">Etanol: R$ {station.prices.ethanol.toFixed(2)}</p>
                  <p className="text-sm">Diesel: R$ {station.prices.diesel.toFixed(2)}</p>
                </div>
                <p className="text-xs text-gray-500 mt-2">{station.lastUpdate}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Stations;