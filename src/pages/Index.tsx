import { Bell, PiggyBank } from "lucide-react";
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
import { StationCard } from "@/components/stations/StationCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [selectedFuel, setSelectedFuel] = useState(profile?.preferred_fuel_type || 'regular');
  const { location } = useLocation();
  const { data: stations, isLoading } = useStations();
  const navigate = useNavigate();

  // Fetch wallet balance
  const { data: wallet } = useQuery({
    queryKey: ['wallet', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('profile_id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Fetch pending receipts total
  const { data: pendingTotal } = useQuery({
    queryKey: ['pending-receipts', user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;
      const { data, error } = await supabase
        .from('receipts')
        .select('amount')
        .eq('user_id', user.id)
        .eq('status', 'processing');

      if (error) throw error;
      // Calculate total pending amount (R$0.20 per receipt)
      return (data?.length || 0) * 0.20;
    },
    enabled: !!user?.id,
  });

  // Mock notifications data - In a real app, this would come from an API
  const notifications = [
    { id: 1, title: "Nota fiscal aprovada", read: false },
    { id: 2, title: "Cashback recebido", read: true },
  ];
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  // Process and sort stations
  const processedStations = useMemo(() => {
    if (!stations) return [];
    
    return stations
      .filter(station => {
        const price = station.prices[selectedFuel as keyof typeof station.prices];
        return price > 0;
      })
      .sort((a, b) => {
        if (a.calculatedDistance !== null && b.calculatedDistance !== null) {
          return a.calculatedDistance - b.calculatedDistance;
        }
        const priceA = a.prices[selectedFuel as keyof typeof a.prices] || 0;
        const priceB = b.prices[selectedFuel as keyof typeof b.prices] || 0;
        return priceA - priceB;
      })
      .slice(0, 5);
  }, [stations, selectedFuel]);

  return (
    <div className="flex flex-col gap-6 pb-20 px-6 py-6" >
      <section className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 pt-8 -mx-6 -mt-6 rounded-b-2xl">
        <div className="flex justify-between items-center mb-4">
          <div className="flex flex-col">
            <img src="/abasteci.svg"  alt="abasteci" className="h-8 mb-2" />
          </div>
          <Link to="/notifications" className="relative">
            <Button variant="ghost" size="icon" className="text-green-800 ">
              <Bell className="h-6 w-6" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-700 text-white text-xs font-medium w-5 h-5 flex items-center justify-center rounded-full">
                  {unreadCount}
                </span>
              )}
            </Button>
          </Link>
        </div>
        <BalanceCard 
          balance={wallet?.balance || 0} 
          pendingBalance={pendingTotal || 0} 
        />
      </section>

      <Card className="p-6 bg-gradient-to-br from-cyan-50 to-sky-100 border-1,5 border-sky-200">
      <div className="flex items-start gap-4 mb-4">
      <PiggyBank className="w-6 h-6" />
        <h2 className="text-lg font-semibold text-blue-950 mb-2">
          Economize nos abastecimentos!
        </h2>
        </div>
        <p className="text-gray-700 text-sm leading-relaxed">
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
                className="mb-2"
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
