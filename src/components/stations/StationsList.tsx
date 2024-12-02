import { StationCard } from "./StationCard";
import { PriceStats } from "./PriceStats";
import type { Station } from "@/hooks/useStations";

interface StationsListProps {
  stations: Station[];
  selectedFuel: string;
}

export const StationsList = ({ stations, selectedFuel }: StationsListProps) => {
  if (!stations?.length) {
    return <div className="p-4 text-center">Nenhum posto encontrado.</div>;
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <PriceStats stations={stations} selectedFuel={selectedFuel} />
      {stations.map((station) => (
        <StationCard 
          key={station.id}
          station={station} 
          selectedFuel={selectedFuel}
        />
      ))}
    </div>
  );
};