
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Save, Trash2, Edit } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface MessageTemplate {
  id: string;
  name: string;
  content: string;
}

interface MessageTemplateManagerProps {
  templates: MessageTemplate[];
  onSave: (templates: MessageTemplate[]) => void;
}

const MessageTemplateManager: React.FC<MessageTemplateManagerProps> = ({ templates, onSave }) => {
  const [localTemplates, setLocalTemplates] = useState<MessageTemplate[]>(templates);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newTemplate, setNewTemplate] = useState({ name: '', content: '' });

  const availableVariables = [
    { key: 'contact_name', label: 'Nome do Contato' },
    { key: 'company_name', label: 'Nome da Empresa' },
    { key: 'phone', label: 'Telefone' },
    { key: 'documents_list', label: 'Lista de Documentos' },
    { key: 'document_path', label: 'Caminho do Documento' }
  ];

  const handleAddTemplate = () => {
    if (!newTemplate.name.trim() || !newTemplate.content.trim()) {
      toast({
        title: "Erro",
        description: "Nome e conteúdo são obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const template: MessageTemplate = {
      id: Date.now().toString(),
      name: newTemplate.name,
      content: newTemplate.content
    };

    const updatedTemplates = [...localTemplates, template];
    setLocalTemplates(updatedTemplates);
    setNewTemplate({ name: '', content: '' });
    setIsAdding(false);
    
    toast({
      title: "Template adicionado!",
      description: "O template foi criado com sucesso.",
    });
  };

  const handleUpdateTemplate = (id: string, updatedTemplate: Partial<MessageTemplate>) => {
    const updatedTemplates = localTemplates.map(template => 
      template.id === id ? { ...template, ...updatedTemplate } : template
    );
    setLocalTemplates(updatedTemplates);
    setEditingId(null);
    
    toast({
      title: "Template atualizado!",
      description: "As alterações foram salvas.",
    });
  };

  const handleDeleteTemplate = (id: string) => {
    const updatedTemplates = localTemplates.filter(template => template.id !== id);
    setLocalTemplates(updatedTemplates);
    
    toast({
      title: "Template removido!",
      description: "O template foi excluído.",
    });
  };

  const insertVariable = (variable: string, targetTextarea: HTMLTextAreaElement) => {
    const start = targetTextarea.selectionStart;
    const end = targetTextarea.selectionEnd;
    const text = targetTextarea.value;
    const before = text.substring(0, start);
    const after = text.substring(end);
    const newText = before + `{{${variable}}}` + after;
    
    return newText;
  };

  const handleSaveAll = () => {
    onSave(localTemplates);
    toast({
      title: "Templates salvos!",
      description: "Todos os templates foram salvos no cliente.",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Templates de Mensagem</h3>
        <div className="flex space-x-2">
          <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Template
          </Button>
          <Button onClick={handleSaveAll} variant="default">
            <Save className="h-4 w-4 mr-2" />
            Salvar Todos
          </Button>
        </div>
      </div>

      {isAdding && (
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle>Novo Template</CardTitle>
            <CardDescription>
              Crie um template personalizado para mensagens
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nome do Template</Label>
              <Input
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                placeholder="Ex: Solicitar documentos MEI"
              />
            </div>

            <div className="space-y-2">
              <Label>Conteúdo da Mensagem</Label>
              <Textarea
                value={newTemplate.content}
                onChange={(e) => setNewTemplate({...newTemplate, content: e.target.value})}
                placeholder="Digite sua mensagem aqui..."
                className="min-h-[200px]"
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {availableVariables.map((variable) => (
                <Button
                  key={variable.key}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
                    if (textarea) {
                      const newContent = insertVariable(variable.key, textarea);
                      setNewTemplate({...newTemplate, content: newContent});
                    }
                  }}
                  className="text-xs"
                >
                  <Badge variant="secondary" className="mr-1 text-xs">
                    {`{{${variable.key}}}`}
                  </Badge>
                  {variable.label}
                </Button>
              ))}
            </div>

            <div className="flex space-x-2">
              <Button onClick={handleAddTemplate} className="flex-1">
                Criar Template
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsAdding(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-4">
        {localTemplates.map((template) => (
          <Card key={template.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{template.name}</CardTitle>
                <div className="flex space-x-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingId(template.id)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteTemplate(template.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {editingId === template.id ? (
                <EditTemplateForm 
                  template={template}
                  onSave={(updatedTemplate) => handleUpdateTemplate(template.id, updatedTemplate)}
                  onCancel={() => setEditingId(null)}
                  availableVariables={availableVariables}
                />
              ) : (
                <div className="bg-gray-50 p-3 rounded-lg text-sm whitespace-pre-wrap">
                  {template.content}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {localTemplates.length === 0 && !isAdding && (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum template configurado</h3>
          <p className="text-gray-500">Crie templates personalizados para suas mensagens.</p>
        </div>
      )}
    </div>
  );
};

const EditTemplateForm: React.FC<{
  template: MessageTemplate;
  onSave: (template: Partial<MessageTemplate>) => void;
  onCancel: () => void;
  availableVariables: { key: string; label: string; }[];
}> = ({ template, onSave, onCancel, availableVariables }) => {
  const [editData, setEditData] = useState({
    name: template.name,
    content: template.content
  });

  const insertVariable = (variable: string) => {
    const textarea = document.querySelector(`#edit-content-${template.id}`) as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const text = textarea.value;
      const before = text.substring(0, start);
      const after = text.substring(end);
      const newText = before + `{{${variable}}}` + after;
      setEditData({...editData, content: newText});
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Nome do Template</Label>
        <Input
          value={editData.name}
          onChange={(e) => setEditData({...editData, name: e.target.value})}
        />
      </div>

      <div className="space-y-2">
        <Label>Conteúdo</Label>
        <Textarea
          id={`edit-content-${template.id}`}
          value={editData.content}
          onChange={(e) => setEditData({...editData, content: e.target.value})}
          className="min-h-[200px]"
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {availableVariables.map((variable) => (
          <Button
            key={variable.key}
            variant="outline"
            size="sm"
            onClick={() => insertVariable(variable.key)}
            className="text-xs"
          >
            <Badge variant="secondary" className="mr-1 text-xs">
              {`{{${variable.key}}}`}
            </Badge>
            {variable.label}
          </Button>
        ))}
      </div>

      <div className="flex space-x-2">
        <Button onClick={() => onSave(editData)} className="flex-1">
          Salvar
        </Button>
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Cancelar
        </Button>
      </div>
    </div>
  );
};

export default MessageTemplateManager;
