import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bell, Trash2, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";

const PriceAlerts = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: alerts, isLoading } = useQuery({
    queryKey: ["price-alerts"],
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

  const deleteAlert = useMutation({
    mutationFn: async (alertId: number) => {
      const { error } = await supabase
        .from("price_alerts")
        .update({ active: false })
        .eq("id", alertId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["price-alerts"] });
      toast({
        title: "Alerta excluído",
        description: "O alerta de preço foi excluído com sucesso.",
      });
    },
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <section className="bg-gradient-to-r from-primary to-[#10B981] p-6 flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="text-white"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-bold text-white">Meus Alertas de Preço</h1>
      </section>

      <div className="p-4 space-y-4">
        {isLoading ? (
          <div className="text-center py-4">Carregando alertas...</div>
        ) : alerts?.length === 0 ? (
          <div className="text-center py-4">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">
              Você não tem alertas de preço ativos.
            </p>
          </div>
        ) : (
          alerts?.map((alert) => (
            <Card key={alert.id} className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{alert.stations.name}</h3>
                    <p className="text-sm text-gray-500">
                      {alert.stations.address}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(`/stations/${alert.station_id}/price-alert/${alert.id}`)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteAlert.mutate(alert.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium capitalize">
                        {alert.fuel_type}
                      </p>
                      <p className="text-sm text-gray-500">
                        Meta: {formatCurrency(alert.target_price)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default PriceAlerts;