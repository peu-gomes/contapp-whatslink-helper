
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Client {
  id: string;
  companyName: string;
  contactName: string;
  phone: string;
  driveLink: string;
  documents: Document[];
  createdAt: string;
  updatedAt: string;
}

export interface Document {
  id: string;
  name: string;
  path: string;
  required: boolean;
  received: boolean;
}

export interface MessageTemplate {
  id: string;
  name: string;
  content: string;
  variables: string[];
}
