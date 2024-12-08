import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CheckCircle2, Clock, XCircle } from "lucide-react";
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'rejected':
        return 'text-red-600';
      default:
        return 'text-yellow-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-6 h-6 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-6 h-6 text-red-600" />;
      default:
        return <Clock className="w-6 h-6 text-yellow-600" />;
    }
  };

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
                <p className={`font-medium ${getStatusColor(withdrawal.status)}`}>
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
            <h3 className="font-medium mb-6">Histórico</h3>
            <div className="relative">
              <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-200" />
              
              <div className="space-y-8">
                {/* Criação do saque */}
                <div className="relative pl-8">
                  <div className="absolute left-0 w-4 h-4 bg-primary rounded-full" />
                  <div>
                    <p className="font-medium">Saque solicitado</p>
                    <p className="text-sm text-gray-500">
                      {new Date(withdrawal.created_at).toLocaleDateString()} às {' '}
                      {new Date(withdrawal.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                {/* Atualização do status */}
                {withdrawal.status !== 'pending' && (
                  <div className="relative pl-8">
                    <div className={`absolute left-0 w-4 h-4 rounded-full ${
                      withdrawal.status === 'completed' ? 'bg-green-500' : 'bg-red-500'
                    }`} />
                    <div>
                      <p className="font-medium">
                        {withdrawal.status === 'completed' ? 'Saque aprovado' : 'Saque rejeitado'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(withdrawal.updated_at).toLocaleDateString()} às {' '}
                        {new Date(withdrawal.updated_at).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default WithdrawalDetails;