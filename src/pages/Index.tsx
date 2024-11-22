import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

const Index = () => {
  const balance = 15.50;
  const pendingBalance = 5.20;
  
  return (
    <div className="flex flex-col gap-6 pb-20">
      <section className="bg-primary p-6 -mx-6 -mt-6">
        <h1 className="text-white text-lg font-medium mb-2">Olá, João</h1>
        <Card className="p-4">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Saldo disponível</p>
              <p className="text-2xl font-bold">{formatCurrency(balance)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Saldo pendente</p>
              <p className="text-lg text-gray-600">{formatCurrency(pendingBalance)}</p>
            </div>
          </div>
        </Card>
      </section>

      <section>
        <h2 className="text-lg font-medium mb-4">Últimas transações</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">Posto Shell</p>
                  <p className="text-sm text-gray-500">12/03/2024</p>
                </div>
                <p className="text-primary font-medium">+ R$ 0,10</p>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;