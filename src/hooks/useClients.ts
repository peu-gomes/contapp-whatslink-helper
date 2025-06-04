
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Client, Document } from '@/types';
import { toast } from '@/hooks/use-toast';

export const useClients = () => {
  const queryClient = useQueryClient();

  const { data: clients = [], isLoading, error } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clients')
        .select(`
          *,
          documents (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return data.map(client => ({
        ...client,
        documents: client.documents || []
      })) as Client[];
    },
  });

  const createClientMutation = useMutation({
    mutationFn: async (clientData: Omit<Client, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'documents'>) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: client, error: clientError } = await supabase
        .from('clients')
        .insert({
          user_id: user.id,
          company_name: clientData.company_name,
          contact_name: clientData.contact_name,
          phone: clientData.phone,
          drive_link: clientData.drive_link,
        })
        .select()
        .single();

      if (clientError) throw clientError;

      // Insert documents if any
      if (clientData.documents && clientData.documents.length > 0) {
        const documentsToInsert = clientData.documents.map(doc => ({
          client_id: client.id,
          name: doc.name,
          drive_path: doc.drive_path,
          document_type: doc.document_type,
          required: doc.required,
          received: doc.received,
        }));

        const { error: docsError } = await supabase
          .from('documents')
          .insert(documentsToInsert);

        if (docsError) throw docsError;
      }

      return client;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Cliente criado!",
        description: "Cliente foi adicionado com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível criar o cliente.",
        variant: "destructive",
      });
      console.error('Error creating client:', error);
    },
  });

  const updateClientMutation = useMutation({
    mutationFn: async ({ clientId, clientData }: { 
      clientId: string; 
      clientData: Partial<Omit<Client, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
    }) => {
      const { data, error } = await supabase
        .from('clients')
        .update({
          company_name: clientData.company_name,
          contact_name: clientData.contact_name,
          phone: clientData.phone,
          drive_link: clientData.drive_link,
        })
        .eq('id', clientId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Cliente atualizado!",
        description: "Dados do cliente foram atualizados com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o cliente.",
        variant: "destructive",
      });
      console.error('Error updating client:', error);
    },
  });

  const deleteClientMutation = useMutation({
    mutationFn: async (clientId: string) => {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Cliente excluído!",
        description: "Cliente foi removido do sistema.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível excluir o cliente.",
        variant: "destructive",
      });
      console.error('Error deleting client:', error);
    },
  });

  return {
    clients,
    isLoading,
    error,
    createClient: createClientMutation.mutate,
    updateClient: updateClientMutation.mutate,
    deleteClient: deleteClientMutation.mutate,
    isCreating: createClientMutation.isPending,
    isUpdating: updateClientMutation.isPending,
    isDeleting: deleteClientMutation.isPending,
  };
};
