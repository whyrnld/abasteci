import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import ReferralCard from "@/components/ReferralCard";
import ReceiptCard from "@/components/ReceiptCard";
import BalanceCard from "@/components/BalanceCard";
import PremiumCard from "@/components/PremiumCard";

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="p-6 flex flex-col gap-4">
        <h1 className="text-2xl font-bold">Bem-vindo!</h1>
        <p className="text-gray-600">
          Faça login ou crie uma conta para começar a economizar.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <Button onClick={() => navigate("/auth/login")}>Login</Button>
          <Button onClick={() => navigate("/auth/register")} variant="outline">
            Criar Conta
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 pb-20">
      <BalanceCard />
      <ReceiptCard />
      <ReferralCard />
      <PremiumCard />
    </div>
  );
};

export default Home;