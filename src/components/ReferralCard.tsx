import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useProfile } from "@/hooks/useProfile";
import { useNavigate } from "react-router-dom";
import { Profile } from "@/types";

const ReferralCard = () => {
  const { toast } = useToast();
  const { profile } = useProfile();
  const navigate = useNavigate();
  const referralCode = profile?.referral_code || '';

  const handleShare = async () => {
    if (!referralCode) return;
    
    const shareUrl = `${window.location.origin}/auth/register?ref=${referralCode}`;
    
    try {
      await navigator.share({
        title: "Ganhe R$ 5,00 no app",
        text: `Use meu código ${referralCode} e ganhe R$ 5,00 de bônus após enviar 3 notas fiscais!`,
        url: shareUrl,
      });
    } catch (err) {
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: "Link copiado!",
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
            Ganhe R$ 5,00 para cada amigo que se cadastrar usando seu código e enviar 3 notas fiscais aprovadas
          </p>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="bg-gray-100 p-3 rounded-lg text-center">
          <p className="text-sm text-gray-500 mb-1">Seu código</p>
          <p className="text-xl font-medium">{referralCode || "..."}</p>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" className="w-full" onClick={handleShare}>
            Compartilhar
          </Button>
          <Button 
            className="w-full"
            onClick={() => navigate("/referral-stats")}
          >
            Ver Indicações
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ReferralCard;