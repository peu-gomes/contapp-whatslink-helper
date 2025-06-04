
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Profile {
  id: string;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  user_id: string;
  company_name: string;
  contact_name: string;
  phone: string;
  drive_link?: string;
  documents: Document[];
  created_at: string;
  updated_at: string;
}

export interface Document {
  id: string;
  client_id: string;
  name: string;
  drive_path?: string;
  document_type: 'send' | 'receive';
  required: boolean;
  received: boolean;
  created_at: string;
  updated_at: string;
}

export interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  variables: string[];
}

export interface DriveFolder {
  id: string;
  name: string;
  path: string;
  parents: string[];
}
