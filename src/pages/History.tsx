import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReceiptCard from "@/components/ReceiptCard";
import { Check, Clock, X } from "lucide-react";

const History = () => {
  const receipts = [
    { id: 1, station: "Posto Shell", date: "12/03/2024", amount: 150.00, status: "approved" as const },
    { id: 2, station: "Posto Ipiranga", date: "10/03/2024", amount: 200.00, status: "processing" as const },
    { id: 3, station: "Posto BR", date: "08/03/2024", amount: 180.00, status: "rejected" as const },
  ];

  const statusIcons = {
    approved: <Check className="w-5 h-5 text-green-500" />,
    processing: <Clock className="w-5 h-5 text-yellow-500" />,
    rejected: <X className="w-5 h-5 text-red-500" />
  };

  return (
    <div className="flex flex-col gap-6 px-6 py-6">
      <section className="bg-gradient-to-r from-primary to-secondary p-6 pt-8 -mx-6 -mt-6">
        <h1 className="text-white text-lg font-medium">Notas fiscais</h1>
      </section>

      <Tabs defaultValue="all" className="w-full mt-4">
        <TabsList className="w-full grid grid-cols-4 h-auto p-1 bg-gray-100">
          <TabsTrigger value="all" className="text-sm py-2">Todos</TabsTrigger>
          <TabsTrigger value="approved" className="text-sm py-2">Aprovados</TabsTrigger>
          <TabsTrigger value="completed" className="text-sm py-2">Concluídos</TabsTrigger>
          <TabsTrigger value="rejected" className="text-sm py-2">Recusados</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6 space-y-3">
          {receipts.map((receipt) => (
            <ReceiptCard key={receipt.id} {...receipt} />
          ))}
        </TabsContent>

        <TabsContent value="approved" className="mt-6 space-y-3">
          {receipts.filter(r => r.status === "approved").map((receipt) => (
            <ReceiptCard key={receipt.id} {...receipt} />
          ))}
        </TabsContent>

        <TabsContent value="completed" className="mt-6 space-y-3">
          {receipts.filter(r => r.status === "approved").map((receipt) => (
            <ReceiptCard key={receipt.id} {...receipt} />
          ))}
        </TabsContent>

        <TabsContent value="rejected" className="mt-6 space-y-3">
          {receipts.filter(r => r.status === "rejected").map((receipt) => (
            <ReceiptCard key={receipt.id} {...receipt} />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default History;