import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PixSectionProps {
  defaultPixKey: string;
  defaultPixKeyType: string;
  setDefaultPixKey: (value: string) => void;
  setDefaultPixKeyType: (value: string) => void;
  handleSavePreferences: () => void;
}

export const PixSection = ({
  defaultPixKey,
  defaultPixKeyType,
  setDefaultPixKey,
  setDefaultPixKeyType,
  handleSavePreferences,
}: PixSectionProps) => {
  return (
    <Card className="p-4">
      <h3 className="font-medium mb-4">Chave PIX Padrão</h3>
      <div className="space-y-4">
        <div>
          <Label>Tipo de Chave</Label>
          <Select value={defaultPixKeyType} onValueChange={setDefaultPixKeyType}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cpf">CPF</SelectItem>
              <SelectItem value="email">Email</SelectItem>
              <SelectItem value="phone">Celular</SelectItem>
              <SelectItem value="random">Chave Aleatória</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Chave PIX</Label>
          <Input
            value={defaultPixKey}
            onChange={(e) => setDefaultPixKey(e.target.value)}
            placeholder="Digite sua chave PIX"
          />
        </div>
        <Button onClick={handleSavePreferences} className="w-full">
          Salvar Chave PIX
        </Button>
      </div>
    </Card>
  );
};