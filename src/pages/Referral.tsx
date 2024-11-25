import { Share2, Copy, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const Referral = () => {
  const { toast } = useToast();
  const referralCode = "ABC123";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralCode);
    toast({
      title: "Código copiado!",
      description: "Compartilhe com seus amigos.",
    });
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: "Ganhe R$ 5,00 no app",
        text: `Use meu código ${referralCode} e ganhe R$ 5,00 de bônus!`,
        url: window.location.origin,
      });
    } catch (err) {
      handleCopy();
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-20">
      <section className="bg-gradient-to-r from-primary to-secondary p-6 -mx-6 -mt-6 flex items-center gap-2">
        <Button variant="ghost" onClick={() => window.history.back()} className="text-white p-2">
          ←
        </Button>
        <h1 className="text-white text-lg font-medium">Indique e Ganhe</h1>
      </section>

      <Card className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-8 h-8 text-primary" />
          <div>
            <h2 className="text-xl font-medium">Convide amigos</h2>
            <p className="text-sm text-gray-500">Ganhe R$ 5,00 por indicação</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-accent p-4 rounded-lg text-center">
            <p className="text-sm text-gray-500 mb-2">Seu código</p>
            <p className="text-2xl font-medium">{referralCode}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button onClick={handleCopy} variant="outline" className="w-full">
              <Copy className="w-4 h-4 mr-2" />
              Copiar
            </Button>
            <Button onClick={handleShare} className="w-full">
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhar
            </Button>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Como funciona</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>1. Compartilhe seu código</li>
              <li>2. Amigo se cadastra usando seu código</li>
              <li>3. Vocês ganham R$ 5,00 cada</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Referral;