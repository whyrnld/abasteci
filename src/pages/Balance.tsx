import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { ArrowLeft, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Balance = () => {
  const balance = 15.50;
  const withdrawals = [
    { id: 1, amount: 50.00, date: "10/03/2024", status: "completed" },
    { id: 2, amount: 30.00, date: "05/03/2024", status: "processing" },
  ];

  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6 pb-20">
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
        <Button 
          className="w-full"
          onClick={() => navigate('/withdrawal-request')}
        >
          Solicitar saque
        </Button>
      </Card>

      <div>
        <h2 className="text-lg font-medium mb-4">Histórico de saques</h2>
        <div className="space-y-3">
          {withdrawals.map((withdrawal) => (
            <Card key={withdrawal.id} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{formatCurrency(withdrawal.amount)}</p>
                  <p className="text-sm text-gray-500">{withdrawal.date}</p>
                </div>
                <span className="text-sm capitalize">{withdrawal.status}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Balance;