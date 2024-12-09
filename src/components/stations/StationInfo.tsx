import { Clock } from "lucide-react";
import { format } from "date-fns";

interface StationInfoProps {
  address: string;
  updatedAt: string;
  distance?: number;
}

export const StationInfo = ({ address, updatedAt, distance }: StationInfoProps) => {
  const estimatedTime = distance ? Math.round(distance * 2) : null;

  return (
    <div className="flex justify-between items-start mb-4">
      <div className="flex-1">
        <p className="text-sm text-gray-500 mb-2">{address}</p>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>Atualizado em {format(new Date(updatedAt), "dd/MM/yyyy HH:mm")}</span>
        </div>
      </div>
      {distance && (
        <div className="text-right">
          <p className="text-sm font-medium">{distance.toFixed(1)} km</p>
          {estimatedTime && (
            <p className="text-xs text-gray-500">~{estimatedTime} min</p>
          )}
        </div>
      )}
    </div>
  );
};