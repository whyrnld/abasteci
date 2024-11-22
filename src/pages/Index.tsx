import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { MapPin } from "lucide-react";

const Index = () => {
  const balance = 15.50;
  const pendingBalance = 5.20;
  
  const nearbyStations = [
    {
      id: 1,
      name: "Posto Shell",
      distance: "1.2km",
      price: 5.49,
    },
    {
      id: 2,
      name: "Posto Ipiranga",
      distance: "1.8km",
      price: 5.39,
    },
    {
      id: 3,
      name: "Posto BR",
      distance: "2.1km",
      price: 5.45,
    },
  ];
  
  return (
    <div className="flex flex-col gap-6 pb-20">
      <section className="bg-primary p-6 -mx-6 -mt-6">
        <h1 className="text-white text-lg font-medium mb-2">Olá, João</h1>
        <Card className="p-4">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Saldo disponível</p>
              <p className="text-2xl font-bold">{formatCurrency(balance)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Saldo pendente</p>
              <p className="text-lg text-gray-600">{formatCurrency(pendingBalance)}</p>
            </div>
          </div>
        </Card>
      </section>

      <section>
        <h2 className="text-lg font-medium mb-4">Postos mais próximos</h2>
        <div className="space-y-3">
          {nearbyStations.map((station) => (
            <Card key={station.id} className="p-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary" />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{station.name}</p>
                      <p className="text-sm text-gray-500">{station.distance}</p>
                    </div>
                    <p className="text-primary font-medium">
                      {formatCurrency(station.price)}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-medium mb-4">Últimas transações</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Posto Shell</p>
                  <p className="text-sm text-gray-500">12/03/2024</p>
                </div>
                <p className="text-primary font-medium">+ R$ 0,10</p>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;