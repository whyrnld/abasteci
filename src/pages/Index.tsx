import { Bell } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, getFirstName } from "@/lib/utils";
import BalanceCard from "@/components/BalanceCard";
import PremiumCard from "@/components/PremiumCard";
import ReferralCard from "@/components/ReferralCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { useStations } from "@/hooks/useStations";
import { useProfile } from "@/hooks/useProfile";

const Index = () => {
  const balance = 15.50;
  const pendingBalance = 5.20;
  const { profile } = useProfile();
  const [selectedFuel, setSelectedFuel] = useState(profile?.preferred_fuel_type || 'regular');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const { data: stations, isLoading } = useStations();

  useEffect(() => {
    if (profile?.preferred_fuel_type) {
      setSelectedFuel(profile.preferred_fuel_type);
    }
  }, [profile]);

  // Mock notifications data - In a real app, this would come from an API
  const notifications = [
    { id: 1, title: "Nota fiscal aprovada", read: false },
    { id: 2, title: "Cashback recebido", read: true },
  ];
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  // Sort stations by distance
  const sortedStations = stations?.slice().sort((a, b) => {
    if (!a.calculatedDistance || !b.calculatedDistance) return 0;
    return a.calculatedDistance - b.calculatedDistance;
  }).slice(0, 5); // Only show first 5 stations

  return (
    <div className="flex flex-col gap-6 pb-20">
      <section className="bg-gradient-to-r from-primary to-secondary p-6 pt-8 -mx-6 -mt-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-white text-xl font-medium">
            Olá, {profile ? getFirstName(profile.full_name) : ""}
          </h1>
          <Link to="/notifications" className="relative">
            <Button variant="ghost" size="icon" className="text-white hover:text-white/80">
              <Bell className="h-6 w-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-white text-primary text-xs font-medium w-5 h-5 flex items-center justify-center rounded-full">
                  {unreadCount}
                </span>
              )}
            </Button>
          </Link>
        </div>
        <BalanceCard balance={balance} pendingBalance={pendingBalance} />
      </section>

      <Card className="p-6 bg-gradient-to-br from-accent to-white border-2 border-primary/20">
        <h2 className="text-xl font-semibold text-secondary mb-2">
          Economize em seus abastecimentos!
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Compare preços dos postos próximos a você e ganhe cashback ao enviar suas notas fiscais. 
          Abasteça mais pagando menos e ainda receba dinheiro de volta!
        </p>
      </Card>

      <section className="space-y-4">
        <PremiumCard />
        <ReferralCard />
      </section>

      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Postos</h2>
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
          {sortedStations?.map((station) => {
            // Remove country from address
            const formattedAddress = station.address.split(',').slice(0, -1).join(',');
            
            return (
              <Link 
                key={station.id} 
                to={`/stations/${station.id}`}
                className="block"
              >
                <Card className="p-4 hover:shadow-md transition-shadow bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-center gap-3">
                    <img 
                      src={station.image_url || '/placeholder.svg'} 
                      alt={station.name} 
                      className="w-10 h-10 object-cover rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{station.name}</p>
                          <p className="text-xs text-gray-500">{formattedAddress}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-primary font-medium">
                            {selectedFuel === 'regular' ? 
                              formatCurrency(station.prices.regular) :
                              formatCurrency(station.prices.premium)
                            }
                          </p>
                          <p className="text-xs text-gray-500">
                            {station.calculatedDistance ? `${station.calculatedDistance.toFixed(1)}km` : '--'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Index;
