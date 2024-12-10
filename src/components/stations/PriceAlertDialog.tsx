import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { Bell } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface PriceAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stationId: number;
  prices: {
    regular: number;
    premium: number;
    ethanol: number;
    diesel: number;
  };
}

export function PriceAlertDialog({ open, onOpenChange, stationId, prices }: PriceAlertDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedFuel, setSelectedFuel] = useState<string>("regular");
  const [targetPrice, setTargetPrice] = useState("");

  // Fetch existing alerts
  const { data: alerts } = useQuery({
    queryKey: ["price-alerts", stationId],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("price_alerts")
        .select("*")
        .eq("station_id", stationId)
        .eq("user_id", user.id)
        .eq("active", true);

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const createAlert = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("User not authenticated");
      const { error } = await supabase.from("price_alerts").insert({
        user_id: user.id,
        station_id: stationId,
        fuel_type: selectedFuel,
        target_price: Number(targetPrice),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["price-alerts"] });
      toast({
        title: "Alerta criado",
        description: "Você será notificado quando o preço atingir o valor desejado.",
      });
      setTargetPrice("");
    },
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
        title: "Alerta removido",
        description: "O alerta de preço foi removido com sucesso.",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createAlert.mutate();
  };

  const getFuelPrice = (type: string) => {
    return prices[type as keyof typeof prices] || 0;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Alerta de Preço
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Label>Selecione o combustível</Label>
            <RadioGroup
              value={selectedFuel}
              onValueChange={setSelectedFuel}
              className="grid grid-cols-2 gap-4"
            >
              <Label 
                className={cn(
                  "flex items-center gap-2 p-4 border rounded-lg cursor-pointer transition-colors",
                  selectedFuel === "regular" && "border-green-500 bg-green-50"
                )}
              >
                <RadioGroupItem value="regular" className="sr-only" />
                <div>
                  <p>Comum</p>
                  <p className="text-sm text-gray-500">
                    Atual: {formatCurrency(prices.regular)}
                  </p>
                </div>
              </Label>
              <Label 
                className={cn(
                  "flex items-center gap-2 p-4 border rounded-lg cursor-pointer transition-colors",
                  selectedFuel === "premium" && "border-green-500 bg-green-50"
                )}
              >
                <RadioGroupItem value="premium" className="sr-only" />
                <div>
                  <p>Aditivada</p>
                  <p className="text-sm text-gray-500">
                    Atual: {formatCurrency(prices.premium)}
                  </p>
                </div>
              </Label>
              <Label 
                className={cn(
                  "flex items-center gap-2 p-4 border rounded-lg cursor-pointer transition-colors",
                  selectedFuel === "ethanol" && "border-green-500 bg-green-50"
                )}
              >
                <RadioGroupItem value="ethanol" className="sr-only" />
                <div>
                  <p>Etanol</p>
                  <p className="text-sm text-gray-500">
                    Atual: {formatCurrency(prices.ethanol)}
                  </p>
                </div>
              </Label>
              <Label 
                className={cn(
                  "flex items-center gap-2 p-4 border rounded-lg cursor-pointer transition-colors",
                  selectedFuel === "diesel" && "border-green-500 bg-green-50"
                )}
              >
                <RadioGroupItem value="diesel" className="sr-only" />
                <div>
                  <p>Diesel</p>
                  <p className="text-sm text-gray-500">
                    Atual: {formatCurrency(prices.diesel)}
                  </p>
                </div>
              </Label>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="target-price">Preço desejado</Label>
            <Input
              id="target-price"
              type="number"
              step="0.01"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              placeholder={`Menor que ${formatCurrency(getFuelPrice(selectedFuel))}`}
              required
            />
          </div>

          <Button type="submit" className="w-full">
            Criar Alerta
          </Button>
        </form>

        {alerts && alerts.length > 0 && (
          <div className="mt-6 space-y-4">
            <h3 className="font-medium">Alertas Ativos</h3>
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium capitalize">{alert.fuel_type}</p>
                    <p className="text-sm text-gray-500">
                      Meta: {formatCurrency(alert.target_price)}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteAlert.mutate(alert.id)}
                  >
                    Excluir
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}