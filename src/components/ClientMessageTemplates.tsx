
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Client, MessageTemplate } from '@/types';
import { useMessageTemplates } from '@/hooks/useMessageTemplates';
import { MessageSquare, Copy, RotateCcw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ClientMessageTemplatesProps {
  client: Client;
  onSave: (updates: Partial<Client>) => void;
}

const ClientMessageTemplates: React.FC<ClientMessageTemplatesProps> = ({ client, onSave }) => {
  const { templates } = useMessageTemplates();
  const [receiveTemplate, setReceiveTemplate] = useState(client.message_template_receive || '');
  const [sendTemplate, setSendTemplate] = useState(client.message_template_send || '');
  const [activeTab, setActiveTab] = useState<'receive' | 'send'>('receive');

  const availableVariables = [
    'contact_name', 'company_name', 'phone', 'documents_list'
  ];

  const handleLoadTemplate = (templateId: string, type: 'receive' | 'send') => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      if (type === 'receive') {
        setReceiveTemplate(template.content);
      } else {
        setSendTemplate(template.content);
      }
      toast({
        title: "Template carregado!",
        description: "O template foi carregado com sucesso.",
      });
    }
  };

  const handleSave = () => {
    onSave({
      message_template_receive: receiveTemplate,
      message_template_send: sendTemplate
    });
    toast({
      title: "Templates salvos!",
      description: "Os templates de mensagem foram salvos com sucesso.",
    });
  };

  const insertVariable = (variable: string) => {
    const currentTemplate = activeTab === 'receive' ? receiveTemplate : sendTemplate;
    const updatedTemplate = currentTemplate + `{{${variable}}}`;
    
    if (activeTab === 'receive') {
      setReceiveTemplate(updatedTemplate);
    } else {
      setSendTemplate(updatedTemplate);
    }
  };

  const currentTemplate = activeTab === 'receive' ? receiveTemplate : sendTemplate;
  const setCurrentTemplate = activeTab === 'receive' ? setReceiveTemplate : setSendTemplate;
  const availableTemplates = templates.filter(t => t.type === activeTab);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <MessageSquare className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Templates de Mensagem</h3>
        </div>
      </div>

      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <Button
          variant={activeTab === 'receive' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('receive')}
          className="flex-1"
        >
          📥 Solicitar Documentos
        </Button>
        <Button
          variant={activeTab === 'send' ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setActiveTab('send')}
          className="flex-1"
        >
          📤 Enviar Documentos
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                Editor de Template - {activeTab === 'receive' ? 'Solicitar' : 'Enviar'}
              </CardTitle>
              <CardDescription>
                Personalize a mensagem que será gerada para este cliente
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Template Base</Label>
                <Select onValueChange={(value) => handleLoadTemplate(value, activeTab)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Carregar template base..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Conteúdo da Mensagem</Label>
                <Textarea
                  value={currentTemplate}
                  onChange={(e) => setCurrentTemplate(e.target.value)}
                  placeholder="Digite sua mensagem personalizada aqui..."
                  className="min-h-[300px] resize-none font-mono text-sm"
                />
              </div>

              <div className="flex space-x-2">
                <Button onClick={handleSave} className="flex-1">
                  Salvar Template
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setCurrentTemplate('')}
                  className="flex items-center space-x-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  <span>Limpar</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Variáveis Disponíveis</CardTitle>
              <CardDescription>
                Clique para inserir no template
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-2">
                {availableVariables.map((variable) => (
                  <Button
                    key={variable}
                    variant="outline"
                    size="sm"
                    onClick={() => insertVariable(variable)}
                    className="justify-start text-left"
                  >
                    <Badge variant="secondary" className="mr-2">
                      {`{{${variable}}}`}
                    </Badge>
                    {variable === 'contact_name' && 'Nome do Contato'}
                    {variable === 'company_name' && 'Nome da Empresa'}
                    {variable === 'phone' && 'Telefone'}
                    {variable === 'documents_list' && 'Lista de Documentos'}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>
                Como ficará a mensagem
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-3 rounded-lg text-sm whitespace-pre-wrap">
                {currentTemplate
                  .replace(/\{\{contact_name\}\}/g, client.contact_name)
                  .replace(/\{\{company_name\}\}/g, client.company_name)
                  .replace(/\{\{phone\}\}/g, client.phone)
                  .replace(/\{\{documents_list\}\}/g, '• Documento 1\n• Documento 2') || 
                  'Digite um template para ver o preview...'}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClientMessageTemplates;
