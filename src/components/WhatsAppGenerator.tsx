
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Client } from '@/types';
import { useDocuments } from '@/hooks/useDocuments';
import { useMessageTemplates } from '@/hooks/useMessageTemplates';
import { MessageSquare, Copy, Send, Settings } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface WhatsAppGeneratorProps {
  clients: Client[];
  selectedClient: Client | null;
}

const WhatsAppGenerator: React.FC<WhatsAppGeneratorProps> = ({ clients, selectedClient }) => {
  const [currentClient, setCurrentClient] = useState<Client | null>(selectedClient);
  const [messageType, setMessageType] = useState<'send' | 'receive'>('receive');
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const { documents } = useDocuments(currentClient?.id || '');
  const { templates } = useMessageTemplates();

  const generateMessage = () => {
    if (!currentClient) {
      toast({
        title: "Erro",
        description: "Selecione um cliente primeiro.",
        variant: "destructive",
      });
      return;
    }

    // Filtrar documentos selecionados do tipo correto
    const clientDocs = documents.filter(doc => 
      doc.document_type === messageType && 
      selectedDocuments.includes(doc.id)
    );
    
    if (clientDocs.length === 0) {
      toast({
        title: "Aviso",
        description: "Selecione pelo menos um documento para gerar a mensagem.",
        variant: "destructive",
      });
      return;
    }

    // Usar template personalizado do cliente ou template padrão
    let template = '';
    if (messageType === 'receive' && currentClient.message_template_receive) {
      template = currentClient.message_template_receive;
    } else if (messageType === 'send' && currentClient.message_template_send) {
      template = currentClient.message_template_send;
    } else {
      // Usar template padrão
      const defaultTemplate = templates.find(t => t.type === messageType && t.is_default);
      template = defaultTemplate?.content || '';
    }

    // Gerar lista de documentos
    let documentsList = '';
    clientDocs.forEach((doc, index) => {
      const status = doc.received ? '✅' : '❌';
      const path = doc.drive_path ? ` (${doc.drive_path})` : '';
      documentsList += `${index + 1}. ${doc.name}${path}`;
      
      if (messageType === 'receive') {
        documentsList += ` ${status}`;
      }
      
      documentsList += '\n';
    });

    // Substituir variáveis no template
    let message = template
      .replace(/\{\{contact_name\}\}/g, currentClient.contact_name)
      .replace(/\{\{company_name\}\}/g, currentClient.company_name)
      .replace(/\{\{phone\}\}/g, currentClient.phone)
      .replace(/\{\{documents_list\}\}/g, documentsList.trim());

    setGeneratedMessage(message);
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

  const filteredDocuments = documents.filter(doc => doc.document_type === messageType);

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
                  onValueChange={(value) => {
                    const client = clients.find(c => c.id === value);
                    setCurrentClient(client || null);
                    setSelectedDocuments([]);
                  }}
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

              <div className="space-y-2">
                <Label htmlFor="message-type">Tipo de Mensagem</Label>
                <Select
                  value={messageType}
                  onValueChange={(value: 'send' | 'receive') => {
                    setMessageType(value);
                    setSelectedDocuments([]);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="receive">📥 Solicitar Documentos</SelectItem>
                    <SelectItem value="send">📤 Enviar Documentos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {currentClient && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Informações do Cliente:</h4>
                  <p className="text-sm text-gray-600">
                    <strong>Empresa:</strong> {currentClient.company_name}<br />
                    <strong>Contato:</strong> {currentClient.contact_name}<br />
                    <strong>Telefone:</strong> {currentClient.phone}
                  </p>
                  {((messageType === 'receive' && currentClient.message_template_receive) ||
                    (messageType === 'send' && currentClient.message_template_send)) && (
                    <Badge variant="secondary" className="mt-2">
                      Template personalizado configurado
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {currentClient && filteredDocuments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Selecionar Documentos</CardTitle>
                <CardDescription>
                  Escolha os documentos que aparecerão na mensagem
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {filteredDocuments.map((doc) => (
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
                          <Badge 
                            variant={doc.received ? 'default' : 'destructive'} 
                            className="text-xs"
                          >
                            {doc.received ? '✅' : '❌'}
                          </Badge>
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
              disabled={!currentClient || selectedDocuments.length === 0}
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

          {currentClient && (
            <Card>
              <CardHeader>
                <CardTitle>Template Atual</CardTitle>
                <CardDescription>
                  {messageType === 'receive' ? 'Solicitar documentos' : 'Enviar documentos'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">
                  {((messageType === 'receive' && currentClient.message_template_receive) ||
                    (messageType === 'send' && currentClient.message_template_send)) ? (
                    <div>
                      <Badge variant="default" className="mb-2">Template Personalizado</Badge>
                      <p>Este cliente possui um template personalizado configurado.</p>
                    </div>
                  ) : (
                    <div>
                      <Badge variant="secondary" className="mb-2">Template Padrão</Badge>
                      <p>Usando template padrão do sistema. Configure um template personalizado nas configurações do cliente.</p>
                    </div>
                  )}
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
