import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

interface FiltersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  maxDistance: number;
  setMaxDistance: (value: number) => void;
}

export const FiltersModal = ({
  open,
  onOpenChange,
  sortBy,
  setSortBy,
  maxDistance,
  setMaxDistance,
}: FiltersModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Filtros</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <Label className="text-sm font-medium mb-2 block">
              Ordenar por
            </Label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="price">Preço</SelectItem>
                <SelectItem value="distance">Distância</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm font-medium mb-2 block">
              Distância máxima: {maxDistance}km
            </Label>
            <Slider
              value={[maxDistance]}
              onValueChange={([value]) => setMaxDistance(value)}
              max={20}
              step={1}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};