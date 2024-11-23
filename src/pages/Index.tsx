import { Bell, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import BalanceCard from "@/components/BalanceCard";
import PremiumCard from "@/components/PremiumCard";
import ReferralCard from "@/components/ReferralCard";

const Index = () => {
  const balance = 15.50;
  const pendingBalance = 5.20;
  
  const nearbyStations = [
    {
      id: 1,
      name: "Posto Shell",
      distance: "1.2km",
      price: 5.49,
      lastUpdate: "Há 2 horas",
    },
    {
      id: 2,
      name: "Posto Ipiranga",
      distance: "1.8km",
      price: 5.39,
      lastUpdate: "Há 3 horas",
    },
    {
      id: 3,
      name: "Posto BR",
      distance: "2.1km",
      price: 5.45,
      lastUpdate: "Há 4 horas",
    },
  ];

  return (
    <div className="flex flex-col gap-6 pb-20">
      <section className="bg-black p-6 -mx-6 -mt-6">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-white text-lg font-medium">Olá, João</h1>
          <Button variant="ghost" size="icon" className="text-white">
            <Bell className="h-6 w-6" />
          </Button>
        </div>
        <BalanceCard balance={balance} pendingBalance={pendingBalance} />
      </section>

      <section>
        <PremiumCard />
      </section>

      <section>
        <ReferralCard />
      </section>

      <section>
        <h2 className="text-lg font-medium mb-4">Postos mais próximos</h2>
        <div className="space-y-3">
          {nearbyStations.map((station, index) => (
            <Link 
              key={station.id} 
              to={index === nearbyStations.length - 1 ? "/stations" : `/stations/${station.id}`}
              className="block"
            >
              <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-black" />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{station.name}</p>
                        <p className="text-sm text-gray-500">{station.lastUpdate}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-black font-medium">
                          {formatCurrency(station.price)}
                        </p>
                        <p className="text-sm text-gray-500">{station.distance}</p>
                      </div>
                    </div>
                  </div>
                </div>
                {index === nearbyStations.length - 1 && (
                  <div className="mt-3 text-center">
                    <Button variant="outline" className="w-full">
                      Ver todos os postos
                    </Button>
                  </div>
                )}
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;