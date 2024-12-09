import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Station } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Bell, Pencil, Trash } from "lucide-react";

export interface PriceAlertDialogProps {
  station: Station;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const PriceAlertDialog = ({ station, open, onOpenChange }: PriceAlertDialogProps) => {
  const [selectedFuel, setSelectedFuel] = useState<string>("");
  const [targetPrice, setTargetPrice] = useState<number | "">("");
  const [existingAlerts, setExistingAlerts] = useState<any[]>([]);
  const [editingAlert, setEditingAlert] = useState<any>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (user && open) {
      loadExistingAlerts();
    }
  }, [user, open]);

  const loadExistingAlerts = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("price_alerts")
      .select("*")
      .eq("user_id", user.id)
      .eq("station_id", station.id)
      .eq("active", true);

    if (error) {
      console.error("Error loading alerts:", error);
      return;
    }

    setExistingAlerts(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Você precisa estar logado para criar um alerta de preço.",
      });
      return;
    }

    if (!selectedFuel || targetPrice === "") {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, selecione um combustível e insira um preço alvo.",
      });
      return;
    }

    try {
      if (editingAlert) {
        await supabase
          .from("price_alerts")
          .update({
            fuel_type: selectedFuel,
            target_price: targetPrice,
          })
          .eq("id", editingAlert.id);
      } else {
        await supabase
          .from("price_alerts")
          .insert({
            user_id: user.id,
            station_id: station.id,
            fuel_type: selectedFuel,
            target_price: targetPrice,
            active: true,
          });
      }

      toast({
        title: editingAlert ? "Alerta atualizado!" : "Alerta criado!",
        description: `Você será notificado quando o preço do combustível atingir R$ ${targetPrice}.`,
      });

      setSelectedFuel("");
      setTargetPrice("");
      setEditingAlert(null);
      loadExistingAlerts();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível salvar o alerta de preço.",
      });
    }
  };

  const handleEdit = (alert: any) => {
    setEditingAlert(alert);
    setSelectedFuel(alert.fuel_type);
    setTargetPrice(alert.target_price);
  };

  const handleDelete = async (alertId: number) => {
    try {
      await supabase
        .from("price_alerts")
        .delete()
        .eq("id", alertId);

      toast({
        title: "Alerta removido",
        description: "O alerta de preço foi removido com sucesso.",
      });

      loadExistingAlerts();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível remover o alerta.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Alertas de Preço
            </div>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="fuelType">Combustível</Label>
            <Select value={selectedFuel} onValueChange={setSelectedFuel}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o combustível" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="regular">Gasolina Comum</SelectItem>
                <SelectItem value="premium">Gasolina Aditivada</SelectItem>
                <SelectItem value="ethanol">Etanol</SelectItem>
                <SelectItem value="diesel">Diesel</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="targetPrice">Preço alvo</Label>
            <Input
              id="targetPrice"
              type="number"
              step="0.01"
              value={targetPrice}
              onChange={(e) => setTargetPrice(Number(e.target.value))}
              placeholder="R$ 0,00"
              required
            />
          </div>

          <Button type="submit" className="w-full">
            {editingAlert ? "Atualizar Alerta" : "Criar Alerta"}
          </Button>
        </form>

        {existingAlerts.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2">Alertas ativos</h3>
            <div className="space-y-2">
              {existingAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="text-sm font-medium">
                      {alert.fuel_type === "regular"
                        ? "Gasolina Comum"
                        : alert.fuel_type === "premium"
                        ? "Gasolina Aditivada"
                        : alert.fuel_type === "ethanol"
                        ? "Etanol"
                        : "Diesel"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Meta: {formatCurrency(alert.target_price)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(alert)}
                    >
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(alert.id)}
                    >
                      <Trash className="w-4 h-4" />
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
};