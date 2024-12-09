import { Share2, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useFavoriteStations } from "@/hooks/useFavoriteStations";

interface StationActionsProps {
  stationId: number;
  stationName: string;
}

export const StationActions = ({ stationId, stationName }: StationActionsProps) => {
  const { toast } = useToast();
  const { favorites, toggleFavorite } = useFavoriteStations();
  const isFavorite = favorites?.some((f) => f.station_id === stationId);

  const handleShare = async () => {
    try {
      await navigator.share({
        title: stationName,
        text: `Confira os preços em ${stationName}`,
        url: window.location.href,
      });
    } catch (err) {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copiado!",
        description: "Compartilhe com seus amigos.",
      });
    }
  };

  const handleFavorite = async () => {
    await toggleFavorite(stationId);
    toast({
      title: isFavorite ? "Removido dos favoritos" : "Adicionado aos favoritos",
      description: isFavorite
        ? "O posto foi removido dos seus favoritos"
        : "O posto foi adicionado aos seus favoritos",
    });
  };

  return (
    <div className="flex gap-2 mb-6">
      <Button variant="outline" size="icon" onClick={handleShare}>
        <Share2 className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={handleFavorite}
        className={isFavorite ? "text-red-500" : ""}
      >
        <Heart className="h-4 w-4" fill={isFavorite ? "currentColor" : "none"} />
      </Button>
    </div>
  );
};