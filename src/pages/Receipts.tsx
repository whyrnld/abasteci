import { useReceipts } from "@/hooks/useReceipts";
import ReceiptCard from "@/components/ReceiptCard";

const Receipts = () => {
  const { receipts, isLoading } = useReceipts();

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="container max-w-2xl mx-auto p-4 space-y-4">
      <h2 className="text-2xl font-bold">Minhas Notas Fiscais</h2>
      <div className="space-y-4">
        {receipts?.map((receipt) => (
          <ReceiptCard key={receipt.id} receipt={receipt} />
        ))}
        {receipts?.length === 0 && (
          <p className="text-center text-gray-500">
            Você ainda não enviou nenhuma nota fiscal
          </p>
        )}
      </div>
    </div>
  );
};

export default Receipts;