import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

const NotificationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: notification, isLoading } = useQuery({
    queryKey: ['notification', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id && !!user,
  });

  // Mark as read
  useEffect(() => {
    if (notification && !notification.read) {
      supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notification.id)
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ['unread-notifications'] });
        });
    }
  }, [notification, queryClient]);

  const deleteNotification = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('notifications')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Notificação excluída",
        description: "A notificação foi excluída com sucesso.",
      });
      navigate('/notifications');
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Não foi possível excluir a notificação.",
      });
    },
  });

  if (isLoading) {
    return <div className="p-6">Carregando...</div>;
  }

  if (!notification) {
    return <div className="p-6">Notificação não encontrada</div>;
  }

  return (
    <div className="flex flex-col gap-6 pb-20 px-6 py-6">
      <section className="bg-gradient-to-r from-primary to-secondary p-6 pt-8 -mx-6 -mt-6">
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate(-1)}
            className="text-white hover:text-white/80"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-white text-lg font-medium">Detalhes da Notificação</h1>
        </div>
      </section>

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-xl font-semibold">{notification.title}</h2>
            <p className="text-sm text-gray-500">
              {format(new Date(notification.created_at), "dd/MM/yyyy 'às' HH:mm")}
            </p>
          </div>
          <p className="text-gray-700">{notification.message}</p>
        </div>
      </Card>

      <Button 
        variant="destructive" 
        className="mt-4"
        onClick={() => deleteNotification.mutate()}
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Excluir Notificação
      </Button>
    </div>
  );
};

export default NotificationDetails;