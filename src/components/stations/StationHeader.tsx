import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface StationHeaderProps {
  name: string;
  onBack?: () => void;
}

export const StationHeader = ({ name, onBack }: StationHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-r from-primary to-secondary p-4">
      <Button
        variant="ghost"
        className="text-white mb-2"
        onClick={() => (onBack ? onBack() : navigate(-1))}
      >
        <ArrowLeft className="h-6 w-6 mr-2" />
        Voltar
      </Button>
      <h1 className="text-xl font-semibold text-white">{name}</h1>
    </div>
  );
};