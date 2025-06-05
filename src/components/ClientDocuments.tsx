
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Document, Client } from '@/types';
import { useDocuments } from '@/hooks/useDocuments';
import { FileText, Plus, Edit, Trash2, FolderOpen } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ClientDocumentsProps {
  client: Client;
}

const ClientDocuments: React.FC<ClientDocumentsProps> = ({ client }) => {
  const { documents, addDocument, updateDocument, deleteDocument } = useDocuments(client.id);
  const [isAdding, setIsAdding] = useState(false);
  const [editingDoc, setEditingDoc] = useState<string | null>(null);
  const [newDoc, setNewDoc] = useState({
    name: '',
    drive_path: '',
    document_type: 'receive' as 'send' | 'receive',
    required: true,
    received: false
  });

  const commonPaths = [
    'MEI > DAS',
    'MEI > DASN',
    'Documentos > Contratos',
    'Documentos > Impostos > IR',
    'Documentos > Impostos > IRPJ',
    'Documentos > Impostos > CSLL',
    'Documentos > Contabilidade > Balancetes',
    'Documentos > Contabilidade > DRE',
    'Documentos > RH > Folha de Pagamento',
    'Documentos > RH > FGTS',
    'Documentos > Certidões > CND Federal',
    'Documentos > Certidões > CND Estadual',
    'Documentos > Certidões > CND Municipal'
  ];

  const handleAddDocument = () => {
    if (!newDoc.name.trim()) {
      toast({
        title: "Erro",
        description: "Nome do documento é obrigatório.",
        variant: "destructive",
      });
      return;
    }

    addDocument({
      client_id: client.id,
      ...newDoc
    });

    setNewDoc({
      name: '',
      drive_path: '',
      document_type: 'receive',
      required: true,
      received: false
    });
    setIsAdding(false);

    toast({
      title: "Documento adicionado!",
      description: "O documento foi configurado com sucesso.",
    });
  };

  const handleUpdateDocument = (docId: string, updates: Partial<Document>) => {
    updateDocument(docId, updates);
    setEditingDoc(null);
    toast({
      title: "Documento atualizado!",
      description: "As alterações foram salvas com sucesso.",
    });
  };

  const handleDeleteDocument = (docId: string) => {
    deleteDocument(docId);
    toast({
      title: "Documento removido!",
      description: "O documento foi removido da configuração.",
    });
  };

  const DocumentCard = ({ doc }: { doc: Document }) => {
    const isEditing = editingDoc === doc.id;
    const [editData, setEditData] = useState({
      name: doc.name,
      drive_path: doc.drive_path || '',
      document_type: doc.document_type,
      required: doc.required,
      received: doc.received
    });

    if (isEditing) {
      return (
        <Card className="border-blue-200">
          <CardContent className="p-4 space-y-4">
            <div className="space-y-2">
              <Label>Nome do Documento</Label>
              <Input
                value={editData.name}
                onChange={(e) => setEditData({...editData, name: e.target.value})}
                placeholder="Nome do documento"
              />
            </div>

            <div className="space-y-2">
              <Label>Caminho no Drive</Label>
              <Select 
                value={editData.drive_path} 
                onValueChange={(value) => setEditData({...editData, drive_path: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione ou digite um caminho..." />
                </SelectTrigger>
                <SelectContent>
                  {commonPaths.map((path) => (
                    <SelectItem key={path} value={path}>
                      {path}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                value={editData.drive_path}
                onChange={(e) => setEditData({...editData, drive_path: e.target.value})}
                placeholder="Ou digite um caminho personalizado..."
                className="mt-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select 
                  value={editData.document_type} 
                  onValueChange={(value: 'send' | 'receive') => setEditData({...editData, document_type: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="receive">📥 Receber</SelectItem>
                    <SelectItem value="send">📤 Enviar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={editData.required}
                    onCheckedChange={(checked) => setEditData({...editData, required: checked})}
                  />
                  <Label>Obrigatório</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={editData.received}
                    onCheckedChange={(checked) => setEditData({...editData, received: checked})}
                  />
                  <Label>Recebido</Label>
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button 
                size="sm" 
                onClick={() => handleUpdateDocument(doc.id, editData)}
                className="flex-1"
              >
                Salvar
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setEditingDoc(null)}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <FileText className="h-4 w-4 text-gray-500" />
                <h4 className="font-medium">{doc.name}</h4>
                <Badge variant={doc.document_type === 'send' ? 'default' : 'secondary'}>
                  {doc.document_type === 'send' ? '📤 Enviar' : '📥 Receber'}
                </Badge>
              </div>
              
              {doc.drive_path && (
                <div className="flex items-center space-x-1 text-sm text-gray-600 mb-2">
                  <FolderOpen className="h-3 w-3" />
                  <span>{doc.drive_path}</span>
                </div>
              )}

              <div className="flex space-x-2">
                {doc.required && (
                  <Badge variant="outline" className="text-xs">
                    Obrigatório
                  </Badge>
                )}
                <Badge 
                  variant={doc.received ? 'default' : 'destructive'} 
                  className="text-xs"
                >
                  {doc.received ? '✅ Recebido' : '❌ Pendente'}
                </Badge>
              </div>
            </div>

            <div className="flex space-x-1">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setEditingDoc(doc.id)}
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDeleteDocument(doc.id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Documentos do Cliente</h3>
        </div>
        <Button onClick={() => setIsAdding(true)} disabled={isAdding}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Documento
        </Button>
      </div>

      {isAdding && (
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="text-lg">Novo Documento</CardTitle>
            <CardDescription>
              Configure um novo documento para este cliente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Nome do Documento</Label>
              <Input
                value={newDoc.name}
                onChange={(e) => setNewDoc({...newDoc, name: e.target.value})}
                placeholder="Ex: Declaração de IR 2024"
              />
            </div>

            <div className="space-y-2">
              <Label>Caminho no Drive</Label>
              <Select 
                value={newDoc.drive_path} 
                onValueChange={(value) => setNewDoc({...newDoc, drive_path: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um caminho..." />
                </SelectTrigger>
                <SelectContent>
                  {commonPaths.map((path) => (
                    <SelectItem key={path} value={path}>
                      {path}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input
                value={newDoc.drive_path}
                onChange={(e) => setNewDoc({...newDoc, drive_path: e.target.value})}
                placeholder="Ou digite um caminho personalizado..."
                className="mt-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo de Documento</Label>
                <Select 
                  value={newDoc.document_type} 
                  onValueChange={(value: 'send' | 'receive') => setNewDoc({...newDoc, document_type: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="receive">📥 Receber do Cliente</SelectItem>
                    <SelectItem value="send">📤 Enviar ao Cliente</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={newDoc.required}
                    onCheckedChange={(checked) => setNewDoc({...newDoc, required: checked})}
                  />
                  <Label>Documento obrigatório</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={newDoc.received}
                    onCheckedChange={(checked) => setNewDoc({...newDoc, received: checked})}
                  />
                  <Label>Já foi recebido</Label>
                </div>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button onClick={handleAddDocument} className="flex-1">
                Adicionar Documento
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc) => (
          <DocumentCard key={doc.id} doc={doc} />
        ))}
        
        {documents.length === 0 && !isAdding && (
          <div className="col-span-full text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum documento configurado</h3>
            <p className="text-gray-500">Adicione documentos para este cliente.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDocuments;
