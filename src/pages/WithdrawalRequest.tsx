import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";

const WithdrawalRequest = () => {
  const [pixKeyType, setPixKeyType] = useState("cpf");
  const [pixKey, setPixKey] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pixKey) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Por favor, insira uma chave PIX válida.",
      });
      return;
    }
    
    toast({
      title: "Solicitação enviada",
      description: "Seu saque será processado em até 24 horas.",
    });
  };

  return (
    <div className="flex flex-col gap-6 pb-20 px-6 py-6">
      <section className="bg-gradient-to-r from-primary to-secondary p-6 -mx-6 -mt-6 flex items-center gap-2">
        <Button variant="ghost" onClick={() => window.history.back()} className="text-white p-2">
          ←
        </Button>
        <h1 className="text-white text-lg font-medium">Solicitar Saque</h1>
      </section>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <Label>Tipo de Chave PIX</Label>
              <RadioGroup
                value={pixKeyType}
                onValueChange={setPixKeyType}
                className="grid grid-cols-2 gap-4 mt-2"
              >
                <div>
                  <RadioGroupItem value="cpf" id="cpf" className="peer sr-only" />
                  <Label
                    htmlFor="cpf"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    CPF
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="email" id="email" className="peer sr-only" />
                  <Label
                    htmlFor="email"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    Email
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="phone" id="phone" className="peer sr-only" />
                  <Label
                    htmlFor="phone"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    Celular
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="random" id="random" className="peer sr-only" />
                  <Label
                    htmlFor="random"
                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                  >
                    Aleatória
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <div>
              <Label>Chave PIX</Label>
              <Input
                type="text"
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
                placeholder="Digite sua chave PIX"
                className="mt-2"
              />
            </div>
          </div>
        </Card>

        <Button type="submit" className="w-full">
          Solicitar Saque
        </Button>
      </form>
    </div>
  );
};

export default WithdrawalRequest;