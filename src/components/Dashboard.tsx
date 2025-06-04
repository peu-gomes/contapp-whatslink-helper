
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Client } from '@/types';
import ClientList from './ClientList';
import ClientForm from './ClientForm';
import WhatsAppGenerator from './WhatsAppGenerator';
import { Users, MessageSquare, Plus, LogOut } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [activeView, setActiveView] = useState<'dashboard' | 'clients' | 'addClient' | 'whatsapp'>('dashboard');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  useEffect(() => {
    const savedClients = localStorage.getItem('clients');
    if (savedClients) {
      setClients(JSON.parse(savedClients));
    }
  }, []);

  const saveClients = (updatedClients: Client[]) => {
    setClients(updatedClients);
    localStorage.setItem('clients', JSON.stringify(updatedClients));
  };

  const handleSaveClient = (clientData: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newClient: Client = {
      ...clientData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updatedClients = [...clients, newClient];
    saveClients(updatedClients);
    setActiveView('clients');
  };

  const handleDeleteClient = (clientId: string) => {
    const updatedClients = clients.filter(client => client.id !== clientId);
    saveClients(updatedClients);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'clients':
        return (
          <ClientList 
            clients={clients} 
            onDeleteClient={handleDeleteClient}
            onSelectClient={setSelectedClient}
          />
        );
      case 'addClient':
        return <ClientForm onSave={handleSaveClient} />;
      case 'whatsapp':
        return <WhatsAppGenerator clients={clients} selectedClient={selectedClient} />;
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveView('clients')}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{clients.length}</div>
                <p className="text-xs text-muted-foreground">
                  Clientes cadastrados no sistema
                </p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveView('whatsapp')}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Mensagens WhatsApp</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+</div>
                <p className="text-xs text-muted-foreground">
                  Gerar mensagens personalizadas
                </p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setActiveView('addClient')}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Adicionar Cliente</CardTitle>
                <Plus className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+</div>
                <p className="text-xs text-muted-foreground">
                  Cadastrar novo cliente
                </p>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Sistema Contador</h1>
              <p className="text-sm text-gray-600">Bem-vindo, {user?.name}</p>
            </div>
            <nav className="flex space-x-4">
              <Button 
                variant={activeView === 'dashboard' ? 'default' : 'ghost'}
                onClick={() => setActiveView('dashboard')}
              >
                Dashboard
              </Button>
              <Button 
                variant={activeView === 'clients' ? 'default' : 'ghost'}
                onClick={() => setActiveView('clients')}
              >
                Clientes
              </Button>
              <Button 
                variant={activeView === 'whatsapp' ? 'default' : 'ghost'}
                onClick={() => setActiveView('whatsapp')}
              >
                WhatsApp
              </Button>
              <Button variant="outline" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default Dashboard;
