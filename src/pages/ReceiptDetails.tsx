import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const ReceiptDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data - In a real app, fetch this based on the ID
  const receipt = {
    id: 1,
    station: "Posto Shell",
    amount: 150.00,
    submissionDate: "12/03/2024",
    confirmationDate: "13/03/2024",
    status: "approved",
    invoiceKey: "1234 5678 9012 3456 7890 1234 5678 9012 3456 7890 1234",
    items: [
      { name: "Gasolina Comum", price: 5.49, quantity: 27.32 },
    ]
  };

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
            <h2 className="font-medium text-lg">{receipt.station}</h2>
            <p className="text-gray-500 text-sm">Nota Fiscal</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Valor Total</span>
              <span className="font-medium">{formatCurrency(receipt.amount)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-500">Data de Envio</span>
              <span>{receipt.submissionDate}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-500">Data de Confirmação</span>
              <span>{receipt.confirmationDate}</span>
            </div>
          </div>

          <div>
            <p className="text-gray-500 text-sm mb-1">Chave da Nota</p>
            <p className="font-mono text-sm break-all">{receipt.invoiceKey}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm mb-2">Itens</p>
            {receipt.items.map((item, index) => (
              <div key={index} className="flex justify-between py-2 border-t">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.quantity} L x {formatCurrency(item.price)}</p>
                </div>
                <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ReceiptDetails;