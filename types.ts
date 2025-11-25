export enum InvoiceStatus {
  DRAFT = 'مسودة',
  OPEN = 'مفتوحة',
  PAID = 'مسددة'
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Client {
  id?: string;
  name: string;
  address?: string;
  phone?: string;
}

export interface InvoiceData {
  id: string;
  number: string;
  date: string;
  dueDate: string;
  status: InvoiceStatus;
  client: Client | null;
  items: InvoiceItem[];
  discount: number;
  notes?: string;
}

export interface CompanyInfo {
  name: string;
  logoUrl?: string;
  address: string;
  subAddress: string;
  phone: string;
}