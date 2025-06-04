
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Client, Document } from '@/types';
import { useClients } from '@/hooks/useClients';
import { useDocuments } from '@/hooks/useDocuments';
import { Plus, X, ArrowLeft } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ClientEditFormProps {
  client: Client;
  onSave: () => void;
  onCancel: () => void;
}

const ClientEditForm: React.FC<ClientEditFormProps> = ({ client, onSave, onCancel }) => {
  const [companyName, setCompanyName] = useState(client.company_name);
  const [contactName, setContactName] = useState(client.contact_name);
  const [phone, setPhone] = useState(client.phone);
  const [driveLink, setDriveLink] = useState(client.drive_link || '');
  const [newDocName, setNewDocName] = useState('');
  const [newDocType, setNewDocType] = useState<'send' | 'receive'>('receive');

  const { updateClient, isUpdating } = useClients();
  const { createDocument, updateDocument, deleteDocument } = useDocuments(client.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!companyName || !contactName || !phone) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    updateClient({
      clientId: client.id,
      clientData: {
        company_name: companyName,
        contact_name: contactName,
        phone,
        drive_link: driveLink,
      }
    });

    onSave();
  };

  const addDocument = () => {
    if (!newDocName.trim()) return;
    
    createDocument({
      name: newDocName,
      document_type: newDocType,
      required: false,
      received: false,
    });
    
    setNewDocName('');
    setNewDocType('receive');
  };

  const removeDocument = (docId: string) => {
    deleteDocument(docId);
  };

  const toggleDocumentReceived = (doc: Document) => {
    updateDocument({
      documentId: doc.id,
      documentData: { received: !doc.received }
    });
  };

  const toggleDocumentRequired = (doc: Document) => {
    updateDocument({
      documentId: doc.id,
      documentData: { required: !doc.required }
    });
  };

  const updateDocumentType = (doc: Document, type: 'send' | 'receive') => {
    updateDocument({
      documentId: doc.id,
      documentData: { document_type: type }
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Button 
          variant="ghost" 
          onClick={onCancel}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar para lista
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Editar Cliente</CardTitle>
          <CardDescription>
            Atualize as informações do cliente e gerencie os documentos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Nome da Empresa *</Label>
                <Input
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Ex: ABC Ltda"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactName">Nome do Contato *</Label>
                <Input
                  id="contactName"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder="Ex: João Silva"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">WhatsApp *</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ex: (11) 99999-9999"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="driveLink">Link da Pasta no Drive</Label>
                <Input
                  id="driveLink"
                  value={driveLink}
                  onChange={(e) => setDriveLink(e.target.value)}
                  placeholder="https://drive.google.com/..."
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label>Documentos</Label>
              
              <div className="space-y-2">
                {client.documents.map((doc) => (
                  <div key={doc.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      checked={doc.received}
                      onCheckedChange={() => toggleDocumentReceived(doc)}
                    />
                    <div className="flex-1">
                      <span className={doc.received ? 'line-through text-gray-500' : ''}>
                        {doc.name}
                      </span>
                      {doc.required && <span className="text-red-500 ml-1">*</span>}
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs">
                          {doc.document_type === 'send' ? '📤 Enviamos' : '📥 Recebemos'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Select
                        value={doc.document_type}
                        onValueChange={(value: 'send' | 'receive') => updateDocumentType(doc, value)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="receive">📥 Receber</SelectItem>
                          <SelectItem value="send">📤 Enviar</SelectItem>
                        </SelectContent>
                      </Select>
                      <Checkbox
                        checked={doc.required}
                        onCheckedChange={() => toggleDocumentRequired(doc)}
                      />
                      <Label className="text-xs text-gray-500">Obrigatório</Label>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDocument(doc.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex space-x-2">
                <Input
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  placeholder="Nome do novo documento"
                  className="flex-1"
                />
                <Select value={newDocType} onValueChange={(value: 'send' | 'receive') => setNewDocType(value)}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="receive">📥 Receber</SelectItem>
                    <SelectItem value="send">📤 Enviar</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="button" onClick={addDocument}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button 
                type="submit" 
                className="flex-1"
                disabled={isUpdating}
              >
                {isUpdating ? 'Salvando...' : 'Salvar Alterações'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                className="flex-1"
              >
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
