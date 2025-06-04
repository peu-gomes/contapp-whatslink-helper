
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Client, Document } from '@/types';
import { Plus, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ClientFormProps {
  onSave: (client: Omit<Client, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const defaultDocuments: Omit<Document, 'id'>[] = [
  { name: 'RG/CPF', path: '/documentos/rg-cpf', required: true, received: false },
  { name: 'Comprovante de Residência', path: '/documentos/comprovante-residencia', required: true, received: false },
  { name: 'Contrato Social', path: '/documentos/contrato-social', required: false, received: false },
  { name: 'Cartão CNPJ', path: '/documentos/cartao-cnpj', required: false, received: false },
  { name: 'Balancete', path: '/documentos/balancete', required: false, received: false },
];

const ClientForm: React.FC<ClientFormProps> = ({ onSave }) => {
  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [phone, setPhone] = useState('');
  const [driveLink, setDriveLink] = useState('');
  const [documents, setDocuments] = useState<Document[]>(
    defaultDocuments.map((doc, index) => ({ ...doc, id: index.toString() }))
  );
  const [newDocName, setNewDocName] = useState('');

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

    onSave({
      companyName,
      contactName,
      phone,
      driveLink,
      documents,
    });

    toast({
      title: "Cliente cadastrado!",
      description: "Cliente foi adicionado com sucesso ao sistema.",
    });
  };

  const addDocument = () => {
    if (!newDocName.trim()) return;
    
    const newDoc: Document = {
      id: Date.now().toString(),
      name: newDocName,
      path: `/documentos/${newDocName.toLowerCase().replace(/\s+/g, '-')}`,
      required: false,
      received: false,
    };
    
    setDocuments([...documents, newDoc]);
    setNewDocName('');
  };

  const removeDocument = (docId: string) => {
    setDocuments(documents.filter(doc => doc.id !== docId));
  };

  const toggleDocumentReceived = (docId: string) => {
    setDocuments(documents.map(doc => 
      doc.id === docId ? { ...doc, received: !doc.received } : doc
    ));
  };

  const toggleDocumentRequired = (docId: string) => {
    setDocuments(documents.map(doc => 
      doc.id === docId ? { ...doc, required: !doc.required } : doc
    ));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Adicionar Novo Cliente</CardTitle>
          <CardDescription>
            Preencha as informações do cliente e configure os documentos necessários
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
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <Checkbox
                      checked={doc.received}
                      onCheckedChange={() => toggleDocumentReceived(doc.id)}
                    />
                    <div className="flex-1">
                      <span className={doc.received ? 'line-through text-gray-500' : ''}>
                        {doc.name}
                      </span>
                      {doc.required && <span className="text-red-500 ml-1">*</span>}
                    </div>
                    <Checkbox
                      checked={doc.required}
                      onCheckedChange={() => toggleDocumentRequired(doc.id)}
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
                ))}
              </div>

              <div className="flex space-x-2">
                <Input
                  value={newDocName}
                  onChange={(e) => setNewDocName(e.target.value)}
                  placeholder="Nome do novo documento"
                />
                <Button type="button" onClick={addDocument}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Button type="submit" className="w-full">
              Salvar Cliente
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientForm;
