import { Bell, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import BalanceCard from "@/components/BalanceCard";
import PremiumCard from "@/components/PremiumCard";
import ReferralCard from "@/components/ReferralCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

const Index = () => {
  const balance = 15.50;
  const pendingBalance = 5.20;
  const [selectedFuel, setSelectedFuel] = useState('regular');
  
  const nearbyStations = [
    {
      id: 1,
      name: "Posto Shell",
      distance: "1.2km",
      image_url: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
      prices: {
        regular: 5.49,
        premium: 5.89,
      },
      lastUpdate: "Há 2 horas",
    },
    {
      id: 2,
      name: "Posto Ipiranga",
      distance: "1.8km",
      image_url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e",
      prices: {
        regular: 5.39,
        premium: 5.79,
      },
      lastUpdate: "Há 3 horas",
    },
    {
      id: 3,
      name: "Posto BR",
      distance: "2.1km",
      image_url: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d",
      prices: {
        regular: 5.45,
        premium: 5.85,
      },
      lastUpdate: "Há 4 horas",
    },
  ];

  return (
    <div className="flex flex-col gap-6 pb-20">
      <section className="bg-gradient-to-r from-primary to-secondary p-6 pt-8 -mx-6 -mt-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-white text-xl font-medium">Olá, João</h1>
          <Link to="/notifications">
            <Button variant="ghost" size="icon" className="text-white hover:text-white/80">
              <Bell className="h-6 w-6" />
            </Button>
          </Link>
        </div>
        <BalanceCard balance={balance} pendingBalance={pendingBalance} />
      </section>

      <section className="space-y-4">
        <PremiumCard />
        <ReferralCard />
      </section>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Postos mais próximos</h2>
          <Select value={selectedFuel} onValueChange={setSelectedFuel}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="regular">Comum</SelectItem>
              <SelectItem value="premium">Aditivada</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-3">
          {nearbyStations.map((station, index) => (
            <Link 
              key={station.id} 
              to={index === nearbyStations.length - 1 ? "/stations" : `/stations/${station.id}`}
              className="block"
            >
              <Card className="p-4 hover:shadow-md transition-shadow bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center gap-3">
                  <img 
                    src={station.image_url} 
                    alt={station.name} 
                    className="w-10 h-10 object-cover rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{station.name}</p>
                        <p className="text-sm text-gray-500">{station.lastUpdate}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-primary font-medium">
                          {selectedFuel === 'regular' ? 
                            formatCurrency(station.prices.regular) :
                            formatCurrency(station.prices.premium)
                          }
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