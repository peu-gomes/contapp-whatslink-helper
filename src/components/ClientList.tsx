
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Client } from '@/types';
import { Phone, Building2, Edit, Plus } from 'lucide-react';

interface ClientListProps {
  clients: Client[];
  onEditClient: (client: Client) => void;
}

const ClientList: React.FC<ClientListProps> = ({ 
  clients, 
  onEditClient
}) => {
  if (clients.length === 0) {
    return (
      <div className="text-center py-12">
        <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum cliente cadastrado</h3>
        <p className="text-gray-500">Comece adicionando seu primeiro cliente ao sistema.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Clientes Cadastrados</h2>
        <span className="text-sm text-gray-500">{clients.length} cliente(s) encontrado(s)</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <Card key={client.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="truncate">{client.company_name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEditClient(client)}
                  className="text-blue-600 hover:text-blue-800"
                  title="Editar cliente"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </CardTitle>
              <CardDescription>{client.contact_name}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  {client.phone}
                </div>
                {client.drive_link && (
                  <div className="text-sm text-blue-600 truncate">
                    📁 Drive configurado
                  </div>
                )}
                
                <div className="flex flex-wrap gap-1 mt-2">
                  {client.documents && client.documents.length > 0 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">
                      📄 {client.documents.length} documento(s)
                    </span>
                  )}
                  {client.message_templates && client.message_templates.length > 0 && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                      💬 {client.message_templates.length} template(s)
                    </span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ClientList;
