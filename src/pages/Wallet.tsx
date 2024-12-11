import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BalanceCard from "@/components/BalanceCard";
import WithdrawalHistoryCard from "@/components/withdrawals/WithdrawalHistoryCard";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

const Wallet = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: wallet } = useQuery({
    queryKey: ['wallet', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('profile_id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const { data: withdrawals } = useQuery({
    queryKey: ['withdrawals', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('withdrawals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const lastWithdrawal = withdrawals?.[0];

  return (
    <div className="container max-w-2xl mx-auto p-4 space-y-4">
      <BalanceCard 
        balance={wallet?.balance || 0}
        pendingBalance={0}
      />
      
      <div className="flex justify-end">
        <Button onClick={() => navigate("/withdrawal-request")}>
          Solicitar Saque
        </Button>
      </div>

      {lastWithdrawal && (
        <WithdrawalHistoryCard 
          amount={lastWithdrawal.amount}
          date={new Date(lastWithdrawal.created_at).toLocaleDateString()}
          status={lastWithdrawal.status}
        />
      )}
    </div>
  );
};

export default Wallet;