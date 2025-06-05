
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Client } from '@/types';
import { useClients } from '@/hooks/useClients';
import { toast } from '@/hooks/use-toast';

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

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Editar Cliente</CardTitle>
          <CardDescription>
            Atualize as informações do cliente selecionado.
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

            <div className="flex space-x-2 pt-4">
              <Button type="submit" disabled={isLoading} className="flex-1">
                {isLoading ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientEditForm;
