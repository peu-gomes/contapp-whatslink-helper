
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Document } from '@/types';
import { toast } from '@/hooks/use-toast';

export const useDocuments = (clientId: string) => {
  const queryClient = useQueryClient();

  const createDocumentMutation = useMutation({
    mutationFn: async (documentData: Omit<Document, 'id' | 'client_id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('documents')
        .insert({
          client_id: clientId,
          name: documentData.name,
          drive_path: documentData.drive_path,
          document_type: documentData.document_type,
          required: documentData.required,
          received: documentData.received,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Documento adicionado!",
        description: "Documento foi adicionado com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o documento.",
        variant: "destructive",
      });
      console.error('Error creating document:', error);
    },
  });

  const updateDocumentMutation = useMutation({
    mutationFn: async ({ documentId, documentData }: { 
      documentId: string; 
      documentData: Partial<Omit<Document, 'id' | 'client_id' | 'created_at' | 'updated_at'>>
    }) => {
      const { data, error } = await supabase
        .from('documents')
        .update(documentData)
        .eq('id', documentId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o documento.",
        variant: "destructive",
      });
      console.error('Error updating document:', error);
    },
  });

  const deleteDocumentMutation = useMutation({
    mutationFn: async (documentId: string) => {
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', documentId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
      toast({
        title: "Documento removido!",
        description: "Documento foi removido com sucesso.",
      });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Não foi possível remover o documento.",
        variant: "destructive",
      });
      console.error('Error deleting document:', error);
    },
  });

  return {
    createDocument: createDocumentMutation.mutate,
    updateDocument: updateDocumentMutation.mutate,
    deleteDocument: deleteDocumentMutation.mutate,
    isCreating: createDocumentMutation.isPending,
    isUpdating: updateDocumentMutation.isPending,
    isDeleting: deleteDocumentMutation.isPending,
  };
};
