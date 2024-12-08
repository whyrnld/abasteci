import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Bell } from "lucide-react";

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

const PriceAlertDialog = ({ stationId, stationName, currentPrices }: PriceAlertDialogProps) => {
  const [open, setOpen] = useState(false);
  const [fuelType, setFuelType] = useState<string>("");
  const [targetPrice, setTargetPrice] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createAlert = useMutation({
    mutationFn: async () => {
      if (!user?.id || !fuelType || !targetPrice) return;

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
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível criar o alerta de preço.",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createAlert.mutate();
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
          <DialogTitle>Criar alerta de preço</DialogTitle>
          <DialogDescription>
            Você será notificado quando o preço do combustível atingir o valor desejado no posto {stationName}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Button type="submit" disabled={!fuelType || !targetPrice}>
              Criar Alerta
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PriceAlertDialog;