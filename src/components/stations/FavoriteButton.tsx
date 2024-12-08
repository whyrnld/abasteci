import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

interface FavoriteButtonProps {
  stationId: number;
}

export const FavoriteButton = ({ stationId }: FavoriteButtonProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: isFavorite, isLoading } = useQuery({
    queryKey: ['favorite', stationId, user?.id],
    queryFn: async () => {
      if (!user?.id) return false;
      
      const { data, error } = await supabase
        .from('favorite_stations')
        .select('id')
        .eq('user_id', user.id)
        .eq('station_id', stationId)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    },
    enabled: !!user?.id,
  });

  const toggleFavorite = useMutation({
    mutationFn: async () => {
      if (!user?.id) return;

      if (isFavorite) {
        const { error } = await supabase
          .from('favorite_stations')
          .delete()
          .eq('user_id', user.id)
          .eq('station_id', stationId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('favorite_stations')
          .insert({
            user_id: user.id,
            station_id: stationId,
          });

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorite', stationId] });
      toast({
        title: isFavorite ? "Posto removido dos favoritos" : "Posto adicionado aos favoritos",
        description: isFavorite 
          ? "O posto foi removido da sua lista de favoritos."
          : "O posto foi adicionado à sua lista de favoritos.",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível atualizar os favoritos.",
      });
    },
  });

  if (isLoading) {
    return (
      <Button variant="ghost" size="icon" disabled>
        <Heart className="w-5 h-5" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => toggleFavorite.mutate()}
      className={isFavorite ? "text-red-500 hover:text-red-600" : ""}
    >
      <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
    </Button>
  );
};