import { CompanyInfo, InvoiceData, InvoiceStatus } from './types';

// الشعار الجديد بنظام SVG باللون الذهبي الفاخر
const LOGO_SVG = `data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20450%20140%22%20width%3D%22450%22%20height%3D%22140%22%3E%3Cdefs%3E%3ClinearGradient%20id%3D%22goldGrad%22%20x1%3D%220%25%22%20y1%3D%220%25%22%20x2%3D%22100%25%22%20y2%3D%22100%25%22%3E%3Cstop%20offset%3D%220%25%22%20stop-color%3D%22%23C5A059%22%2F%3E%3Cstop%20offset%3D%2225%25%22%20stop-color%3D%22%23F3E5AB%22%2F%3E%3Cstop%20offset%3D%2250%25%22%20stop-color%3D%22%23BF953F%22%2F%3E%3Cstop%20offset%3D%2275%25%22%20stop-color%3D%22%23FCF6BA%22%2F%3E%3Cstop%20offset%3D%22100%25%22%20stop-color%3D%22%23996515%22%2F%3E%3C%2FlinearGradient%3E%3Cfilter%20id%3D%22shadow%22%20x%3D%22-10%25%22%20y%3D%22-10%25%22%20width%3D%22120%22%20height%3D%22120%22%3E%3CfeDropShadow%20dx%3D%220%22%20dy%3D%222%22%20stdDeviation%3D%222%22%20flood-color%3D%22%238C6D23%22%20flood-opacity%3D%220.3%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Ctext%20x%3D%22225%22%20y%3D%2285%22%20font-family%3D%22sans-serif%22%20font-weight%3D%22900%22%20font-size%3D%2270%22%20letter-spacing%3D%228%22%20fill%3D%22url(%23goldGrad)%22%20text-anchor%3D%22middle%22%20filter%3D%22url(%23shadow)%22%3EMARVEX%3C%2Ftext%3E%3Cline%20x1%3D%2275%22%20y1%3D%22105%22%20x2%3D%22375%22%20y2%3D%22105%22%20stroke%3D%22url(%23goldGrad)%22%20stroke-width%3D%222.5%22%20stroke-linecap%3D%22round%22%2F%3E%3C%2Fsvg%3E`;

export const COMPANY_INFO: CompanyInfo = {
  name: "MARVEX",
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