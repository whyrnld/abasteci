import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Wallet, Crown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface BalanceCardProps {
  balance: number;
  pendingBalance: number;
  isPremium?: boolean;
  isLoading?: boolean;
}

const BalanceCard = ({ balance, pendingBalance, isPremium, isLoading }: BalanceCardProps) => {
  if (isLoading) {
    return (
      <Card className="p-6 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex items-start justify-between">
          <div className="space-y-4 flex-1">
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-32" />
            </div>
            <div>
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-6 w-28" />
            </div>
          </div>
          <Skeleton className="w-6 h-6 rounded" />
        </div>
      </Card>
    );
  }

  return (
    <Link to="/balance">
      <Card className={`p-6 hover:shadow-md transition-shadow relative ${isPremium
        ? 'bg-gradient-to-br from-amber-50 via-amber-100 to-yellow-200 border-amber-200'
        : 'bg-gradient-to-r from-gray-50 to-white'
        }`}>
        {isPremium && (
          <div className="absolute -top-3 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 shadow-sm">
            <Crown className="w-4 h-4" />
            Premium
          </div>
        )}
        <div className="flex items-start justify-between">
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Saldo disponível</p>
              <p className={`text-2xl font-bold ${isPremium ? 'text-amber-800' : ''}`}>
                {formatCurrency(balance)}
              </p>
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