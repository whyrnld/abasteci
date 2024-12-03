import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sliders } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface PreferencesSectionProps {
  preferredFuel: string;
  searchRadius: number;
  setPreferredFuel: (value: string) => void;
  setSearchRadius: (value: number) => void;
  handleSavePreferences: () => void;
}

export const PreferencesSection = ({
  preferredFuel,
  searchRadius,
  setPreferredFuel,
  setSearchRadius,
  handleSavePreferences,
}: PreferencesSectionProps) => {
  return (
    <Card className="p-4">
      <h3 className="font-medium mb-4 flex items-center gap-2">
        <Sliders className="w-5 h-5" />
        Preferências
      </h3>
      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-500 mb-2 block">
            Combustível preferido
          </label>
          <Select value={preferredFuel} onValueChange={setPreferredFuel}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="regular">Gasolina Comum</SelectItem>
              <SelectItem value="premium">Gasolina Premium</SelectItem>
              <SelectItem value="ethanol">Etanol</SelectItem>
              <SelectItem value="diesel">Diesel</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm text-gray-500 mb-2 block">
            Raio de busca: {searchRadius}km
          </label>
          <Slider
            value={[searchRadius]}
            onValueChange={([value]) => setSearchRadius(value)}
            max={100}
            step={1}
          />
        </div>
        <Button onClick={handleSavePreferences} className="w-full">
          Salvar Preferências
        </Button>
      </div>
    </Card>
  );
};