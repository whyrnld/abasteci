import { useState } from 'react';
import { ChevronDown, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useLocation } from '@/contexts/LocationContext';
import { useToast } from '@/components/ui/use-toast';

export function LocationSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [address, setAddress] = useState('');
  const { location, getCurrentLocation, updateLocation } = useLocation();
  const { toast } = useToast();

  // Remove country from address
  const formattedAddress = location?.address ? location.address.split(',').slice(0, -1).join(',') : 'Carregando localização...';

  const handleManualLocation = async () => {
    if (!address) return;

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=AIzaSyD-nDc6tXCTKcFJvWQmWEFuKVKT7w7B9Wo`
      );

      const data = await response.json();

      if (data.results && data.results[0]) {
        const { lat, lng } = data.results[0].geometry.location;
        updateLocation({ lat, lng, address: data.results[0].formatted_address });
        setIsOpen(false);
        toast({
          title: "Localização atualizada",
          description: "Sua localização foi atualizada com sucesso.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar sua localização.",
      });
    }
  };

  return (
    <div className="flex items-center gap-2 max-w-[calc(100vw-120px)]">
      <div className="flex-1 flex items-center gap-2 min-w-0">
        <p className="text-white text-sm truncate">
          {formattedAddress}
        </p>
        <Button
          variant="ghost"
          size="sm"
          className="text-white p-0 h-auto shrink-0"
          onClick={() => setIsOpen(true)}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Localização</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 pt-4">
            <div className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => {
                  getCurrentLocation();
                  setIsOpen(false);
                }}
              >
                <Navigation className="mr-2 h-4 w-4" />
                Usar localização atual
              </Button>
              
              <div className="space-y-2">
                <p className="text-sm font-medium">Alterar localização</p>
                <Input
                  placeholder="Digite o CEP"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
                <Button onClick={handleManualLocation} className="w-full">
                  Confirmar
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}