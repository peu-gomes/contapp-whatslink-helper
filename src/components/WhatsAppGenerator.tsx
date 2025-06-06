
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Client } from '@/types';
import { useDocuments } from '@/hooks/useDocuments';
import { MessageSquare, Copy, Send } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface WhatsAppGeneratorProps {
  clients: Client[];
}

const WhatsAppGenerator: React.FC<WhatsAppGeneratorProps> = ({ clients }) => {
  const [currentClient, setCurrentClient] = useState<Client | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const { documents } = useDocuments(currentClient?.id || '');

  // Reset states when client changes
  useEffect(() => {
    if (currentClient) {
      setSelectedTemplate('');
      setGeneratedMessage('');
      setSelectedDocuments([]);
    }
  }, [currentClient]);

  const generateMessage = () => {
    console.log('Gerando mensagem...');
    console.log('Cliente atual:', currentClient);
    console.log('Template selecionado:', selectedTemplate);
    console.log('Templates do cliente:', currentClient?.message_templates);

    if (!currentClient || !selectedTemplate) {
      toast({
        title: "Erro",
        description: "Selecione um cliente e um template primeiro.",
        variant: "destructive",
      });
      return;
    }

    const template = currentClient.message_templates?.find(t => t.id === selectedTemplate);
    if (!template) {
      toast({
        title: "Erro",
        description: "Template não encontrado.",
        variant: "destructive",
      });
      return;
    }

    // Filtrar documentos selecionados
    const clientDocs = documents.filter(doc => selectedDocuments.includes(doc.id));
    
    // Gerar lista de documentos
    let documentsList = '';
    let documentPath = '';
    
    if (clientDocs.length > 0) {
      clientDocs.forEach((doc, index) => {
        documentsList += `${index + 1}. ${doc.name}`;
        if (doc.drive_path) {
          documentsList += ` (${doc.drive_path})`;
          if (index === 0) documentPath = doc.drive_path; // Primeiro documento para a variável path
        }
        documentsList += '\n';
      });
    } else {
      documentsList = 'Nenhum documento selecionado';
    }

    // Substituir variáveis no template
    let message = template.content
      .replace(/\{\{contact_name\}\}/g, currentClient.contact_name)
      .replace(/\{\{company_name\}\}/g, currentClient.company_name)
      .replace(/\{\{phone\}\}/g, currentClient.phone)
      .replace(/\{\{documents_list\}\}/g, documentsList.trim())
      .replace(/\{\{document_path\}\}/g, documentPath);

    console.log('Mensagem gerada:', message);
    setGeneratedMessage(message);

    toast({
      title: "Mensagem gerada!",
      description: "A mensagem foi gerada com sucesso.",
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedMessage);
    toast({
      title: "Copiado!",
      description: "Mensagem copiada para a área de transferência.",
    });
  };

  const openWhatsApp = () => {
    if (!currentClient) return;
    
    const phone = currentClient.phone.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(generatedMessage);
    const whatsappUrl = `https://wa.me/55${phone}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const toggleDocument = (docId: string) => {
    setSelectedDocuments(prev => 
      prev.includes(docId) 
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    );
  };

  const handleClientChange = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    console.log('Cliente selecionado:', client);
    setCurrentClient(client || null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gerador de Mensagens WhatsApp</h2>
        <MessageSquare className="h-8 w-8 text-green-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações da Mensagem</CardTitle>
              <CardDescription>
                Configure os parâmetros para gerar a mensagem personalizada
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="client-select">Cliente</Label>
                <Select
                  value={currentClient?.id || ''}
                  onValueChange={handleClientChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.company_name} - {client.contact_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {currentClient && currentClient.message_templates && currentClient.message_templates.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="template-select">Template de Mensagem</Label>
                  <Select
                    value={selectedTemplate}
                    onValueChange={setSelectedTemplate}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um template" />
                    </SelectTrigger>
                    <SelectContent>
                      {currentClient.message_templates.map((template) => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {currentClient && (!currentClient.message_templates || currentClient.message_templates.length === 0) && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    Este cliente não possui templates configurados. Vá para a aba "Clientes" → "Editar" → "Templates" para criar um template.
                  </p>
                </div>
              )}

              {currentClient && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Informações do Cliente:</h4>
                  <p className="text-sm text-gray-600">
                    <strong>Empresa:</strong> {currentClient.company_name}<br />
                    <strong>Contato:</strong> {currentClient.contact_name}<br />
                    <strong>Telefone:</strong> {currentClient.phone}
                  </p>
                  <div className="flex space-x-2 mt-2">
                    {currentClient.message_templates && (
                      <Badge variant="secondary">
                        {currentClient.message_templates.length} template(s) configurado(s)
                      </Badge>
                    )}
                    <Badge variant="outline">
                      {documents.length} documento(s) configurado(s)
                    </Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {currentClient && documents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Selecionar Documentos</CardTitle>
                <CardDescription>
                  Escolha os documentos que aparecerão na mensagem
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                      <Checkbox
                        checked={selectedDocuments.includes(doc.id)}
                        onCheckedChange={() => toggleDocument(doc.id)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{doc.name}</span>
                          {doc.required && (
                            <Badge variant="outline" className="text-xs">
                              Obrigatório
                            </Badge>
                          )}
                        </div>
                        {doc.drive_path && (
                          <p className="text-sm text-gray-600 mt-1">
                            📁 {doc.drive_path}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex space-x-2">
            <Button 
              onClick={generateMessage} 
              className="flex-1" 
              disabled={!currentClient || !selectedTemplate}
            >
              Gerar Mensagem
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Mensagem Gerada</CardTitle>
              <CardDescription>
                Mensagem personalizada pronta para envio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={generatedMessage}
                onChange={(e) => setGeneratedMessage(e.target.value)}
                placeholder="A mensagem gerada aparecerá aqui..."
                className="min-h-[300px] resize-none"
              />
              
              {generatedMessage && (
                <div className="flex space-x-2">
                  <Button onClick={copyToClipboard} variant="outline" className="flex-1">
                    <Copy className="h-4 w-4 mr-2" />
                    Copiar
                  </Button>
                  <Button onClick={openWhatsApp} className="flex-1 bg-green-600 hover:bg-green-700">
                    <Send className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {!currentClient && (
            <Card>
              <CardHeader>
                <CardTitle>Como usar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600 space-y-2">
                  <p>1. Selecione um cliente</p>
                  <p>2. Escolha um template de mensagem</p>
                  <p>3. Selecione os documentos (opcional)</p>
                  <p>4. Gere e envie a mensagem</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default WhatsAppGenerator;
