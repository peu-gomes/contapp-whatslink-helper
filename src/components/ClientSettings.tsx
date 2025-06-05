
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Client } from '@/types';
import { useClients } from '@/hooks/useClients';
import ClientDocuments from './ClientDocuments';
import ClientMessageTemplates from './ClientMessageTemplates';
import { ArrowLeft, Settings } from 'lucide-react';

interface ClientSettingsProps {
  client: Client;
  onBack: () => void;
}

const ClientSettings: React.FC<ClientSettingsProps> = ({ client, onBack }) => {
  const { updateClient } = useClients();

  const handleSaveClient = (updates: Partial<Client>) => {
    updateClient(client.id, updates);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div className="flex items-center space-x-2">
            <Settings className="h-6 w-6 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Configurações do Cliente</h1>
              <p className="text-gray-600">{client.company_name} - {client.contact_name}</p>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="documents" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="documents">📄 Documentos</TabsTrigger>
          <TabsTrigger value="templates">💬 Templates de Mensagem</TabsTrigger>
        </TabsList>

        <TabsContent value="documents">
          <ClientDocuments client={client} />
        </TabsContent>

        <TabsContent value="templates">
          <ClientMessageTemplates client={client} onSave={handleSaveClient} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientSettings;
