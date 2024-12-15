import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { Bell, Pencil, Trash2 } from "lucide-react";
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
  const [editingAlert, setEditingAlert] = useState<number | null>(null);

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

  const updateAlert = useMutation({
    mutationFn: async (alertId: number) => {
      const { error } = await supabase
        .from("price_alerts")
        .update({ target_price: Number(targetPrice) })
        .eq("id", alertId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["price-alerts"] });
      toast({
        title: "Alerta atualizado",
        description: "O alerta de preço foi atualizado com sucesso.",
      });
      setTargetPrice("");
      setEditingAlert(null);
    },
  });

  // Função para formatar o valor em moeda
  const formatInputPrice = (value: string) => {
    // Remove tudo que não é número
    const numbers = value.replace(/\D/g, "");

    // Converte para centavos
    const cents = Number(numbers) / 100;

    // Formata o número para moeda brasileira sem o símbolo
    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(cents);
  };

  // Função para lidar com a mudança no input
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setTargetPrice(value.replace(/\D/g, ""));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAlert) {
      updateAlert.mutate(editingAlert);
    } else {
      createAlert.mutate();
    }
  };

  const startEditing = (alert: any) => {
    setEditingAlert(alert.id);
    setSelectedFuel(alert.fuel_type);
    setTargetPrice((alert.target_price * 100).toString());
  };

  const cancelEditing = () => {
    setEditingAlert(null);
    setTargetPrice("");
    setSelectedFuel("regular");
  };

  const getFuelPrice = (type: string) => {
    return prices[type as keyof typeof prices] || 0;
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) {
        cancelEditing();
      }
      onOpenChange(isOpen);
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            {editingAlert ? "Editar alerta" : "Alerta de preço"}
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
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                R$
              </span>
              <Input
                id="target-price"
                type="text"
                inputMode="numeric"
                value={formatInputPrice(targetPrice)}
                onChange={handlePriceChange}
                className="pl-9"
                placeholder={`Menor que ${formatCurrency(getFuelPrice(selectedFuel))}`}
                required
              />
            </div>
          </div>

          <div className="flex gap-2">
            {editingAlert ? (
              <>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={cancelEditing}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={!targetPrice || Number(targetPrice) === 0}
                >
                  Salvar
                </Button>
              </>
            ) : (
              <Button
                type="submit"
                className="w-full"
                disabled={!targetPrice || Number(targetPrice) === 0}
              >
                Criar alerta
              </Button>
            )}
          </div>
        </form>

        {alerts && alerts.length > 0 && !editingAlert && (
          <div className="mt-6 space-y-4">
            <h3 className="font-medium">Alertas ativos</h3>
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
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEditing(alert)}
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
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}