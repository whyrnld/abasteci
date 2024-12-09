import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

export const useFavoriteStations = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: favorites, isLoading } = useQuery({
    queryKey: ["favorites", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("favorite_stations")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const toggleFavorite = async (stationId: number) => {
    if (!user?.id) return;

    const isFavorite = favorites?.some((f) => f.station_id === stationId);

    if (isFavorite) {
      const { error } = await supabase
        .from("favorite_stations")
        .delete()
        .eq("user_id", user.id)
        .eq("station_id", stationId);

      if (error) throw error;
    } else {
      const { error } = await supabase
        .from("favorite_stations")
        .insert({ user_id: user.id, station_id: stationId });

      if (error) throw error;
    }

    queryClient.invalidateQueries({ queryKey: ["favorites", user.id] });
  };

  return {
    favorites,
    isLoading,
    toggleFavorite,
  };
};