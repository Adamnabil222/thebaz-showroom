import React, { useState, useEffect, useRef } from 'react';
import { Printer, Save, CheckCircle, Loader2, MessageCircle, Share2, FilePlus, Download } from 'lucide-react';
import { COMPANY_INFO, INITIAL_INVOICE } from './constants';
import { InvoiceData, CompanyInfo } from './types';
import InvoiceForm from './components/InvoiceForm';
import InvoicePreview from './components/InvoicePreview';

function App() {
  const [invoice, setInvoice] = useState<InvoiceData>(INITIAL_INVOICE);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>(COMPANY_INFO);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  const invoicePreviewRef = useRef<HTMLDivElement>(null);

  // استرجاع البيانات المحفوظة عند فتح التطبيق
  useEffect(() => {
    const savedInvoice = localStorage.getItem('thebaz_invoice_draft');
    const savedCompany = localStorage.getItem('thebaz_company_info');
    
    if (savedInvoice) {
      try {
        setInvoice(JSON.parse(savedInvoice));
      } catch (e) {
        console.error("خطأ في استرجاع الفاتورة", e);
      }
    }

    if (savedCompany) {
      try {
        setCompanyInfo(JSON.parse(savedCompany));
      } catch (e) {
        console.error("خطأ في استرجاع بيانات الشركة", e);
      }
    }
  }, []);

  // Calculate totals helper for external actions (WhatsApp)
  const calculateTotal = () => {
    const subtotal = invoice.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
    const discount = invoice.discount || 0;
    return Math.max(0, subtotal - discount);
  };

  // Logic to handle native browser print which renders only the preview part via CSS
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = async () => {
    if (!invoicePreviewRef.current) return;
    setIsExporting(true);

    const element = invoicePreviewRef.current;
    
    // Configuration for html2pdf
    // We use a specific configuration to ensure best quality for text
    const opt = {
      margin: [10, 10, 10, 10], // top, left, bottom, right in mm
      filename: `Invoice-${invoice.number}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2, // Higher scale for better resolution
        useCORS: true, // Allow loading external images (like logo)
        logging: false,
        letterRendering: true // Helps with text rendering
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Access the global html2pdf library
    const worker = (window as any).html2pdf();

    try {
      // Temporarily remove shadow and border for a cleaner PDF look
      const originalShadow = element.style.boxShadow;
      const originalBorder = element.style.border;
      element.style.boxShadow = 'none';
      element.style.border = 'none';

      await worker.set(opt).from(element).save();

      // Restore styles
      element.style.boxShadow = originalShadow;
      element.style.border = originalBorder;
      
      setToastMessage('تم تحميل ملف PDF بنجاح');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (error) {
      console.error('PDF Export Error:', error);
      setToastMessage('حدث خطأ أثناء تصدير PDF');
      setShowToast(true);
    } finally {
      setIsExporting(false);
    }
  };

  const handleSaveDraft = () => {
    setIsSaving(true);
    
    // تنفيذ الحفظ الفعلي في ذاكرة المتصفح
    try {
      localStorage.setItem('thebaz_invoice_draft', JSON.stringify(invoice));
      localStorage.setItem('thebaz_company_info', JSON.stringify(companyInfo));
      
      setTimeout(() => {
        setIsSaving(false);
        setToastMessage('تم حفظ الفاتورة وإعدادات الشركة بنجاح!');
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }, 600);
    } catch (e) {
      setIsSaving(false);
      setToastMessage('حدث خطأ أثناء الحفظ');
      setShowToast(true);
    }
  };
  
  const handleNewInvoice = () => {
    if (window.confirm('هل أنت متأكد من إنشاء فاتورة جديدة؟ سيتم مسح البيانات الحالية غير المحفوظة.')) {
      const newInvoice = {
        ...INITIAL_INVOICE,
        id: Date.now().toString(),
        number: `INV-${Math.floor(Math.random() * 10000)}`, // رقم عشوائي جديد
        date: new Date().toISOString().split('T')[0],
        items: [{ id: Date.now().toString(), description: '', quantity: 1, unitPrice: 0 }],
        client: { name: '', address: '', phone: '' }
      };
      setInvoice(newInvoice);
      setToastMessage('تم إنشاء فاتورة جديدة');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      
      // مسح المسودة القديمة من الذاكرة لضمان عدم تداخل البيانات
      localStorage.removeItem('thebaz_invoice_draft');
    }
  };

  const handleWhatsAppShare = () => {
    // Prompt the user for the phone number, defaulting to the one in the form
    const currentPhone = invoice.client?.phone || '';
    const phoneInput = window.prompt("أدخل رقم واتساب العميل للإرسال:", currentPhone);

    if (phoneInput === null) return; // User cancelled
    
    let phone = phoneInput.trim();
    if (phone.length === 0) {
      setToastMessage('لم يتم إدخال رقم هاتف.');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    // Format phone number: remove non-digits
    phone = phone.replace(/\D/g, '');

    // Basic Egypt number handling: if starts with 01, add 20
    if (phone.startsWith('01')) {
      phone = '20' + phone.substring(1);
    } else if (phone.startsWith('1') && phone.length === 10) {
       // e.g. 10xxxxxxxx -> 2010xxxxxxxx
      phone = '20' + phone;
    }

    const totalAmount = new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(calculateTotal());
    
    // Construct the message cleanly
    const message = `مرحباً ${invoice.client?.name || 'عميلنا العزيز'}،
إليك تفاصيل الفاتورة من ${companyInfo.name}:

رقم الفاتورة: ${invoice.number}
تاريخ الفاتورة: ${invoice.date}
الإجمالي المستحق: ${totalAmount}

يرجى الاطلاع على الفاتورة المرفقة (PDF).
شكراً لتعاملكم معنا.`;

    // Encode the message to ensure all Arabic characters and newlines work properly
    const encodedMessage = encodeURIComponent(message);

    // Open WhatsApp
    const url = `https://wa.me/${phone}?text=${encodedMessage}`;
    window.open(url, '_blank');

    // Notify user to attach PDF
    setToastMessage('تم فتح واتساب. يرجى "تصدير PDF" ثم إرفاق الملف في المحادثة.');
    setShowToast(true);
    setTimeout(() => setShowToast(false), 6000);
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 z-[100] animate-bounce-in min-w-[300px]">
          <CheckCircle className="w-5 h-5 text-green-400 shrink-0" />
          <span className="font-bold text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation Bar - No Print */}
      <header className="bg-white shadow-sm border-b border-gray-200 no-print sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary text-white rounded-lg flex items-center justify-center font-bold text-xl shadow-sm">
              BZ
            </div>
            <h1 className="text-xl font-bold text-gray-800 hidden sm:block">THEBAZ SHOWROOM</h1>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* WhatsApp Button */}
            <button 
              onClick={handleWhatsAppShare}
              className="flex items-center gap-2 px-3 py-2 text-green-700 bg-green-50 hover:bg-green-100 active:bg-green-200 border border-green-200 rounded-md transition-all text-sm font-medium"
              title="إرسال ملخص عبر واتساب"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden md:inline">إرسال واتساب</span>
            </button>

            <div className="h-6 w-px bg-gray-300 mx-1 hidden sm:block"></div>

            {/* New Invoice Button */}
            <button 
              onClick={handleNewInvoice}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 bg-white hover:bg-gray-50 border border-gray-200 rounded-md transition-all text-sm font-medium"
              title="فاتورة جديدة"
            >
              <FilePlus className="w-4 h-4" />
              <span className="hidden lg:inline">جديد</span>
            </button>

            {/* Save Button */}
            <button 
              onClick={handleSaveDraft}
              disabled={isSaving}
              className="flex items-center gap-2 px-3 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 rounded-md transition-all text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span className="hidden sm:inline">{isSaving ? 'جاري الحفظ...' : 'حفظ'}</span>
            </button>
            
            {/* Download PDF Button */}
            <button 
              onClick={handleDownloadPDF}
              disabled={isExporting}
              className="flex items-center gap-2 px-3 py-2 text-white bg-secondary hover:bg-slate-600 active:bg-slate-700 rounded-md transition-all text-sm font-medium shadow-sm disabled:opacity-70 disabled:cursor-not-allowed"
            >
               {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
               <span className="hidden sm:inline">تصدير PDF</span>
            </button>

            {/* Print Button */}
            <button 
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2 text-white bg-primary hover:bg-blue-800 active:bg-blue-900 rounded-md transition-all text-sm font-medium shadow-sm"
              title="طباعة أو حفظ كملف PDF"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden lg:inline">طباعة</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 gap-8 grid grid-cols-1 lg:grid-cols-12 relative">
        
        {/* Editor Sidebar (Right Side in RTL) - No Print */}
        <div className="lg:col-span-5 order-2 lg:order-1 no-print space-y-6">
          <div className="flex items-center justify-between">
             <h2 className="text-2xl font-bold text-gray-800">إنشاء فاتورة جديدة</h2>
             <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border border-gray-200">
               {invoice.number}
             </span>
          </div>
          
          <InvoiceForm 
            data={invoice} 
            onChange={setInvoice} 
            companyInfo={companyInfo}
            onCompanyChange={setCompanyInfo}
          />
        </div>

        {/* Preview Area (Left Side in RTL) - Printed */}
        <div className="lg:col-span-7 order-1 lg:order-2">
          
          {/* Sticky Header for Preview Label only on Desktop */}
          <div className="mb-4 flex justify-between items-center no-print">
            <h3 className="text-gray-500 font-bold text-sm uppercase tracking-wider">معاينة الفاتورة</h3>
            <div className="text-xs text-gray-400 flex gap-2">
               <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> جاهز للطباعة</span>
            </div>
          </div>

          {/* Actual Invoice Wrapper for Print/Export Targeting */}
          {/* We attach the ref directly to the preview wrapper for HTML2PDF capturing */}
          <div className="print-only" id="invoice-preview-container">
             <div ref={invoicePreviewRef} className="h-full">
                <InvoicePreview data={invoice} companyInfo={companyInfo} />
             </div>
          </div>

        </div>

      </main>

      {/* Footer - No Print */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-auto no-print">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} THEBAZ SHOWROOM. جميع الحقوق محفوظة.
        </div>
      </footer>

    </div>
  );
}

export default App;