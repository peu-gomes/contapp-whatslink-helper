
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Client } from '@/types';
import { useDocuments } from '@/hooks/useDocuments';
import { MessageSquare, Copy, Send } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface WhatsAppGeneratorProps {
  clients: Client[];
  selectedClient: Client | null;
}

const WhatsAppGenerator: React.FC<WhatsAppGeneratorProps> = ({ clients, selectedClient }) => {
  const [currentClient, setCurrentClient] = useState<Client | null>(selectedClient);
  const [messageType, setMessageType] = useState<'send' | 'receive'>('receive');
  const [generatedMessage, setGeneratedMessage] = useState('');
  const { documents } = useDocuments(currentClient?.id || '');

  const generateMessage = () => {
    if (!currentClient) {
      toast({
        title: "Erro",
        description: "Selecione um cliente primeiro.",
        variant: "destructive",
      });
      return;
    }

    const filteredDocs = documents.filter(doc => doc.document_type === messageType);
    
    if (filteredDocs.length === 0) {
      toast({
        title: "Aviso",
        description: `Nenhum documento do tipo "${messageType === 'send' ? 'envio' : 'recebimento'}" encontrado para este cliente.`,
        variant: "destructive",
      });
      return;
    }

    let message = '';
    
    if (messageType === 'receive') {
      message = `Olá ${currentClient.contact_name}!\n\n`;
      message += `Precisamos dos seguintes documentos da ${currentClient.company_name}:\n\n`;
      
      filteredDocs.forEach((doc, index) => {
        const status = doc.received ? '✅' : '❌';
        const path = doc.drive_path ? ` (${doc.drive_path})` : '';
        message += `${index + 1}. ${doc.name}${path} ${status}\n`;
      });
      
      message += `\nPor favor, envie os documentos pendentes o mais breve possível.\n\nObrigado!`;
    } else {
      message = `Olá ${currentClient.contact_name}!\n\n`;
      message += `Seguem os documentos da ${currentClient.company_name}:\n\n`;
      
      filteredDocs.forEach((doc, index) => {
        const path = doc.drive_path ? ` > ${doc.drive_path}` : '';
        message += `${index + 1}. ${doc.name}${path}\n`;
      });
      
      message += `\nTodos os documentos estão organizados no Drive.\n\nQualquer dúvida, estamos à disposição!`;
    }

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Gerador de Mensagens WhatsApp</h2>
        <MessageSquare className="h-8 w-8 text-green-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                onValueChange={(value: 'send' | 'receive') => setMessageType(value)}
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
              </div>
            )}

            <Button onClick={generateMessage} className="w-full" disabled={!currentClient}>
              Gerar Mensagem
            </Button>
          </CardContent>
        </Card>

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
                  Enviar WhatsApp
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WhatsAppGenerator;
