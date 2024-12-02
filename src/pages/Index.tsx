import { Bell } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, getFirstName } from "@/lib/utils";
import BalanceCard from "@/components/BalanceCard";
import PremiumCard from "@/components/PremiumCard";
import ReferralCard from "@/components/ReferralCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect, useMemo } from "react";
import { useStations } from "@/hooks/useStations";
import { useProfile } from "@/hooks/useProfile";
import { useLocation } from "@/contexts/LocationContext";
import { calculateDistance } from "@/utils/distance";
import { Navigation } from "lucide-react";
import { StationCard } from "@/components/stations/StationCard";

const Index = () => {
  const balance = 15.50;
  const pendingBalance = 5.20;
  const { profile } = useProfile();
  const [selectedFuel, setSelectedFuel] = useState(profile?.preferred_fuel_type || 'regular');
  const { location } = useLocation();
  const { data: stations, isLoading } = useStations();
  const navigate = useNavigate();

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
  
  // Processa e ordena as estações
  const processedStations = useMemo(() => {
    if (!stations) return [];
    
    return stations
      .filter(station => {
        // Filtra estações sem preço do combustível selecionado
        const price = station.prices[selectedFuel as keyof typeof station.prices];
        return price > 0;
      })
      .sort((a, b) => {
        // Primeiro por distância se disponível
        if (a.calculatedDistance !== null && b.calculatedDistance !== null) {
          return a.calculatedDistance - b.calculatedDistance;
        }
        // Se não tiver distância, ordena por preço
        const priceA = a.prices[selectedFuel as keyof typeof a.prices] || 0;
        const priceB = b.prices[selectedFuel as keyof typeof b.prices] || 0;
        return priceA - priceB;
      })
      .slice(0, 5); // Mostra apenas os 5 primeiros
  }, [stations, selectedFuel]);

  return (
    <div className="flex flex-col gap-6 pb-20 px-6 py-6" >
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

      <section className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-medium">Postos Próximos</h2>
            <p className="text-sm text-gray-500">Até 5km de distância</p>
          </div>
          <Button variant="ghost" onClick={() => navigate('/stations')}>
            Ver todos
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-4">Carregando postos...</div>
        ) : processedStations.length > 0 ? (
          <div className="flex flex-col py-4">
            {processedStations.map((station) => (
              <StationCard
                key={station.id}
                station={station}
                selectedFuel={selectedFuel}
                className="mb-4"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            Nenhum posto encontrado com {
              selectedFuel === 'regular' ? 'gasolina comum' :
              selectedFuel === 'premium' ? 'gasolina aditivada' :
              selectedFuel === 'ethanol' ? 'etanol' : 'diesel'
            }
          </div>
        )}
      </section>
    </div>
  );
};

export default Index;
