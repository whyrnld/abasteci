import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Wallet } from "lucide-react";

interface BalanceCardProps {
  balance: number;
  pendingBalance: number;
  isPremium?: boolean;
}

const BalanceCard = ({ balance, pendingBalance, isPremium }: BalanceCardProps) => {
  return (
    <Link to="/balance">
      <Card className={`p-6 hover:shadow-md transition-shadow ${
        isPremium 
          ? 'bg-gradient-to-r from-amber-100 via-yellow-100 to-amber-100 border-amber-200'
          : 'bg-gradient-to-r from-gray-50 to-white'
      }`}>
        <div className="flex items-start justify-between">
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
          <Wallet className={`w-6 h-6 ${isPremium ? 'text-amber-600' : 'text-black'}`} />
        </div>
      </Card>
    </Link>
  );
};

export default BalanceCard;