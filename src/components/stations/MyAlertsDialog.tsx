import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Bell } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface MyAlertsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MyAlertsDialog({ open, onOpenChange }: MyAlertsDialogProps) {
  const { user } = useAuth();

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Meus Alertas de Preço
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {alerts?.length === 0 && (
            <p className="text-center text-gray-500">
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
      </DialogContent>
    </Dialog>
  );
}