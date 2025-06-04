
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Client } from '@/types';
import { useClients } from '@/hooks/useClients';
import { Users, Link, MessageSquare, Edit, Trash2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ClientListProps {
  clients: Client[];
  onSelectClient: (client: Client) => void;
  onEditClient: (client: Client) => void;
}

const ClientList: React.FC<ClientListProps> = ({ clients, onSelectClient, onEditClient }) => {
  const { deleteClient, isDeleting } = useClients();

  const handleDeleteClient = (clientId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.')) {
      deleteClient(clientId);
    }
  };

  if (clients.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-semibold text-gray-900">Nenhum cliente cadastrado</h3>
        <p className="mt-1 text-sm text-gray-500">
          Comece adicionando um novo cliente ao sistema.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Clientes</h2>
        <Badge variant="secondary">{clients.length} cliente(s)</Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <Card key={client.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">{client.company_name}</CardTitle>
              <CardDescription>{client.contact_name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <strong>Telefone:</strong> {client.phone}
                </p>
                {client.drive_link && (
                  <div className="flex items-center space-x-2">
                    <Link className="h-4 w-4 text-blue-500" />
                    <a 
                      href={client.drive_link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-500 hover:underline truncate"
                    >
                      Pasta no Drive
                    </a>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Documentos:</p>
                <div className="flex flex-wrap gap-1">
                  {client.documents.map((doc) => (
                    <Badge 
                      key={doc.id} 
                      variant={doc.received ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {doc.name}
                      {doc.document_type === 'send' && ' 📤'}
                      {doc.document_type === 'receive' && ' 📥'}
                    </Badge>
                  ))}
                  {client.documents.length === 0 && (
                    <span className="text-xs text-gray-500">Nenhum documento cadastrado</span>
                  )}
                </div>
              </div>

              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  onClick={() => onSelectClient(client)}
                  className="flex-1"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => onEditClient(client)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="destructive" 
                  onClick={() => handleDeleteClient(client.id)}
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ClientList;
