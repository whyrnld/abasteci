import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface Receipt {
  id: number;
  user_id: string;
  station_id: number;
  amount: number;
  status: 'processing' | 'approved' | 'rejected';
  created_at: string;
  invoice_key: string;
}

export const useReceipts = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: receipts, isLoading } = useQuery({
    queryKey: ['receipts', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from('receipts')
        .select('*, stations(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const submitReceipt = useMutation({
    mutationFn: async (newReceipt: Partial<Receipt>) => {
      if (!user?.id) throw new Error('No user');
      
      // Remove any id if present to let the database generate it
      const { id, ...receiptData } = newReceipt;
      
      const { data, error } = await supabase
        .from('receipts')
        .insert([{ ...receiptData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['receipts', user?.id] });
      toast({
        title: 'Nota fiscal enviada',
        description: 'Sua nota fiscal foi enviada com sucesso e está em análise.',
      });
    },
    onError: (error) => {
      console.error('Error submitting receipt:', error);
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Não foi possível enviar a nota fiscal.',
      });
    },
  });

  return {
    receipts,
    isLoading,
    submitReceipt,
  };
};