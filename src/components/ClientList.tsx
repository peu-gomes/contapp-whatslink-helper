
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Client } from '@/types';
import { Users, Link, MessageSquare } from 'lucide-react';

interface ClientListProps {
  clients: Client[];
  onDeleteClient: (clientId: string) => void;
  onSelectClient: (client: Client) => void;
}

const ClientList: React.FC<ClientListProps> = ({ clients, onDeleteClient, onSelectClient }) => {
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
              <CardTitle className="text-lg">{client.companyName}</CardTitle>
              <CardDescription>{client.contactName}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <strong>Telefone:</strong> {client.phone}
                </p>
                {client.driveLink && (
                  <div className="flex items-center space-x-2">
                    <Link className="h-4 w-4 text-blue-500" />
                    <a 
                      href={client.driveLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-500 hover:underline"
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
                    </Badge>
                  ))}
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
                  variant="destructive" 
                  onClick={() => onDeleteClient(client.id)}
                >
                  Excluir
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
