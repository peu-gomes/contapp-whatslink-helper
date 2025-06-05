
import { useState, useEffect } from 'react';
import { Client } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      // For demo purposes, create some mock clients
      const mockClients: Client[] = [
        {
          id: '1',
          user_id: user.id,
          company_name: 'Empresa ABC Ltda',
          contact_name: 'João Silva',
          phone: '(11) 99999-9999',
          drive_link: 'https://drive.google.com/drive/folders/abc123',
          documents: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          id: '2',
          user_id: user.id,
          company_name: 'Comércio XYZ ME',
          contact_name: 'Maria Santos',
          phone: '(11) 88888-8888',
          drive_link: 'https://drive.google.com/drive/folders/xyz456',
          documents: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ];
      
      setClients(mockClients);
    }
    setIsLoading(false);
  }, [user]);

  const addClient = (client: Omit<Client, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'documents'>) => {
    const newClient: Client = {
      ...client,
      id: Date.now().toString(),
      user_id: user?.id || '',
      documents: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setClients(prev => [...prev, newClient]);
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients(prev => prev.map(client => 
      client.id === id 
        ? { ...client, ...updates, updated_at: new Date().toISOString() }
        : client
    ));
  };

  const deleteClient = (id: string) => {
    setClients(prev => prev.filter(client => client.id !== id));
  };

  return {
    clients,
    isLoading,
    addClient,
    updateClient,
    deleteClient
  };
};
