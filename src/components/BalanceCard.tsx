import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Link } from "react-router-dom";

interface BalanceCardProps {
  balance: number;
  pendingBalance: number;
}

const BalanceCard = ({ balance, pendingBalance }: BalanceCardProps) => {
  return (
    <Link to="/balance">
      <Card className="p-4 hover:shadow-md transition-shadow">
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
    </Link>
  );
};

export default BalanceCard;