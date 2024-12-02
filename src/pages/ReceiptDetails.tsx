import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";

const ReceiptDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: receipt, isLoading } = useQuery({
    queryKey: ['receipt', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('receipts')
        .select('*, stations(*)')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const getStatusInPortuguese = (status: string) => {
    const statusMap: Record<string, string> = {
      'processing': 'Em análise',
      'approved': 'Aprovado',
      'rejected': 'Recusado'
    };
    return statusMap[status] || status;
  };

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  if (!receipt) {
    return <div>Nota fiscal não encontrada</div>;
  }

  return (
    <div className="flex flex-col gap-6 pb-20 px-6 py-6">
      <section className="bg-gradient-to-r from-primary to-secondary p-6 pt-8 -mx-6 -mt-6 flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="text-white hover:text-white/80">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-white text-lg font-medium">Detalhes da Nota</h1>
      </section>

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h2 className="font-medium text-lg">{receipt.stations.name}</h2>
            <p className="text-gray-500 text-sm">Nota Fiscal</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Valor Total</span>
              <span className="font-medium">{formatCurrency(receipt.amount)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-500">Data de Envio</span>
              <span>{format(new Date(receipt.created_at), 'dd/MM/yyyy')}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-500">Status</span>
              <span className="capitalize">{getStatusInPortuguese(receipt.status)}</span>
            </div>
          </div>

          <div>
            <p className="text-gray-500 text-sm mb-1">Chave da Nota</p>
            <p className="font-mono text-sm break-all">{receipt.invoice_key}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ReceiptDetails;