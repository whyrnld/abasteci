import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReceiptCard from "@/components/ReceiptCard";
import { useReceipts } from "@/hooks/useReceipts";
import { format } from "date-fns";
import { useRef } from "react";

const History = () => {
  const { receipts, isLoading } = useReceipts();
  const tabsListRef = useRef<HTMLDivElement>(null);

  const handleScroll = (event: React.WheelEvent<HTMLDivElement>) => {
    if (tabsListRef.current) {
      event.preventDefault();
      tabsListRef.current.scrollLeft += event.deltaY;
    }
  };

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
        <div className="relative">
          <TabsList
            ref={tabsListRef}
            onWheel={handleScroll}
            className="w-full h-auto p-1 flex overflow-x-auto scrollbar-none gap-2 border rounded-full"
          >
            <TabsTrigger
              value="all"
              className="flex-none px-4 py-2 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Todos
            </TabsTrigger>
            <TabsTrigger
              value="approved"
              className="flex-none px-4 py-2 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Aprovados
            </TabsTrigger>
            <TabsTrigger
              value="processing"
              className="flex-none px-4 py-2 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Em análise
            </TabsTrigger>
            <TabsTrigger
              value="rejected"
              className="flex-none px-4 py-2 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Recusados
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="my-6">
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