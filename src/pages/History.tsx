import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReceiptCard from "@/components/ReceiptCard";
import { useReceipts } from "@/hooks/useReceipts";
import { format } from "date-fns";

const History = () => {
  const { receipts, isLoading } = useReceipts();

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 px-6 py-6">
        <section className="bg-gradient-to-r from-primary to-secondary p-6 pt-8 -mx-6 -mt-6">
          <h1 className="text-white text-lg font-medium">Notas fiscais</h1>
        </section>
        <div>Carregando...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 px-6 py-6">
      <section className="bg-gradient-to-r from-primary to-secondary p-6 pt-8 -mx-6 -mt-6">
        <h1 className="text-white text-lg font-medium">Notas fiscais</h1>
      </section>

      <Tabs defaultValue="all" className="w-full mt-4">
        <TabsList className="w-full grid grid-cols-4 h-auto p-1 bg-gray-100">
          <TabsTrigger value="all" className="text-sm py-2">Todos</TabsTrigger>
          <TabsTrigger value="approved" className="text-sm py-2">Aprovados</TabsTrigger>
          <TabsTrigger value="processing" className="text-sm py-2">Em análise</TabsTrigger>
          <TabsTrigger value="rejected" className="text-sm py-2">Recusados</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {receipts?.map((receipt) => (
            <ReceiptCard
              key={receipt.id}
              id={receipt.id}
              station={receipt.stations.name}
              amount={receipt.amount}
              date={format(new Date(receipt.created_at), 'dd/MM/yyyy')}
              status={receipt.status as "processing" | "approved" | "rejected"}
            />
          ))}
        </TabsContent>

        <TabsContent value="approved" className="mt-6">
          {receipts
            ?.filter((r) => r.status === "approved")
            .map((receipt) => (
              <ReceiptCard
                key={receipt.id}
                id={receipt.id}
                station={receipt.stations.name}
                amount={receipt.amount}
                date={format(new Date(receipt.created_at), 'dd/MM/yyyy')}
                status={receipt.status as "processing" | "approved" | "rejected"}
              />
            ))}
        </TabsContent>

        <TabsContent value="processing" className="mt-6">
          {receipts
            ?.filter((r) => r.status === "processing")
            .map((receipt) => (
              <ReceiptCard
                key={receipt.id}
                id={receipt.id}
                station={receipt.stations.name}
                amount={receipt.amount}
                date={format(new Date(receipt.created_at), 'dd/MM/yyyy')}
                status={receipt.status as "processing" | "approved" | "rejected"}
              />
            ))}
        </TabsContent>

        <TabsContent value="rejected" className="mt-6">
          {receipts
            ?.filter((r) => r.status === "rejected")
            .map((receipt) => (
              <ReceiptCard
                key={receipt.id}
                id={receipt.id}
                station={receipt.stations.name}
                amount={receipt.amount}
                date={format(new Date(receipt.created_at), 'dd/MM/yyyy')}
                status={receipt.status as "processing" | "approved" | "rejected"}
              />
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default History;