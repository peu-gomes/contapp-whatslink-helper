import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useClients } from '@/hooks/useClients';
import { Client } from '@/types';
import ClientList from './ClientList';
import ClientForm from './ClientForm';
import ClientEditForm from './ClientEditForm';
import ClientSettings from './ClientSettings';
import WhatsAppGenerator from './WhatsAppGenerator';
import { Users, MessageSquare, Plus, LogOut } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { clients, isLoading } = useClients();
  const [activeTab, setActiveTab] = useState('clients');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [configuringClient, setConfiguringClient] = useState<Client | null>(null);
  const { logout } = useAuth();

  const handleSelectClient = (client: Client) => {
    setSelectedClient(client);
    setActiveTab('whatsapp');
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
  };

  const handleCancelEdit = () => {
    setEditingClient(null);
  };

  const handleSaveEdit = () => {
    setEditingClient(null);
  };

  const handleConfigureClient = (client: Client) => {
    setConfiguringClient(client);
  };

  const handleBackFromConfigure = () => {
    setConfiguringClient(null);
  };

  if (isLoading) {
    return <div className="text-center py-12">Carregando clientes...</div>;
  }

  if (editingClient) {
    return (
      <ClientEditForm
        client={editingClient}
        onSave={handleSaveEdit}
        onCancel={handleCancelEdit}
      />
    );
  }

  if (configuringClient) {
    return <ClientSettings client={configuringClient} onBack={handleBackFromConfigure} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Painel de Controle
          </h1>
          <Button variant="destructive" size="sm" onClick={logout}>
            <LogOut className="h-4 w-4 mr-2" />
            Sair
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="clients" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>Clientes</span>
            </TabsTrigger>
            <TabsTrigger value="add-client" className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Adicionar Cliente</span>
            </TabsTrigger>
            <TabsTrigger value="whatsapp" className="flex items-center space-x-2">
              <MessageSquare className="h-4 w-4" />
              <span>WhatsApp</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="clients">
            <ClientList 
              clients={clients} 
              onSelectClient={handleSelectClient}
              onEditClient={handleEditClient}
              onConfigureClient={handleConfigureClient}
            />
          </TabsContent>

          <TabsContent value="add-client">
            <ClientForm onSave={() => setActiveTab('clients')} />
          </TabsContent>

          <TabsContent value="whatsapp">
            <WhatsAppGenerator clients={clients} selectedClient={selectedClient} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
