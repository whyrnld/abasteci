import { StationCard } from "./StationCard";
import { PriceStats } from "./PriceStats";

interface Station {
  id: number;
  name: string;
  distance: string;
  address: string;
  prices: {
    regular: number;
    premium: number;
    ethanol: number;
    diesel: number;
  };
  lastUpdate: string;
}

interface StationsListProps {
  stations: Station[];
  selectedFuel: string;
  isLoading: boolean;
}

export const StationsList = ({ stations, selectedFuel, isLoading }: StationsListProps) => {
  if (isLoading) {
    return <div className="p-4 text-center">Carregando...</div>;
  }

  if (!stations?.length) {
    return <div className="p-4 text-center">Nenhum posto encontrado.</div>;
  }

  return (
    <div className="space-y-6">
      <PriceStats stations={stations} selectedFuel={selectedFuel} />
      {stations.map((station) => (
        <div key={station.id}>
          <StationCard station={station} selectedFuel={selectedFuel} />
        </div>
      ))}
    </div>
  );
};