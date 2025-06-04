
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Client } from '@/types';
import ClientList from './ClientList';
import ClientForm from './ClientForm';
import WhatsAppGenerator from './WhatsAppGenerator';
import { Users, MessageSquare, Plus, LogOut, User, Building2 } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            {/* Logo e informações do usuário */}
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Sistema Contador
                </h1>
                <div className="flex items-center space-x-2 mt-1">
                  <User className="h-4 w-4 text-gray-500" />
                  <p className="text-sm text-gray-600 font-medium">Bem-vindo, {user?.name}</p>
                </div>
              </div>
            </div>

            {/* Navegação e ações */}
            <div className="flex items-center space-x-2">
              <nav className="hidden md:flex space-x-1 bg-gray-100 p-1 rounded-lg">
                <Button 
                  variant={activeView === 'dashboard' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveView('dashboard')}
                  className={activeView === 'dashboard' ? 'shadow-md' : ''}
                >
                  Dashboard
                </Button>
                <Button 
                  variant={activeView === 'clients' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveView('clients')}
                  className={activeView === 'clients' ? 'shadow-md' : ''}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Clientes
                </Button>
                <Button 
                  variant={activeView === 'whatsapp' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveView('whatsapp')}
                  className={activeView === 'whatsapp' ? 'shadow-md' : ''}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>
              </nav>

              {/* Botão de logout */}
              <Button 
                variant="outline" 
                size="sm"
                onClick={logout}
                className="ml-4 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>

          {/* Navegação mobile */}
          <div className="md:hidden pb-4">
            <nav className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <Button 
                variant={activeView === 'dashboard' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveView('dashboard')}
                className={`flex-1 ${activeView === 'dashboard' ? 'shadow-md' : ''}`}
              >
                Dashboard
              </Button>
              <Button 
                variant={activeView === 'clients' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveView('clients')}
                className={`flex-1 ${activeView === 'clients' ? 'shadow-md' : ''}`}
              >
                Clientes
              </Button>
              <Button 
                variant={activeView === 'whatsapp' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveView('whatsapp')}
                className={`flex-1 ${activeView === 'whatsapp' ? 'shadow-md' : ''}`}
              >
                WhatsApp
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
