import { Star, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const Premium = () => {
  const { toast } = useToast();

  const handleSubscribe = () => {
    toast({
      title: "Assinatura Premium",
      description: "Você será redirecionado para o pagamento.",
    });
  };

  return (
    <div className="flex flex-col gap-6 pb-20 px-6 py-6">
      <section className="bg-gradient-to-r from-primary to-secondary p-6 -mx-6 -mt-6 flex items-center gap-2">
        <Button variant="ghost" onClick={() => window.history.back()} className="text-white p-2">
          ←
        </Button>
        <h1 className="text-white text-lg font-medium">Premium</h1>
      </section>

      <Card className="p-6 bg-gradient-to-r from-gray-900 to-black text-white">
        <div className="flex items-center gap-3 mb-6">
          <Star className="w-8 h-8" />
          <div>
            <h2 className="text-xl font-medium">Plano Premium</h2>
            <p className="text-sm opacity-90">R$ 9,99/mês</p>
          </div>
        </div>

        <ul className="space-y-4 mb-6">
          <li className="flex items-center gap-2">
            <Check className="w-5 h-5 text-primary" />
            <span>Envie mais notas fiscais</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-5 h-5 text-primary" />
            <span>Sem valor mínimo para resgate</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-5 h-5 text-primary" />
            <span>Cashback exclusivo em postos parceiros</span>
          </li>
          <li className="flex items-center gap-2">
            <Check className="w-5 h-5 text-primary" />
            <span>Suporte prioritário</span>
          </li>
        </ul>

        <Button onClick={handleSubscribe} className="w-full bg-primary hover:bg-primary/90">
          Assinar Premium
        </Button>
      </Card>
    </div>
  );
};

export default Premium;