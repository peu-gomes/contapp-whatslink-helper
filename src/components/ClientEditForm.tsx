
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Client } from '@/types';
import { useClients } from '@/hooks/useClients';
import { useDocuments } from '@/hooks/useDocuments';
import { toast } from '@/hooks/use-toast';
import { ArrowLeft } from 'lucide-react';
import ClientDocuments from './ClientDocuments';
import MessageTemplateManager from './MessageTemplateManager';

interface ClientEditFormProps {
  client: Client;
  onSave: () => void;
  onCancel: () => void;
}

const ClientEditForm: React.FC<ClientEditFormProps> = ({ client, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    company_name: client.company_name,
    contact_name: client.contact_name,
    phone: client.phone,
    drive_link: client.drive_link || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { updateClient } = useClients();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      updateClient(client.id, formData);
      toast({
        title: "Cliente atualizado!",
        description: "As informações do cliente foram atualizadas com sucesso.",
      });
      onSave();
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o cliente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveTemplates = (templates: any[]) => {
    updateClient(client.id, { message_templates: templates });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onCancel}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Editar Cliente</h1>
          <p className="text-gray-600">{client.company_name}</p>
        </div>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="basic">ℹ️ Informações Básicas</TabsTrigger>
          <TabsTrigger value="documents">📄 Documentos</TabsTrigger>
          <TabsTrigger value="templates">💬 Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Cliente</CardTitle>
              <CardDescription>
                Atualize as informações básicas do cliente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company_name">Nome da Empresa</Label>
                    <Input
                      id="company_name"
                      value={formData.company_name}
                      onChange={(e) => handleChange('company_name', e.target.value)}
                      placeholder="Nome da empresa"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact_name">Nome do Contato</Label>
                    <Input
                      id="contact_name"
                      value={formData.contact_name}
                      onChange={(e) => handleChange('contact_name', e.target.value)}
                      placeholder="Nome da pessoa de contato"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    placeholder="(11) 99999-9999"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="drive_link">Link do Google Drive (opcional)</Label>
                  <Input
                    id="drive_link"
                    value={formData.drive_link}
                    onChange={(e) => handleChange('drive_link', e.target.value)}
                    placeholder="https://drive.google.com/drive/folders/..."
                  />
                </div>

                <Button type="submit" disabled={isLoading} className="w-full">
                  {isLoading ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <ClientDocuments client={client} />
        </TabsContent>

        <TabsContent value="templates">
          <MessageTemplateManager 
            templates={client.message_templates || []}
            onSave={handleSaveTemplates}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientEditForm;
