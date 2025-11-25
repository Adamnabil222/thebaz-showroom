import { CompanyInfo, InvoiceData, InvoiceStatus } from './types';

export const COMPANY_INFO: CompanyInfo = {
  name: "THEBAZ SHOW ROOM",
  logoUrl: "https://placehold.co/400x150/1e40af/ffffff?text=THEBAZ+LOGO&font=cairo",
  address: "المنصورة، شارع سامية الجمل",
  subAddress: "أول الشارع أمام رفعت علام، أول الإشارة",
  phone: "01030530580"
};

export const INITIAL_INVOICE: InvoiceData = {
  id: '1',
  number: 'INV-001',
  date: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  status: InvoiceStatus.DRAFT,
  client: {
    name: '',
    address: '',
    phone: ''
  },
  items: [
    { id: '1', description: '', quantity: 1, unitPrice: 0 }
  ],
  discount: 0,
  notes: ''
};