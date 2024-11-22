import { QrCode } from "lucide-react";
import { Card } from "@/components/ui/card";

const Scanner = () => {
  return (
    <div className="flex flex-col gap-6 pb-20">
      <section className="bg-primary p-6 -mx-6 -mt-6">
        <h1 className="text-white text-lg font-medium mb-2">Scanner QR Code</h1>
      </section>

      <Card className="flex flex-col items-center justify-center p-8 gap-4">
        <QrCode className="w-16 h-16 text-primary" />
        <p className="text-gray-600">Posicione o QR Code do cupom fiscal dentro da área de leitura</p>
      </Card>

      <div className="space-y-4">
        <h2 className="text-lg font-medium">Regras</h2>
        <Card className="p-4 space-y-2">
          <p className="text-sm text-gray-600">• Limite de 3 cupons por semana</p>
          <p className="text-sm text-gray-600">• R$ 0,10 de cashback por cupom</p>
          <p className="text-sm text-gray-600">• Processamento em até 15 dias</p>
          <p className="text-sm text-gray-600">• Saque mínimo: R$ 20,00</p>
        </Card>
      </div>
    </div>
  );
};

export default Scanner;