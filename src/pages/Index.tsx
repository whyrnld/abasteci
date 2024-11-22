import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Index = () => {
  const balance = 15.50;
  const pendingBalance = 5.20;
  
  const nearbyStations = [
    {
      id: 1,
      name: "Posto Shell",
      distance: "1.2km",
      price: 5.49,
      lastUpdate: "Há 2 horas",
    },
    {
      id: 2,
      name: "Posto Ipiranga",
      distance: "1.8km",
      price: 5.39,
      lastUpdate: "Há 3 horas",
    },
    {
      id: 3,
      name: "Posto BR",
      distance: "2.1km",
      price: 5.45,
      lastUpdate: "Há 4 horas",
    },
  ];

  const receipts = [
    {
      id: 1,
      station: "Posto Shell",
      amount: 150.00,
      submissionDate: "12/03/2024",
      confirmationDate: "13/03/2024",
      status: "approved",
      invoiceKey: "1234 5678 9012 3456 7890 1234 5678 9012 3456 7890 1234",
    },
    {
      id: 2,
      station: "Posto Ipiranga",
      amount: 200.00,
      submissionDate: "10/03/2024",
      status: "rejected",
      reason: "Nota fiscal inválida",
      invoiceKey: "9876 5432 1098 7654 3210 9876 5432 1098 7654 3210 9876",
    },
  ];
  
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
        <h2 className="text-lg font-medium mb-4">Postos mais próximos</h2>
        <div className="space-y-3">
          {nearbyStations.map((station, index) => (
            <Link 
              key={station.id} 
              to={index === nearbyStations.length - 1 ? "/stations" : `/stations/${station.id}`}
              className="block"
            >
              <Card className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{station.name}</p>
                        <p className="text-sm text-gray-500">{station.lastUpdate}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-primary font-medium">
                          {formatCurrency(station.price)}
                        </p>
                        <p className="text-sm text-gray-500">{station.distance}</p>
                      </div>
                    </div>
                  </div>
                </div>
                {index === nearbyStations.length - 1 && (
                  <div className="mt-3 text-center">
                    <Button variant="outline" className="w-full">
                      Ver todos os postos
                    </Button>
                  </div>
                )}
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-medium mb-4">Notas Fiscais</h2>
        <Tabs defaultValue="approved" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="approved" className="flex-1">Aprovadas</TabsTrigger>
            <TabsTrigger value="rejected" className="flex-1">Rejeitadas</TabsTrigger>
          </TabsList>
          <TabsContent value="approved">
            <div className="space-y-3 mt-4">
              {receipts
                .filter(receipt => receipt.status === "approved")
                .map(receipt => (
                  <Card key={receipt.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{receipt.station}</p>
                        <p className="text-sm text-gray-500">{receipt.submissionDate}</p>
                        <p className="text-xs text-gray-400 mt-1">Confirmado em: {receipt.confirmationDate}</p>
                        <p className="text-xs font-mono text-gray-400 mt-1 break-all">
                          {receipt.invoiceKey}
                        </p>
                      </div>
                      <p className="text-primary font-medium">
                        {formatCurrency(receipt.amount)}
                      </p>
                    </div>
                  </Card>
                ))}
            </div>
          </TabsContent>
          <TabsContent value="rejected">
            <div className="space-y-3 mt-4">
              {receipts
                .filter(receipt => receipt.status === "rejected")
                .map(receipt => (
                  <Card key={receipt.id} className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{receipt.station}</p>
                        <p className="text-sm text-gray-500">{receipt.submissionDate}</p>
                        <p className="text-xs text-red-500 mt-1">Motivo: {receipt.reason}</p>
                        <p className="text-xs font-mono text-gray-400 mt-1 break-all">
                          {receipt.invoiceKey}
                        </p>
                      </div>
                      <p className="text-primary font-medium">
                        {formatCurrency(receipt.amount)}
                      </p>
                    </div>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      <section>
        <Card className="p-4 bg-gradient-to-r from-primary to-primary/80 text-white">
          <h3 className="text-lg font-medium mb-2">Premium</h3>
          <p className="text-sm mb-4">Desbloqueie recursos exclusivos por apenas R$ 9,99/mês</p>
          <ul className="text-sm space-y-2 mb-4">
            <li>• Envie mais notas fiscais</li>
            <li>• Sem valor mínimo para resgate</li>
          </ul>
          <Button variant="secondary" className="w-full">
            Assinar Premium
          </Button>
        </Card>
      </section>

      <section>
        <Card className="p-4">
          <h3 className="text-lg font-medium mb-2">Indique e Ganhe</h3>
          <p className="text-sm text-gray-500 mb-4">
            Ganhe R$ 5,00 para cada amigo que se cadastrar usando seu código
          </p>
          <Button variant="outline" className="w-full">
            Compartilhar código
          </Button>
        </Card>
      </section>
    </div>
  );
};

export default Index;