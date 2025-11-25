import React from 'react';
import { Plus, Trash2, Calendar, User, FileText, Image as ImageIcon, Upload, DollarSign, MapPin, Phone } from 'lucide-react';
import { InvoiceData, InvoiceStatus, InvoiceItem, Client, CompanyInfo } from '../types';

interface InvoiceFormProps {
  data: InvoiceData;
  onChange: (newData: InvoiceData) => void;
  companyInfo: CompanyInfo;
  onCompanyChange: (newInfo: CompanyInfo) => void;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ data, onChange, companyInfo, onCompanyChange }) => {
  
  const handleItemChange = (id: string, field: keyof InvoiceItem, value: any) => {
    const newItems = data.items.map(item => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    onChange({ ...data, items: newItems });
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      unitPrice: 0
    };
    onChange({ ...data, items: [...data.items, newItem] });
  };

  const removeItem = (id: string) => {
    if (data.items.length === 1) return; // Prevent deleting last item
    onChange({ ...data, items: data.items.filter(i => i.id !== id) });
  };

  const handleClientChange = (field: keyof Client, value: string) => {
    const currentClient = data.client || { name: '', address: '', phone: '' };
    onChange({
      ...data,
      client: { ...currentClient, [field]: value }
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onCompanyChange({ ...companyInfo, logoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    onCompanyChange({ ...companyInfo, logoUrl: '' });
  };

  return (
    <div className="space-y-6">

      {/* Section: Company Settings (Logo) */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
          <ImageIcon className="w-5 h-5 text-primary" />
          شعار الشركة
        </h3>
        
        <div className="flex items-start gap-4">
          <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50 overflow-hidden relative group transition-colors hover:border-blue-400">
             {companyInfo.logoUrl ? (
               <>
                 <img src={companyInfo.logoUrl} alt="Logo" className="w-full h-full object-contain p-1" />
                 <button 
                   onClick={removeLogo}
                   className="absolute inset-0 bg-black/50 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all backdrop-blur-sm"
                   title="حذف الشعار"
                 >
                   <Trash2 className="w-6 h-6" />
                 </button>
               </>
             ) : (
               <span className="text-gray-400 text-xs text-center p-1">لا يوجد شعار</span>
             )}
          </div>
          
          <div className="flex-1">
             <label className="block w-full">
                <span className="sr-only">اختر شعار</span>
                <div className="flex items-center gap-2">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="block w-full text-sm text-slate-500
                      file:ml-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-bold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100
                      cursor-pointer
                      transition-all
                    "
                  />
                </div>
             </label>
             <p className="text-xs text-gray-500 mt-2 leading-relaxed">
               قم برفع صورة الشعار (PNG, JPG). سيتم عرضها في أعلى يمين الفاتورة. 
               <br/>
               يفضل استخدام صورة ذات خلفية شفافة للحصول على أفضل مظهر.
             </p>
          </div>
        </div>
      </div>
      
      {/* Section: Client & Meta */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2 border-b pb-2">
          <User className="w-5 h-5 text-primary" />
          بيانات العميل والفاتورة
        </h3>
        
        {/* Manual Client Entry */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">اسم العميل</label>
            <input 
              type="text"
              placeholder="اكتب اسم العميل هنا..."
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
              value={data.client?.name || ''}
              onChange={(e) => handleClientChange('name', e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                   <MapPin className="w-3 h-3"/> العنوان
                </label>
                <input 
                  type="text"
                  placeholder="عنوان العميل (اختياري)"
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                  value={data.client?.address || ''}
                  onChange={(e) => handleClientChange('address', e.target.value)}
                />
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                   <Phone className="w-3 h-3"/> رقم الهاتف
                </label>
                <input 
                  type="text"
                  dir="ltr"
                  placeholder="010xxxxxxx"
                  className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow text-right"
                  value={data.client?.phone || ''}
                  onChange={(e) => handleClientChange('phone', e.target.value)}
                />
             </div>
          </div>
        </div>

        {/* Invoice Meta */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">حالة الفاتورة</label>
            <select 
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow cursor-pointer"
              value={data.status}
              onChange={(e) => onChange({...data, status: e.target.value as InvoiceStatus})}
            >
              {Object.values(InvoiceStatus).map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> تاريخ الفاتورة
            </label>
            <input 
              type="date" 
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
              value={data.date}
              onChange={(e) => onChange({...data, date: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> تاريخ الاستحقاق
            </label>
            <input 
              type="date" 
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
              value={data.dueDate}
              onChange={(e) => onChange({...data, dueDate: e.target.value})}
            />
          </div>
        </div>
      </div>

      {/* Section: Items */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-center mb-4 border-b pb-2">
          <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            الأصناف والخدمات
          </h3>
        </div>

        <div className="overflow-x-auto mb-2">
          <table className="w-full">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="py-2 px-2 text-start rounded-r-md">اسم الصنف</th>
                <th className="py-2 px-2 w-20 text-center">الكمية</th>
                <th className="py-2 px-2 w-28 text-center">السعر</th>
                <th className="py-2 px-2 w-28 text-center">إجمالي</th>
                <th className="py-2 px-2 w-10 rounded-l-md"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.items.map((item) => (
                <tr key={item.id} className="group hover:bg-gray-50 transition-colors">
                  <td className="p-2">
                    <input 
                      type="text" 
                      placeholder="اسم المنتج أو الخدمة"
                      className="w-full bg-transparent border-b border-gray-200 focus:border-blue-500 outline-none py-1 transition-colors"
                      value={item.description}
                      onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                    />
                  </td>
                  <td className="p-2">
                    <input 
                      type="number" 
                      min="1"
                      className="w-full bg-transparent border-b border-gray-200 focus:border-blue-500 outline-none py-1 text-center transition-colors"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)}
                    />
                  </td>
                  <td className="p-2">
                    <input 
                      type="number" 
                      min="0"
                      className="w-full bg-transparent border-b border-gray-200 focus:border-blue-500 outline-none py-1 text-center transition-colors"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                    />
                  </td>
                  <td className="p-2 text-center text-gray-700 font-medium">
                    {(item.quantity * item.unitPrice).toLocaleString('ar-EG')}
                  </td>
                  <td className="p-2 text-center">
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1 hover:bg-red-50 rounded"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <button 
          onClick={addItem}
          className="w-full py-3 border-2 border-dashed border-gray-300 text-gray-500 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all rounded-lg font-bold flex items-center justify-center gap-2 active:scale-[0.99]"
        >
          <Plus className="w-5 h-5" /> إضافة صنف جديد
        </button>
      </div>

       {/* Section: Financials & Notes */}
       <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
         <div className="mb-4">
           <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
             <DollarSign className="w-4 h-4 text-green-600" /> قيمة الخصم (جنيه مصري)
           </label>
           <input 
             type="number" 
             min="0"
             placeholder="0"
             className="w-full md:w-1/3 border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
             value={data.discount || ''}
             onChange={(e) => onChange({...data, discount: parseFloat(e.target.value) || 0})}
           />
           <p className="text-xs text-gray-500 mt-1">يتم خصم هذا المبلغ من الإجمالي.</p>
         </div>

         <div className="border-t border-gray-100 pt-4">
           <h3 className="text-sm font-bold text-gray-700 mb-2">ملاحظات إضافية</h3>
           <textarea
            className="w-full border border-gray-300 rounded-md p-3 focus:ring-2 focus:ring-blue-500 outline-none text-sm h-24 resize-none transition-shadow"
            placeholder="أدخل أي شروط أو ملاحظات تظهر في ذيل الفاتورة..."
            value={data.notes}
            onChange={(e) => onChange({...data, notes: e.target.value})}
           ></textarea>
         </div>
       </div>
    </div>
  );
};

export default InvoiceForm;