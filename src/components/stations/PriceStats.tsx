import { TrendingDown, TrendingUp, ArrowRightLeft } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

interface PriceStatsProps {
  stations: Array<{
    prices: {
      regular: number;
      premium: number;
      ethanol: number;
      diesel: number;
    };
  }>;
  selectedFuel: string;
}

export const PriceStats = ({ stations, selectedFuel }: PriceStatsProps) => {
  const prices = stations.map(station => {
    switch (selectedFuel) {
      case "regular":
        return station.prices.regular;
      case "premium":
        return station.prices.premium;
      case "ethanol":
        return station.prices.ethanol;
      case "diesel":
        return station.prices.diesel;
      default:
        return station.prices.regular;
    }
  });

  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const difference = maxPrice - minPrice;

  return (
    <div className="grid grid-cols-3 gap-3 mb-6">
      <Card className="p-4 bg-gradient-to-br from-green-50 to-white">
        <div className="flex flex-col items-center gap-1">
          <TrendingDown className="w-5 h-5 text-green-600" />
          <p className="text-xs text-gray-600">Menor</p>
          <p className="font-medium text-green-700">{formatCurrency(minPrice)}</p>
        </div>
      </Card>
      <Card className="p-4 bg-gradient-to-br from-blue-50 to-white">
        <div className="flex flex-col items-center gap-1">
          <ArrowRightLeft className="w-5 h-5 text-blue-600" />
          <p className="text-xs text-gray-600">Diferença</p>
          <p className="font-medium text-blue-700">{formatCurrency(difference)}</p>
        </div>
      </Card>
      <Card className="p-4 bg-gradient-to-br from-red-50 to-white">
        <div className="flex flex-col items-center gap-1">
          <TrendingUp className="w-5 h-5 text-red-600" />
          <p className="text-xs text-gray-600">Maior</p>
          <p className="font-medium text-red-700">{formatCurrency(maxPrice)}</p>
        </div>
      </Card>
    </div>
  );
};