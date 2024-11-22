import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

const History = () => {
  const transactions = [
    { id: 1, station: "Posto Shell", date: "12/03/2024", amount: 0.10, status: "Aprovado" },
    { id: 2, station: "Posto Ipiranga", date: "10/03/2024", amount: 0.10, status: "Processando" },
    { id: 3, station: "Posto BR", date: "08/03/2024", amount: 0.10, status: "Aprovado" },
  ];

  return (
    <div className="flex flex-col gap-6 pb-20">
      <section className="bg-primary p-6 -mx-6 -mt-6">
        <h1 className="text-white text-lg font-medium mb-2">Histórico</h1>
      </section>

      <div className="space-y-3">
        {transactions.map((transaction) => (
          <Card key={transaction.id} className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">{transaction.station}</p>
                <p className="text-sm text-gray-500">{transaction.date}</p>
              </div>
              <div className="text-right">
                <p className="text-primary font-medium">
                  {formatCurrency(transaction.amount)}
                </p>
                <p className="text-sm text-gray-500">{transaction.status}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default History;