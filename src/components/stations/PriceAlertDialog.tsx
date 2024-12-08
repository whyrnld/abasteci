import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Bell, Pencil, Trash2 } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface PriceAlertDialogProps {
  stationId: number;
  stationName: string;
  currentPrices: {
    regular: number;
    premium: number;
    ethanol: number;
    diesel: number;
  };
}

export const PriceAlertDialog = ({ stationId, stationName, currentPrices }: PriceAlertDialogProps) => {
  const [open, setOpen] = useState(false);
  const [fuelType, setFuelType] = useState<string>("");
  const [targetPrice, setTargetPrice] = useState("");
  const [editingAlert, setEditingAlert] = useState<any>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: existingAlerts } = useQuery({
    queryKey: ['price-alerts', stationId],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('price_alerts')
        .select('*')
        .eq('station_id', stationId)
        .eq('user_id', user.id)
        .eq('active', true);

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const createAlert = useMutation({
    mutationFn: async () => {
      if (!user?.id || !fuelType || !targetPrice) return;

      // Check for existing alert
      const existingAlert = existingAlerts?.find(alert => alert.fuel_type === fuelType);
      if (existingAlert) {
        throw new Error(`Você já tem um alerta configurado para ${fuelType === 'regular' ? 'Gasolina Comum' : 
          fuelType === 'premium' ? 'Gasolina Aditivada' : 
          fuelType === 'ethanol' ? 'Etanol' : 'Diesel'}`);
      }

      const { error } = await supabase
        .from('price_alerts')
        .insert({
          user_id: user.id,
          station_id: stationId,
          fuel_type: fuelType,
          target_price: parseFloat(targetPrice),
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Alerta criado",
        description: "Você será notificado quando o preço atingir o valor desejado.",
      });
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ['price-alerts'] });
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Erro",
        description: error.message,
      });
    },
  });

  const updateAlert = useMutation({
    mutationFn: async () => {
      if (!editingAlert?.id || !targetPrice) return;

      const { error } = await supabase
        .from('price_alerts')
        .update({
          target_price: parseFloat(targetPrice),
        })
        .eq('id', editingAlert.id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Alerta atualizado",
        description: "O valor do alerta foi atualizado com sucesso.",
      });
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ['price-alerts'] });
      resetForm();
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar o alerta.",
      });
    },
  });

  const deleteAlert = useMutation({
    mutationFn: async (alertId: number) => {
      const { error } = await supabase
        .from('price_alerts')
        .delete()
        .eq('id', alertId);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Alerta removido",
        description: "O alerta de preço foi removido com sucesso.",
      });
      queryClient.invalidateQueries({ queryKey: ['price-alerts'] });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível remover o alerta.",
      });
    },
  });

  const resetForm = () => {
    setFuelType("");
    setTargetPrice("");
    setEditingAlert(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAlert) {
      updateAlert.mutate();
    } else {
      createAlert.mutate();
    }
  };

  const getFuelTypeName = (type: string) => {
    switch (type) {
      case 'regular': return 'Gasolina Comum';
      case 'premium': return 'Gasolina Aditivada';
      case 'ethanol': return 'Etanol';
      case 'diesel': return 'Diesel';
      default: return type;
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Bell className="w-4 h-4 mr-2" />
          Me avise quando abaixar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editingAlert ? "Editar alerta de preço" : "Criar alerta de preço"}
          </DialogTitle>
          <DialogDescription>
            {editingAlert 
              ? `Edite o valor desejado para ${getFuelTypeName(editingAlert.fuel_type)} no posto ${stationName}.`
              : `Você será notificado quando o preço do combustível atingir o valor desejado no posto ${stationName}.`}
          </DialogDescription>
        </DialogHeader>

        {existingAlerts && existingAlerts.length > 0 && !editingAlert && (
          <div className="space-y-4 mb-4">
            <h3 className="text-sm font-medium">Alertas configurados:</h3>
            {existingAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium">{getFuelTypeName(alert.fuel_type)}</p>
                  <p className="text-sm text-gray-500">
                    Alerta quando ≤ {formatCurrency(alert.target_price)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditingAlert(alert);
                      setFuelType(alert.fuel_type);
                      setTargetPrice(alert.target_price.toString());
                    }}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteAlert.mutate(alert.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!editingAlert && (
            <div className="space-y-2">
              <label className="text-sm text-gray-500">Tipo de combustível</label>
              <Select
                value={fuelType}
                onValueChange={setFuelType}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o combustível" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">Gasolina Comum (R$ {currentPrices.regular})</SelectItem>
                  <SelectItem value="premium">Gasolina Aditivada (R$ {currentPrices.premium})</SelectItem>
                  <SelectItem value="ethanol">Etanol (R$ {currentPrices.ethanol})</SelectItem>
                  <SelectItem value="diesel">Diesel (R$ {currentPrices.diesel})</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm text-gray-500">Preço desejado</label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={targetPrice}
              onChange={(e) => setTargetPrice(e.target.value)}
              placeholder="0,00"
            />
          </div>

          <DialogFooter>
            {editingAlert && (
              <Button
                type="button"
                variant="ghost"
                onClick={resetForm}
              >
                Cancelar
              </Button>
            )}
            <Button 
              type="submit" 
              disabled={!fuelType && !editingAlert || !targetPrice}
            >
              {editingAlert ? "Salvar" : "Criar Alerta"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};