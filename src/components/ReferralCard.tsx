import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

const ReferralCard = () => {
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
      <Button variant="outline" className="w-full">
        Compartilhar código
      </Button>
    </Card>
  );
};

export default ReferralCard;