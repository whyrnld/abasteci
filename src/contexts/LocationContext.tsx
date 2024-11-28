import { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface Location {
  lat: number;
  lng: number;
  address?: string;
}

interface LocationContextType {
  location: Location | null;
  isLoading: boolean;
  error: string | null;
  updateLocation: (newLocation: Location) => void;
  getCurrentLocation: () => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const updateLocation = (newLocation: Location) => {
    setLocation(newLocation);
  };

  const getCurrentLocation = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude: lat, longitude: lng } = position.coords;
      
      // Get address using Google Geocoding API
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=AIzaSyD-nDc6tXCTKcFJvWQmWEFuKVKT7w7B9Wo`
      );
      
      const data = await response.json();
      const address = data.results[0]?.formatted_address;

      setLocation({ lat, lng, address });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get location';
      setError(message);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Não foi possível obter sua localização.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <LocationContext.Provider
      value={{
        location,
        isLoading,
        error,
        updateLocation,
        getCurrentLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}