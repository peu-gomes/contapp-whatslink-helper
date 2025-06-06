
import { useState, useEffect } from 'react';
import { MessageTemplate } from '@/types';

export const useMessageTemplates = () => {
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Para demonstração, criar templates mock
    const mockTemplates: MessageTemplate[] = [
      {
        id: '1',
        name: 'Template Padrão - Solicitar Documentos',
        content: `Olá {{contact_name}}!

Precisamos dos seguintes documentos da {{company_name}}:

{{documents_list}}

Por favor, envie os documentos pendentes o mais breve possível.

Obrigado!`,
      },
      {
        id: '2',
        name: 'Template Padrão - Enviar Documentos',
        content: `Olá {{contact_name}}!

Seguem os documentos da {{company_name}}:

{{documents_list}}

Todos os documentos estão organizados no Drive.

Qualquer dúvida, estamos à disposição!`,
      }
    ];
    
    setTemplates(mockTemplates);
    setIsLoading(false);
  }, []);

  return {
    templates,
    isLoading
  };
};
