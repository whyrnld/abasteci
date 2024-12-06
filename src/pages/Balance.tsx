import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { ArrowLeft, Wallet } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

const Balance = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

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
            <p className="text-2xl font-bold">{formatCurrency(walletData?.balance || 0)}</p>
          </div>
          <Wallet className="w-8 h-8 text-primary" />
        </div>
        <Button 
          className="w-full"
          onClick={() => navigate('/withdrawal-request')}
          disabled={!walletData?.balance || walletData.balance <= 0}
        >
          Solicitar saque
        </Button>
      </Card>

      <div>
        <h2 className="text-lg font-medium mb-4">Histórico de saques</h2>
        <div className="space-y-3">
          {withdrawals?.map((withdrawal) => (
            <Link key={withdrawal.id} to={`/withdrawals/${withdrawal.id}`}>
              <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{formatCurrency(withdrawal.amount)}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(withdrawal.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`text-sm capitalize ${
                    withdrawal.status === 'pending' ? 'text-yellow-600' : 
                    withdrawal.status === 'completed' ? 'text-green-600' : 
                    'text-red-600'
                  }`}>
                    {withdrawal.status}
                  </span>
                </div>
              </Card>
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