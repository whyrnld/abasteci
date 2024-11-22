import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Settings = () => {
  return (
    <div className="flex flex-col gap-6 pb-20">
      <section className="bg-primary p-6 -mx-6 -mt-6">
        <h1 className="text-white text-lg font-medium mb-2">Configurações</h1>
      </section>

      <div className="space-y-4">
        <Card className="p-4">
          <h3 className="font-medium mb-4">Perfil</h3>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Nome: João Silva</p>
            <p className="text-sm text-gray-500">Email: joao@email.com</p>
            <p className="text-sm text-gray-500">CPF: ***.***.***-**</p>
          </div>
        </Card>

        <Card className="p-4">
          <h3 className="font-medium mb-4">Preferências</h3>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">Combustível preferido: Gasolina</p>
            <p className="text-sm text-gray-500">Raio de busca: 5km</p>
            <p className="text-sm text-gray-500">Faixa de preço: R$ 5,00 - R$ 6,00</p>
          </div>
        </Card>

        <Button variant="destructive" className="w-full">
          Sair
        </Button>
      </div>
    </div>
  );
};

export default Settings;