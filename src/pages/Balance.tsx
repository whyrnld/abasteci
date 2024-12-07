import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { ArrowLeft, Wallet } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { Progress } from "@/components/ui/progress";
import WithdrawalHistoryCard from "@/components/withdrawals/WithdrawalHistoryCard";

const MIN_WITHDRAWAL_AMOUNT = 20;

const Balance = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  const { data: walletData } = useQuery({
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

  const { data: withdrawals } = useQuery({
    queryKey: ['withdrawals', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('withdrawals')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id
  });

  const balance = walletData?.balance || 0;
  const isPremium = profile?.is_premium;
  const progressPercentage = Math.min((balance / MIN_WITHDRAWAL_AMOUNT) * 100, 100);
  const canWithdraw = isPremium || balance >= MIN_WITHDRAWAL_AMOUNT;

  return (
    <div className="flex flex-col gap-6 pb-20 px-6 py-6">
      <section className="bg-gradient-to-r from-primary to-secondary p-6 -mx-6 -mt-6 flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-white">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-white text-lg font-medium">Saldo</h1>
      </section>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-gray-500">Saldo disponível</p>
            <p className="text-2xl font-bold">{formatCurrency(balance)}</p>
          </div>
          <Wallet className="w-8 h-8 text-primary" />
        </div>
        
        {!isPremium && (
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Progresso para saque</span>
              <span className="text-gray-700">{formatCurrency(balance)} / {formatCurrency(MIN_WITHDRAWAL_AMOUNT)}</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        )}

        <Button 
          className="w-full"
          onClick={() => navigate('/withdrawal-request')}
          disabled={!canWithdraw}
        >
          Solicitar saque
        </Button>
      </Card>

      <div>
        <h2 className="text-lg font-medium mb-4">Histórico de saques</h2>
        <div className="space-y-3">
          {withdrawals?.map((withdrawal) => (
            <Link key={withdrawal.id} to={`/withdrawals/${withdrawal.id}`}>
              <WithdrawalHistoryCard
                amount={withdrawal.amount}
                date={new Date(withdrawal.created_at).toLocaleDateString()}
                status={withdrawal.status}
              />
            </Link>
          ))}
          {(!withdrawals || withdrawals.length === 0) && (
            <p className="text-center text-gray-500">Nenhum saque realizado</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Balance;