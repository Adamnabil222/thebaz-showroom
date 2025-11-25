import { CompanyInfo, InvoiceData, InvoiceStatus } from './types';

// الشعار الجديد بنظام SVG لضمان الجودة العالية وعدم الحاجة لروابط خارجية
const LOGO_SVG = `data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20400%20160%22%3E%3Cstyle%3Etext%7Bfont-family%3Asans-serif%3Bfont-weight%3A800%3Btext-anchor%3Amiddle%3Bfill%3Ablack%7D%3C%2Fstyle%3E%3Ctext%20x%3D%22200%22%20y%3D%2260%22%20font-size%3D%2250%22%20letter-spacing%3D%224%22%3ETHEBAZ%3C%2Ftext%3E%3Ctext%20x%3D%22200%22%20y%3D%22120%22%20font-size%3D%2250%22%20letter-spacing%3D%224%22%3ESHOWROOM%3C%2Ftext%3E%3C%2Fsvg%3E`;

export const COMPANY_INFO: CompanyInfo = {
  name: "THEBAZ SHOWROOM",
  logoUrl: LOGO_SVG,
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