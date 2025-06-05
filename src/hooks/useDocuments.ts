
import { useState, useEffect } from 'react';
import { Document } from '@/types';

export const useDocuments = (clientId: string) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // For demo purposes, create some mock documents
    const mockDocuments: Document[] = [
      {
        id: '1',
        client_id: clientId,
        name: 'Contrato Social',
        drive_path: 'Documentos/Contratos/2025',
        document_type: 'receive',
        required: true,
        received: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: '2',
        client_id: clientId,
        name: 'Declaração de IR',
        drive_path: 'Documentos/Impostos/05/2025',
        document_type: 'send',
        required: true,
        received: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    ];
    
    setDocuments(mockDocuments);
    setIsLoading(false);
  }, [clientId]);

  const addDocument = (document: Omit<Document, 'id' | 'created_at' | 'updated_at'>) => {
    const newDocument: Document = {
      ...document,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setDocuments(prev => [...prev, newDocument]);
  };

  const updateDocument = (id: string, updates: Partial<Document>) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === id 
        ? { ...doc, ...updates, updated_at: new Date().toISOString() }
        : doc
    ));
  };

  const deleteDocument = (id: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  return {
    documents,
    isLoading,
    addDocument,
    updateDocument,
    deleteDocument
  };
};
