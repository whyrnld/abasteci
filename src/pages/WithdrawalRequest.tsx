import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { WithdrawalForm } from "@/components/withdrawals/WithdrawalForm";

const WithdrawalRequest = () => {
  const [pixKeyType, setPixKeyType] = useState("cpf");
  const [pixKey, setPixKey] = useState("");
  const [amount, setAmount] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: wallet, refetch: refetchWallet } = useQuery({
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
      // Update wallet balance
      const { error: walletError } = await supabase
        .from('wallets')
        .update({ 
          balance: wallet.balance - withdrawalAmount,
          updated_at: new Date().toISOString()
        })
        .eq('profile_id', user?.id);

      if (walletError) throw walletError;

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

      await refetchWallet();

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

      <WithdrawalForm
        pixKeyType={pixKeyType}
        setPixKeyType={setPixKeyType}
        pixKey={pixKey}
        setPixKey={setPixKey}
        amount={amount}
        setAmount={setAmount}
        walletBalance={wallet?.balance || 0}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default WithdrawalRequest;