import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PriceAlerts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: alerts } = useQuery({
    queryKey: ["all-price-alerts"],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("price_alerts")
        .select(`
          *,
          stations (
            name,
            address
          )
        `)
        .eq("user_id", user.id)
        .eq("active", true);

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-primary to-secondary p-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-white"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-semibold text-white">Meus Alertas</h1>
        </div>
      </section>

      <div className="p-6 space-y-4">
        {alerts?.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Bell className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>Você não tem alertas de preço ativos.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => navigate("/stations")}
            >
              Criar novo alerta
            </Button>
          </div>
        )}

        {alerts?.map((alert) => (
          <div
            key={alert.id}
            className="p-4 border rounded-lg space-y-2 bg-white"
          >
            <h3 className="font-medium">{alert.stations.name}</h3>
            <p className="text-sm text-gray-500">{alert.stations.address}</p>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium capitalize">
                  {alert.fuel_type}
                </p>
                <p className="text-sm text-gray-500">
                  Meta: {formatCurrency(alert.target_price)}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={async () => {
                  await supabase
                    .from("price_alerts")
                    .update({ active: false })
                    .eq("id", alert.id);
                }}
              >
                Excluir
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PriceAlerts;