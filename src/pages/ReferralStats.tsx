import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Card } from "@/components/ui/card";
import { Users, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface Referral {
  id: number;
  referred: {
    full_name: string;
    created_at: string;
  };
  status: string;
  bonus_paid: boolean;
  created_at: string;
}

const ReferralStats = () => {
  const navigate = useNavigate();
  const [totalEarned, setTotalEarned] = useState(0);

  const { data: referrals, isLoading } = useQuery({
    queryKey: ["referrals"],
    queryFn: async () => {
      const { data: referralsData, error } = await supabase
        .from("referrals")
        .select(`
          id,
          status,
          bonus_paid,
          created_at,
          referred:referred_id(
            full_name,
            created_at
          )
        `)
        .eq("referrer_id", (await supabase.auth.getUser()).data.user?.id);

      if (error) throw error;

      // Calculate total earned
      const total = referralsData.filter(r => r.bonus_paid).length * 5;
      setTotalEarned(total);

      return referralsData as Referral[];
    },
  });

  return (
    <div className="flex flex-col gap-6 px-6 py-6 pb-24">
      <section className="bg-gradient-to-r from-primary to-secondary p-6 -mx-6 -mt-6 flex items-center gap-2">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="text-white p-2"
        >
          <ArrowLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-white text-lg font-medium">Minhas Indicações</h1>
      </section>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-8 h-8 text-primary" />
          <div>
            <h2 className="text-xl font-medium">Estatísticas</h2>
            <p className="text-sm text-gray-500">
              Acompanhe suas indicações
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Total de Indicações</p>
            <p className="text-2xl font-medium">
              {isLoading ? "..." : referrals?.length || 0}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-500">Total Ganho</p>
            <p className="text-2xl font-medium">R$ {totalEarned.toFixed(2)}</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Histórico de Indicações</h3>
          {isLoading ? (
            <p className="text-center text-gray-500">Carregando...</p>
          ) : referrals?.length === 0 ? (
            <p className="text-center text-gray-500">
              Você ainda não tem indicações
            </p>
          ) : (
            <div className="space-y-3">
              {referrals?.map((referral) => (
                <Card key={referral.id} className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{referral.referred.full_name}</p>
                      <p className="text-sm text-gray-500">
                        Indicado em{" "}
                        {format(
                          new Date(referral.created_at),
                          "dd/MM/yyyy"
                        )}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-sm px-2 py-1 rounded-full ${
                          referral.bonus_paid
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {referral.bonus_paid ? "Bônus Pago" : "Pendente"}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ReferralStats;