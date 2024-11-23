import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Bell,
  CreditCard,
  LogOut,
  Share2,
  Star,
  User,
  Sliders,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";

const Settings = () => {
  const [preferredFuel, setPreferredFuel] = useState("regular");
  const [searchRadius, setSearchRadius] = useState(5);
  const [priceAlerts, setPriceAlerts] = useState(true);
  const [receiptAlerts, setReceiptAlerts] = useState(true);
  const [defaultPixKey, setDefaultPixKey] = useState("");
  const [defaultPixKeyType, setDefaultPixKeyType] = useState("cpf");

  return (
    <div className="flex flex-col gap-6 pb-20">
      <section className="bg-gradient-to-r from-primary to-secondary p-6 -mx-6 -mt-6">
        <h1 className="text-white text-lg font-medium">Configurações</h1>
      </section>

      <div className="space-y-4">
        <Card className="p-4">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <User className="w-5 h-5" />
            Perfil
          </h3>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Nome: João Silva</p>
            <p className="text-sm text-gray-500">Email: joao@email.com</p>
            <p className="text-sm text-gray-500">CPF: ***.***.***-**</p>
          </div>
        </Card>

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
          </div>
        </Card>

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
                max={20}
                step={1}
              />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notificações
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-500">
                Atualizações de preço
              </label>
              <Switch
                checked={priceAlerts}
                onCheckedChange={setPriceAlerts}
              />
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-500">
                Status do recibo
              </label>
              <Switch
                checked={receiptAlerts}
                onCheckedChange={setReceiptAlerts}
              />
            </div>
          </div>
        </Card>

        <Button variant="destructive" className="w-full">
          <LogOut className="w-5 h-5 mr-2" />
          Sair
        </Button>
      </div>
    </div>
  );
};

export default Settings;
