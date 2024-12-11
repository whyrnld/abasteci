import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import BalanceCard from "@/components/BalanceCard";
import WithdrawalHistoryCard from "@/components/withdrawals/WithdrawalHistoryCard";

const Wallet = () => {
  const navigate = useNavigate();

  return (
    <div className="container max-w-2xl mx-auto p-4 space-y-4">
      <BalanceCard />
      
      <div className="flex justify-end">
        <Button onClick={() => navigate("/withdrawal-request")}>
          Solicitar Saque
        </Button>
      </div>

      <WithdrawalHistoryCard />
    </div>
  );
};

export default Wallet;