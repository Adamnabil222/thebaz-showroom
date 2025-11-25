import React, { useMemo } from 'react';
import { InvoiceData, CompanyInfo } from '../types';

interface InvoicePreviewProps {
  data: InvoiceData;
  companyInfo: CompanyInfo;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ data, companyInfo }) => {
  
  const subtotal = useMemo(() => {
    return data.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  }, [data.items]);

  const discount = data.discount || 0;
  const total = Math.max(0, subtotal - discount);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP' }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('ar-EG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg border border-gray-200 h-full flex flex-col justify-between print-shadow-remove text-gray-800">
      
      {/* Header */}
      <div className="border-b-2 border-gray-800 pb-6 mb-6">
        <div className="flex justify-between items-start">
          
          {/* Company Info (Fixed) */}
          <div className="w-1/2">
            {companyInfo.logoUrl && (
              <div className="mb-4">
                <img 
                  src={companyInfo.logoUrl} 
                  alt="Company Logo" 
                  className="h-20 object-contain object-right"
                />
              </div>
            )}
            <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-wide uppercase font-sans">
              {companyInfo.name}
            </h1>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="font-semibold text-gray-800">{companyInfo.address}</p>
              <p>{companyInfo.subAddress}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="font-bold">هاتف:</span>
                <span dir="ltr">{companyInfo.phone}</span>
              </div>
            </div>
          </div>

          {/* Invoice Meta */}
          <div className="w-1/2 text-left rtl:text-left flex flex-col items-end">
            <h2 className="text-4xl font-light text-gray-400 mb-2">فاتورة</h2>
            <div className="w-full max-w-[200px]">
              <div className="flex justify-between mb-1">
                <span className="font-bold text-gray-600">رقم الفاتورة:</span>
                <span>{data.number}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span className="font-bold text-gray-600">التاريخ:</span>
                <span>{formatDate(data.date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-gray-600">الحالة:</span>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                  data.status === 'مسددة' ? 'bg-green-100 text-green-700' : 
                  data.status === 'مفتوحة' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {data.status}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bill To */}
      <div className="mb-8">
        <h3 className="text-gray-500 text-sm font-bold uppercase mb-2">فاتورة إلى</h3>
        {data.client ? (
          <div className="text-lg">
            <p className="font-bold text-gray-900">{data.client.name}</p>
            {data.client.address && <p className="text-gray-600 text-sm">{data.client.address}</p>}
            {data.client.phone && <p className="text-gray-600 text-sm" dir="ltr">{data.client.phone}</p>}
          </div>
        ) : (
          <p className="text-gray-400 italic">-- لم يتم تحديد عميل --</p>
        )}
      </div>

      {/* Table */}
      <div className="flex-grow">
        <table className="w-full mb-8">
          <thead>
            <tr className="bg-gray-100 border-b border-gray-300">
              <th className="py-3 px-4 text-start font-bold text-gray-600">الوصف / الصنف</th>
              <th className="py-3 px-4 text-center font-bold text-gray-600 w-24">الكمية</th>
              <th className="py-3 px-4 text-end font-bold text-gray-600 w-32">السعر</th>
              <th className="py-3 px-4 text-end font-bold text-gray-600 w-32">الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            {data.items.map((item) => (
              <tr key={item.id} className="border-b border-gray-200">
                <td className="py-3 px-4">{item.description}</td>
                <td className="py-3 px-4 text-center">{item.quantity}</td>
                <td className="py-3 px-4 text-end">{formatCurrency(item.unitPrice)}</td>
                <td className="py-3 px-4 text-end font-medium">
                  {formatCurrency(item.quantity * item.unitPrice)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-64 space-y-2">
          <div className="flex justify-between text-gray-600">
            <span>المجموع الفرعي:</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          
          {discount > 0 && (
            <div className="flex justify-between text-red-500">
              <span>خصم:</span>
              <span>- {formatCurrency(discount)}</span>
            </div>
          )}
          
          <div className="flex justify-between text-xl font-bold text-gray-900 border-t-2 border-gray-800 pt-2">
            <span>الإجمالي الكلي:</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      {/* Footer / Terms */}
      <div className="border-t border-gray-200 pt-6 mt-auto">
        <h4 className="font-bold text-sm mb-1">ملاحظات وشروط:</h4>
        <p className="text-gray-500 text-sm whitespace-pre-wrap">{data.notes || "لا توجد ملاحظات إضافية."}</p>
        <div className="mt-8 text-center text-gray-400 text-xs">
           تم إنشاء هذه الفاتورة إلكترونياً بواسطة نظام THEBAZ SHOWROOM
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;