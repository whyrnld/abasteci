import { useState } from "react";
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

export interface PriceAlertDialogProps {
  station: Station;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const PriceAlertDialog = ({ station, open, onOpenChange }: PriceAlertDialogProps) => {
  const [targetPrice, setTargetPrice] = useState<number | "">("");
  const { toast } = useToast();
  const { user } = useAuth();

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

    if (targetPrice === "") {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, insira um preço alvo.",
      });
      return;
    }

    const { error } = await supabase
      .from("price_alerts")
      .insert({
        user_id: user.id,
        station_id: station.id,
        target_price: targetPrice,
        active: true,
      });

    if (error) {
      toast({
        variant: "destructive",
        title: "Erro ao criar alerta",
        description: "Não foi possível criar o alerta de preço.",
      });
    } else {
      toast({
        title: "Alerta criado!",
        description: `Você será notificado quando o preço do ${station.name} atingir R$ ${targetPrice}.`,
      });
      onOpenChange?.(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Alerta de Preço</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="targetPrice">Preço alvo</Label>
            <Input
              id="targetPrice"
              type="number"
              value={targetPrice}
              onChange={(e) => setTargetPrice(Number(e.target.value))}
              placeholder="R$ 0,00"
              required
            />
          </div>
          <Button type="submit">Criar Alerta</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
