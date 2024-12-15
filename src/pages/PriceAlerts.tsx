import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency } from "@/lib/utils";
import { Bell, ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export default function PriceAlerts() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const deleteAlert = useMutation({
    mutationFn: async (alertId: number) => {
      const { error } = await supabase
        .from("price_alerts")
        .update({ active: false })
        .eq("id", alertId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-price-alerts"] });
      toast({
        title: "Alerta excluído",
        description: "O alerta de preço foi excluído com sucesso.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível excluir o alerta.",
      });
    },
  });

  return (
    <div>
      <div className="bg-emerald-400 text-white p-4 flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-emerald-500/20"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-medium">Alertas de Preço</h1>
      </div>

      <div className="container py-6 space-y-6">
        <div className="space-y-4">
          {alerts?.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              Você não tem alertas de preço ativos.
            </p>
          )}

          {alerts?.map((alert) => (
            <div
              key={alert.id}
              className="p-4 border rounded-lg space-y-2"
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
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(`/stations/${alert.station_id}`)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteAlert.mutate(alert.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}