
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Client } from '@/types';
import { MessageSquare, Copy, Send } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface WhatsAppGeneratorProps {
  clients: Client[];
  selectedClient?: Client | null;
}

const WhatsAppGenerator: React.FC<WhatsAppGeneratorProps> = ({ clients, selectedClient }) => {
  const [client, setClient] = useState<Client | null>(selectedClient || null);
  const [includeDocuments, setIncludeDocuments] = useState(true);
  const [includeDriveLink, setIncludeDriveLink] = useState(false);
  const [includeTutorial, setIncludeTutorial] = useState(false);
  const [customMessage, setCustomMessage] = useState('');
  const [generatedMessage, setGeneratedMessage] = useState('');

  useEffect(() => {
    if (selectedClient) {
      setClient(selectedClient);
    }
  }, [selectedClient]);

  useEffect(() => {
    generateMessage();
  }, [client, includeDocuments, includeDriveLink, includeTutorial, customMessage]);

  const generateMessage = () => {
    if (!client) {
      setGeneratedMessage('');
      return;
    }

    let message = `Olá ${client.contact_name}! Tudo bem?\n\n`;
    message += `Aqui é da contabilidade. `;

    if (customMessage.trim()) {
      message += `${customMessage}\n\n`;
    } else {
      message += `Estou entrando em contato para organizar a documentação da ${client.company_name}.\n\n`;
    }

    if (includeDocuments && client.documents.length > 0) {
      const pendingReceiveDocs = client.documents.filter(doc => doc.document_type === 'receive' && !doc.received);
      const receivedDocs = client.documents.filter(doc => doc.document_type === 'receive' && doc.received);
      const sendDocs = client.documents.filter(doc => doc.document_type === 'send');

      if (pendingReceiveDocs.length > 0) {
        message += `📥 *Documentos que precisamos receber:*\n`;
        pendingReceiveDocs.forEach(doc => {
          message += `• ${doc.name}${doc.required ? ' *(obrigatório)*' : ''}\n`;
        });
        message += '\n';
      }

      if (sendDocs.length > 0) {
        message += `📤 *Documentos que enviaremos para você:*\n`;
        sendDocs.forEach(doc => {
          message += `• ${doc.name}\n`;
        });
        message += '\n';
      }

      if (receivedDocs.length > 0) {
        message += `✅ *Documentos já recebidos:*\n`;
        receivedDocs.forEach(doc => {
          message += `• ${doc.name}\n`;
        });
        message += '\n';
      }
    }

    if (includeDriveLink && client.drive_link) {
      message += `📁 *Link da pasta no Drive:*\n${client.drive_link}\n\n`;
    }

    if (includeTutorial) {
      message += `🔗 *Tutorial para acessar o Drive:*\n`;
      message += `1. Clique no link acima\n`;
      message += `2. Faça login com sua conta Google\n`;
      message += `3. Organize os documentos nas pastas correspondentes\n`;
      message += `4. Mantenha sempre atualizado\n\n`;
    }

    message += `Qualquer dúvida, pode me chamar! 😊\n\n`;
    message += `Obrigado!`;

    setGeneratedMessage(message);
  };

  const copyToClipboard = () => {
    if (!generatedMessage) return;
    
    navigator.clipboard.writeText(generatedMessage).then(() => {
      toast({
        title: "Mensagem copiada!",
        description: "A mensagem foi copiada para a área de transferência.",
      });
    }).catch(() => {
      toast({
        title: "Erro",
        description: "Não foi possível copiar a mensagem.",
        variant: "destructive",
      });
    });
  };

  const sendWhatsApp = () => {
    if (!client || !generatedMessage) return;

    const phoneNumber = client.phone.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(generatedMessage);
    const whatsappUrl = `https://wa.me/55${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "WhatsApp aberto!",
      description: "A mensagem foi enviada para o WhatsApp Web.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5" />
            <span>Gerador de Mensagens WhatsApp</span>
          </CardTitle>
          <CardDescription>
            Selecione um cliente e configure as opções para gerar uma mensagem personalizada
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Selecionar Cliente</Label>
            <Select value={client?.id || ''} onValueChange={(value) => {
              const selectedClient = clients.find(c => c.id === value);
              setClient(selectedClient || null);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Escolha um cliente" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.company_name} - {c.contact_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {client && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeDocuments"
                    checked={includeDocuments}
                    onCheckedChange={(checked) => setIncludeDocuments(checked === true)}
                  />
                  <Label htmlFor="includeDocuments" className="text-sm">
                    Incluir lista de documentos
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeDriveLink"
                    checked={includeDriveLink}
                    onCheckedChange={(checked) => setIncludeDriveLink(checked === true)}
                  />
                  <Label htmlFor="includeDriveLink" className="text-sm">
                    Incluir link do Drive
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="includeTutorial"
                    checked={includeTutorial}
                    onCheckedChange={(checked) => setIncludeTutorial(checked === true)}
                  />
                  <Label htmlFor="includeTutorial" className="text-sm">
                    Incluir tutorial do Drive
                  </Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customMessage">Mensagem personalizada (opcional)</Label>
                <Textarea
                  id="customMessage"
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder="Digite uma mensagem personalizada que substituirá a mensagem padrão..."
                  rows={3}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {generatedMessage && (
        <Card>
          <CardHeader>
            <CardTitle>Mensagem Gerada</CardTitle>
            <CardDescription>
              Revise a mensagem antes de enviar ou copiar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={generatedMessage}
              onChange={(e) => setGeneratedMessage(e.target.value)}
              rows={15}
              className="font-mono text-sm"
            />
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={copyToClipboard} variant="outline" className="flex-1">
                <Copy className="h-4 w-4 mr-2" />
                Copiar Mensagem
              </Button>
              <Button onClick={sendWhatsApp} className="flex-1">
                <Send className="h-4 w-4 mr-2" />
                Enviar no WhatsApp
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WhatsAppGenerator;
