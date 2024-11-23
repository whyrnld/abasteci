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
    <div className="grid grid-cols-3 gap-4 mb-6">
      <div className="text-center">
        <p className="text-sm text-gray-500">Menor</p>
        <p className="font-medium">R$ {minPrice.toFixed(2)}</p>
      </div>
      <div className="text-center">
        <p className="text-sm text-gray-500">Maior</p>
        <p className="font-medium">R$ {maxPrice.toFixed(2)}</p>
      </div>
      <div className="text-center">
        <p className="text-sm text-gray-500">Diferença</p>
        <p className="font-medium">R$ {difference.toFixed(2)}</p>
      </div>
    </div>
  );
};