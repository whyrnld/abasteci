import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import type { Station } from "@/hooks/useStations";
import { useState, useEffect } from "react";

interface StationCardProps {
  station: Station;
  selectedFuel: string;
}

export const StationCard = ({ station, selectedFuel }: StationCardProps) => {
  const [distance, setDistance] = useState<string>("--");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          
          // Calculate distance using Haversine formula
          const R = 6371; // Earth's radius in km
          const dLat = (station.latitude - userLat) * Math.PI / 180;
          const dLon = (station.longitude - userLng) * Math.PI / 180;
          const a = 
            Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(userLat * Math.PI / 180) * Math.cos(station.latitude * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          const calculatedDistance = R * c;
          
          // Store the calculated distance in the station object
          station.calculatedDistance = calculatedDistance;
          setDistance(`${calculatedDistance.toFixed(1)}km`);
        },
        (error) => {
          console.error("Error getting location:", error);
          setDistance("--");
        }
      );
    }
  }, [station]);

  // Remove country name from address
  const formattedAddress = station.address.split(',').slice(0, -1).join(',');

  return (
    <Link to={`/stations/${station.id}`} className="block">
      <Card className="p-4 hover:shadow-md transition-shadow">
        <div className="flex gap-3">
          <img 
            src={station.image_url || 'https://images.unsplash.com/photo-1483058712412-4245e9b90334'} 
            alt={station.name} 
            className="w-10 h-10 object-cover rounded-full"
          />
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <p className="font-medium">{station.name}</p>
              <p className="text-xs text-gray-500">{distance}</p>
            </div>
            <p className="text-xs text-gray-500 mt-1">{formattedAddress}</p>
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm text-primary">
                Comum: R$ {station.prices.regular.toFixed(2)}
              </p>
              <p className="text-sm text-primary">
                Aditivada: R$ {station.prices.premium.toFixed(2)}
              </p>
            </div>
            {station.cnpj && (
              <p className="text-xs text-gray-400 mt-1">CNPJ: {station.cnpj}</p>
            )}
            <p className="text-xs text-gray-400 mt-1">{station.lastUpdate}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
};