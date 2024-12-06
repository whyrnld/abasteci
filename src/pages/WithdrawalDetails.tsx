import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { formatCurrency } from "@/lib/utils";

const WithdrawalDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: withdrawal } = useQuery({
    queryKey: ['withdrawal', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('withdrawals')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  return (
    <div className="flex flex-col gap-6 pb-20 px-6 py-6">
      <section className="bg-gradient-to-r from-primary to-secondary p-6 -mx-6 -mt-6 flex items-center gap-2">
        <Button variant="ghost" onClick={() => navigate(-1)} className="text-white p-2">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-white text-lg font-medium">Detalhes do Saque</h1>
      </section>

      {withdrawal && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Valor do saque</p>
                <p className="text-2xl font-bold">{formatCurrency(withdrawal.amount)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className={`font-medium ${
                  withdrawal.status === 'pending' ? 'text-yellow-600' : 
                  withdrawal.status === 'completed' ? 'text-green-600' : 
                  'text-red-600'
                }`}>
                  {withdrawal.status === 'pending' ? 'Pendente' :
                   withdrawal.status === 'completed' ? 'Aprovado' :
                   'Rejeitado'}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-medium mb-4">Informações PIX</h3>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-500">Tipo de chave</p>
                <p className="font-medium">{withdrawal.pix_key_type}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Chave PIX</p>
                <p className="font-medium">{withdrawal.pix_key}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-medium mb-4">Histórico</h3>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-500">Solicitado em</p>
                <p className="font-medium">
                  {new Date(withdrawal.created_at).toLocaleDateString()} às {' '}
                  {new Date(withdrawal.created_at).toLocaleTimeString()}
                </p>
              </div>
              {withdrawal.status !== 'pending' && (
                <div>
                  <p className="text-sm text-gray-500">Atualizado em</p>
                  <p className="font-medium">
                    {new Date(withdrawal.updated_at).toLocaleDateString()} às {' '}
                    {new Date(withdrawal.updated_at).toLocaleTimeString()}
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default WithdrawalDetails;