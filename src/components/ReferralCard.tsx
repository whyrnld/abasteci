import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const ReferralCard = () => {
  const { toast } = useToast();
  const referralCode = "ABC123";

  const handleShare = async () => {
    try {
      await navigator.share({
        title: "Ganhe R$ 5,00 no app",
        text: `Use meu código ${referralCode} e ganhe R$ 5,00 de bônus!`,
        url: window.location.origin,
      });
    } catch (err) {
      navigator.clipboard.writeText(referralCode);
      toast({
        title: "Código copiado!",
        description: "Compartilhe com seus amigos.",
      });
    }
  };

  return (
    <Card className="p-6 bg-gradient-to-r from-white to-gray-50">
      <div className="flex items-start gap-4 mb-4">
        <Users className="w-6 h-6" />
        <div>
          <h3 className="text-lg font-medium">Indique e Ganhe</h3>
          <p className="text-sm text-gray-500">
            Ganhe R$ 5,00 para cada amigo que se cadastrar usando seu código
          </p>
        </div>
      </div>
      <Button variant="outline" className="w-full" onClick={handleShare}>
        Compartilhar código
      </Button>
    </Card>
  );
};

export default ReferralCard;