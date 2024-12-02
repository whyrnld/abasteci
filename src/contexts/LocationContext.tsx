import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';

interface Location {
  lat: number;
  lng: number;
  address?: string;
  timestamp?: number;
}

interface LocationContextType {
  location: Location | null;
  isLoading: boolean;
  error: string | null;
  updateLocation: (newLocation: Location) => void;
  getCurrentLocation: () => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

const GOOGLE_API_KEY = 'AIzaSyD-nDc6tXCTKcFJvWQmWEFuKVKT7w7B9Wo';
const LOCATION_UPDATE_INTERVAL = 30 * 60 * 1000; // 30 minutos
const SIGNIFICANT_DISTANCE = 0.1; // 100 metros em km

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Raio da Terra em km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

async function getAddressFromCoords(lat: number, lng: number): Promise<string | undefined> {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`
    );
    const data = await response.json();
    
    if (data.status === 'OK' && data.results && data.results[0]) {
      return data.results[0].formatted_address;
    }
    return undefined;
  } catch (error) {
    console.error('Error getting address:', error);
    return undefined;
  }
}

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<Location | null>(() => {
    const savedLocation = localStorage.getItem('lastKnownLocation');
    if (savedLocation) {
      const parsed = JSON.parse(savedLocation);
      // Se a localização salva for muito antiga, retorna null
      if (parsed.timestamp && Date.now() - parsed.timestamp > LOCATION_UPDATE_INTERVAL) {
        return null;
      }
      return parsed;
    }
    return null;
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const mounted = useRef(true);
  const { toast } = useToast();
  const watchId = useRef<number | null>(null);
  const lastUpdateTime = useRef<number>(0);

  const shouldUpdateLocation = useCallback((newLat: number, newLng: number): boolean => {
    if (!location) return true;
    
    const timeSinceLastUpdate = Date.now() - (lastUpdateTime.current || 0);
    if (timeSinceLastUpdate < LOCATION_UPDATE_INTERVAL) {
      return false;
    }

    const distance = calculateDistance(location.lat, location.lng, newLat, newLng);
    return distance > SIGNIFICANT_DISTANCE;
  }, [location]);

  const handleSuccess = useCallback(
    async (position: GeolocationPosition) => {
      if (!mounted.current) return;

      const { latitude, longitude } = position.coords;
      
      // Verifica se deve atualizar a localização
      if (!shouldUpdateLocation(latitude, longitude)) {
        setIsLoading(false); // Garante que loading é false mesmo quando não atualiza
        return;
      }

      setIsLoading(true); // Indica que está buscando o endereço

      // Busca o endereço primeiro
      const address = await getAddressFromCoords(latitude, longitude);
      
      const newLocation: Location = {
        lat: latitude,
        lng: longitude,
        timestamp: Date.now(),
        address: address // Adiciona o endereço à localização
      };
      
      console.log('Location obtained:', newLocation);
      
      localStorage.setItem('lastKnownLocation', JSON.stringify(newLocation));
      setLocation(newLocation);
      setError(null);
      setIsLoading(false);
      lastUpdateTime.current = Date.now();
    },
    [shouldUpdateLocation]
  );

  const handleError = useCallback((error: GeolocationPositionError) => {
    if (!mounted.current) return;

    console.error('Geolocation error:', error);
    let errorMessage = 'Erro ao obter localização';
    
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = 'Permissão de localização negada';
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = 'Localização indisponível';
        break;
      case error.TIMEOUT:
        errorMessage = 'Tempo esgotado ao obter localização';
        break;
    }
    
    setError(errorMessage);
    setIsLoading(false);
    
    toast({
      variant: "destructive",
      title: "Erro",
      description: errorMessage,
    });
  }, [toast]);

  const updateLocation = useCallback(async (newLocation: Location) => {
    // Se não tiver endereço, tenta buscar
    if (!newLocation.address) {
      const address = await getAddressFromCoords(newLocation.lat, newLocation.lng);
      if (address) {
        newLocation.address = address;
      }
    }
    
    setLocation(newLocation);
    localStorage.setItem('lastKnownLocation', JSON.stringify(newLocation));
    setError(null);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    mounted.current = true;
    
    if (!navigator.geolocation) {
      setError('Geolocalização não suportada neste navegador');
      return;
    }

    const options: PositionOptions = {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: LOCATION_UPDATE_INTERVAL // Usa o mesmo intervalo de atualização
    };

    // Só busca localização inicial se não tiver uma localização válida
    if (!location || !location.timestamp || Date.now() - location.timestamp > LOCATION_UPDATE_INTERVAL) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(handleSuccess, handleError, options);
    } else {
      setIsLoading(false); // Garante que loading é false quando usa cache
    }

    // Watch com intervalo maior e menor precisão para economizar bateria
    watchId.current = navigator.geolocation.watchPosition(
      handleSuccess,
      handleError,
      { 
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: LOCATION_UPDATE_INTERVAL
      }
    );

    return () => {
      mounted.current = false;
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
        watchId.current = null;
      }
    };
  }, [handleSuccess, handleError, location]);

  const getCurrentLocation = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      if (!navigator.geolocation) {
        const error = 'Geolocalização não suportada neste navegador';
        setError(error);
        reject(new Error(error));
        return;
      }

      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          await handleSuccess(position);
          resolve();
        },
        (error) => {
          handleError(error);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  }, [handleSuccess, handleError]);

  const value = useMemo(
    () => ({
      location,
      error,
      isLoading,
      updateLocation,
      getCurrentLocation
    }),
    [location, error, isLoading, updateLocation, getCurrentLocation]
  );

  return <LocationContext.Provider value={value}>{children}</LocationContext.Provider>;
};

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}