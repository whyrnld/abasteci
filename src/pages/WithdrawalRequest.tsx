import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { useProfile } from "@/hooks/useProfile";

const WithdrawalRequest = () => {
  const { profile } = useProfile();
  const [pixKeyType, setPixKeyType] = useState(profile?.pix_key_type || "cpf");
  const [pixKey, setPixKey] = useState(profile?.pix_key || "");
  const [amount, setAmount] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (profile) {
      setPixKeyType(profile.pix_key_type || "cpf");
      setPixKey(profile.pix_key || "");
    }
  }, [profile]);

  const { data: wallet } = useQuery({
    queryKey: ['wallet', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('profile_id', user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  const handleWithdrawAll = () => {
    if (wallet?.balance) {
      setAmount(wallet.balance.toString());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!pixKey) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, insira uma chave PIX válida.",
      });
      return;
    }

    const withdrawalAmount = Number(amount);
    if (!withdrawalAmount || withdrawalAmount <= 0) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, insira um valor válido para saque.",
      });
      return;
    }

    if (!wallet?.balance || withdrawalAmount > wallet.balance) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Saldo insuficiente para realizar o saque.",
      });
      return;
    }

    try {
      // Create withdrawal request
      const { error: withdrawalError } = await supabase
        .from('withdrawals')
        .insert({
          user_id: user?.id,
          amount: withdrawalAmount,
          pix_key: pixKey,
          pix_key_type: pixKeyType,
        });

      if (withdrawalError) throw withdrawalError;

      // Update wallet balance
      const { error: walletError } = await supabase
        .from('wallets')
        .update({ balance: wallet.balance - withdrawalAmount })
        .eq('profile_id', user?.id);

      if (walletError) throw walletError;

      toast({
        title: "Solicitação enviada",
        description: "Seu saque será processado em até 24 horas.",
      });
      
      navigate('/balance');
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Erro ao processar sua solicitação de saque.",
      });
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-20 px-6 py-6">
      <section className="bg-gradient-to-r from-primary to-secondary p-6 -mx-6 -mt-6 flex items-center gap-2">
        <Button variant="ghost" onClick={() => navigate(-1)} className="text-white p-2">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-white text-lg font-medium">Solicitar Saque</h1>
      </section>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <Label>Valor disponível para saque</Label>
              <p className="text-2xl font-bold mt-1">
                R$ {wallet?.balance?.toFixed(2) || '0.00'}
              </p>
            </div>

            <div>
              <Label>Valor do saque</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Digite o valor"
                  step="0.01"
                  min="0"
                  max={wallet?.balance || 0}
                />
                <Button type="button" variant="outline" onClick={handleWithdrawAll}>
                  Sacar tudo
                </Button>
              </div>
            </div>

            <div>
              <Label>Tipo de Chave PIX</Label>
              <RadioGroup
                value={pixKeyType}
                onValueChange={setPixKeyType}
                className="grid grid-cols-2 gap-4 mt-2"
              >
                <div>
                  <RadioGroupItem value="cpf" id="cpf" className="peer sr-only" />
                  <Label
                    htmlFor="cpf"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    CPF
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="email" id="email" className="peer sr-only" />
                  <Label
                    htmlFor="email"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    Email
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="phone" id="phone" className="peer sr-only" />
                  <Label
                    htmlFor="phone"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    Celular
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="random" id="random" className="peer sr-only" />
                  <Label
                    htmlFor="random"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    Aleatória
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div>
              <Label>Chave PIX</Label>
              <Input
                type="text"
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
                placeholder="Digite sua chave PIX"
                className="mt-2"
              />
            </div>
          </div>
        </Card>

        <Button type="submit" className="w-full">
          Solicitar Saque
        </Button>
      </form>
    </div>
  );
};

export default WithdrawalRequest;