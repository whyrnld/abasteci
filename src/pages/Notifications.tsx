import { ArrowLeft, Bell, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

const Notifications = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [swipeStartX, setSwipeStartX] = useState<number | null>(null);
  const [swipingId, setSwipingId] = useState<number | null>(null);
  const [swipeOffset, setSwipeOffset] = useState(0);

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user?.id)
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const deleteNotification = useMutation({
    mutationFn: async (id: number) => {
      const { error } = await supabase
        .from('notifications')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-notifications'] });
      toast({
        title: "Notificação excluída",
        description: "A notificação foi excluída com sucesso.",
      });
    },
  });

  const clearAllNotifications = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from('notifications')
        .update({ deleted_at: new Date().toISOString() })
        .eq('user_id', user?.id)
        .is('deleted_at', null);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['unread-notifications'] });
      toast({
        title: "Notificações limpas",
        description: "Todas as notificações foram excluídas com sucesso.",
      });
      setShowClearDialog(false);
    },
  });

  const handleTouchStart = (e: React.TouchEvent, id: number) => {
    setSwipeStartX(e.touches[0].clientX);
    setSwipingId(id);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (swipeStartX === null) return;
    
    const currentX = e.touches[0].clientX;
    const diff = swipeStartX - currentX;
    
    // Limit swipe to left only and max 100px
    const newOffset = Math.max(0, Math.min(100, diff));
    setSwipeOffset(newOffset);
  };

  const handleTouchEnd = () => {
    if (swipeOffset > 50 && swipingId) {
      deleteNotification.mutate(swipingId);
    }
    setSwipeStartX(null);
    setSwipingId(null);
    setSwipeOffset(0);
  };

  return (
    <div className="flex flex-col gap-6 pb-20 px-6 py-6">
      <section className="bg-gradient-to-r from-primary to-secondary p-6 pt-8 -mx-6 -mt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:text-white/80"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-white text-lg font-medium">Notificações</h1>
          </div>
          {notifications.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm"
              className="text-white hover:text-white/80"
              onClick={() => setShowClearDialog(true)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Limpar
            </Button>
          )}
        </div>
      </section>

      <div className="space-y-3">
        {isLoading ? (
          <div className="text-center py-4">Carregando...</div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-4 space-y-2">
            <Bell className="w-8 h-8 mx-auto text-gray-400" />
            <p className="text-gray-500">Nenhuma notificação</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className="relative overflow-hidden touch-pan-y"
              onTouchStart={(e) => handleTouchStart(e, notification.id)}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              style={{
                transform: swipingId === notification.id ? `translateX(-${swipeOffset}px)` : 'none',
                transition: swipingId === notification.id ? 'none' : 'transform 0.2s ease-out',
              }}
            >
              <Link to={`/notifications/${notification.id}`}>
                <Card
                  className={`p-4 mb-4 hover:shadow-md transition-shadow ${
                    !notification.read ? 'bg-primary/5' : ''
                  }`}
                >
                  <h3 className="font-medium">{notification.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {format(new Date(notification.created_at), "dd/MM/yyyy 'às' HH:mm")}
                  </p>
                </Card>
              </Link>
              {swipingId === notification.id && (
                <div 
                  className="absolute top-0 right-0 h-full flex items-center justify-center bg-red-500 text-white"
                  style={{ width: `${swipeOffset}px` }}
                >
                  <Trash2 className="w-6 h-6" />
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Limpar notificações</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir todas as notificações? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={() => clearAllNotifications.mutate()}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Notifications;