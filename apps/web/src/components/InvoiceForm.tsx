'use client';

import { useState, useEffect } from 'react';

interface LineItem {
  description: string;
  unitPrice: number;
  quantity: number;
  total: number;
}

interface InvoiceData {
  vendor: {
    name: string;
    address?: string;
    taxId?: string;
  };
  invoice: {
    number: string;
    date: string;
    currency?: string;
    subtotal?: number;
    taxPercent?: number;
    total?: number;
    poNumber?: string;
    poDate?: string;
    lineItems: LineItem[];
  };
}

interface InvoiceFormProps {
  data: InvoiceData | null;
  onDataChange: (data: InvoiceData) => void;
  onSave?: () => void;
  isSaving?: boolean;
}

export default function InvoiceForm({ data, onDataChange, onSave, isSaving = false }: InvoiceFormProps) {
  const [formData, setFormData] = useState<InvoiceData>(
    data || {
      vendor: { name: '', address: '', taxId: '' },
      invoice: {
        number: '',
        date: '',
        currency: 'USD',
        subtotal: 0,
        taxPercent: 0,
        total: 0,
        poNumber: '',
        poDate: '',
        lineItems: []
      }
    }
  );

  // Update form data when props change
  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  const handleFieldChange = (section: 'vendor' | 'invoice', field: string, value: unknown) => {
    const newData = {
      ...formData,
      [section]: {
        ...formData[section],
        [field]: value
      }
    };
    setFormData(newData);
    onDataChange(newData);
  };

  const handleLineItemChange = (index: number, field: string, value: unknown) => {
    const newLineItems = [...formData.invoice.lineItems];
    
    // Ensure numeric values are properly handled
    if (field === 'unitPrice' || field === 'quantity' || field === 'total') {
      value = isNaN(Number(value)) ? 0 : Number(value);
    }
    
    newLineItems[index] = { ...newLineItems[index], [field]: value };
    
    // Recalculate total if unitPrice or quantity changes
    if (field === 'unitPrice' || field === 'quantity') {
      const unitPrice = field === 'unitPrice' ? Number(value) : newLineItems[index].unitPrice;
      const quantity = field === 'quantity' ? Number(value) : newLineItems[index].quantity;
      newLineItems[index].total = unitPrice * quantity;
    }

    const newData = {
      ...formData,
      invoice: {
        ...formData.invoice,
        lineItems: newLineItems
      }
    };
    setFormData(newData);
    onDataChange(newData);
  };

  const addLineItem = () => {
    const newLineItem: LineItem = {
      description: '',
      unitPrice: 0,
      quantity: 1,
      total: 0
    };
    
    const newData = {
      ...formData,
      invoice: {
        ...formData.invoice,
        lineItems: [...formData.invoice.lineItems, newLineItem]
      }
    };
    setFormData(newData);
    onDataChange(newData);
  };

  const removeLineItem = (index: number) => {
    const newLineItems = formData.invoice.lineItems.filter((_, i) => i !== index);
    const newData = {
      ...formData,
      invoice: {
        ...formData.invoice,
        lineItems: newLineItems
      }
    };
    setFormData(newData);
    onDataChange(newData);
  };

  // Calculate totals whenever line items change
  useEffect(() => {
    const subtotal = formData.invoice.lineItems.reduce((sum, item) => sum + item.total, 0);
    const taxAmount = subtotal * (formData.invoice.taxPercent || 0) / 100;
    const total = subtotal + taxAmount;
    
    setFormData(prev => ({
      ...prev,
      invoice: {
        ...prev.invoice,
        subtotal,
        total
      }
    }));
    
    onDataChange({
      ...formData,
      invoice: {
        ...formData.invoice,
        subtotal,
        total
      }
    });
  }, [formData.invoice.lineItems, formData.invoice.taxPercent]);

  if (!data) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-gray-500 p-8">
          <div className="mx-auto h-16 w-16 text-gray-400 mb-4">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <p>Upload a PDF to extract data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 overflow-y-auto h-full">
      <h2 className="text-lg font-semibold mb-4">Extracted Invoice Data</h2>
      
      {/* Vendor Information */}
      <div className="mb-6">
        <h3 className="text-md font-medium mb-3 text-gray-700">Vendor Information</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Vendor Name</label>
            <input
              type="text"
              value={formData.vendor.name}
              onChange={(e) => handleFieldChange('vendor', 'name', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <textarea
              value={formData.vendor.address || ''}
              onChange={(e) => handleFieldChange('vendor', 'address', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tax ID</label>
            <input
              type="text"
              value={formData.vendor.taxId || ''}
              onChange={(e) => handleFieldChange('vendor', 'taxId', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="mb-6">
        <h3 className="text-md font-medium mb-3 text-gray-700">Invoice Details</h3>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium mb-1">Invoice #</label>
            <input
              type="text"
              value={formData.invoice.number}
              onChange={(e) => handleFieldChange('invoice', 'number', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="date"
              value={formData.invoice.date}
              onChange={(e) => handleFieldChange('invoice', 'date', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Currency</label>
            <input
              type="text"
              value={formData.invoice.currency || ''}
              onChange={(e) => handleFieldChange('invoice', 'currency', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tax %</label>
            <input
              type="number"
              step="0.01"
              value={formData.invoice.taxPercent || 0}
              onChange={(e) => handleFieldChange('invoice', 'taxPercent', parseFloat(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Subtotal</label>
            <input
              type="number"
              step="0.01"
              value={formData.invoice.subtotal || 0}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-md text-sm bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Total</label>
            <input
              type="number"
              step="0.01"
              value={formData.invoice.total || 0}
              readOnly
              className="w-full p-2 border border-gray-300 rounded-md text-sm bg-gray-100"
            />
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-md font-medium text-gray-700">Line Items</h3>
          <button
            onClick={addLineItem}
            className="px-3 py-1 bg-blue-500 text-white rounded-md text-sm"
          >
            Add Item
          </button>
        </div>
        
        <div className="space-y-3">
          {formData.invoice.lineItems.map((item, index) => (
            <div key={index} className="p-3 border border-gray-200 rounded-md">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-medium">Item #{index + 1}</span>
                <button
                  onClick={() => removeLineItem(index)}
                  className="text-red-500 text-sm"
                >
                  Remove
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                <div className="col-span-2">
                  <label className="block text-xs font-medium mb-1">Description</label>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleLineItemChange(index, 'description', e.target.value)}
                    className="w-full p-1 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Unit Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={isNaN(item.unitPrice) ? '' : item.unitPrice}
                    onChange={(e) => handleLineItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                    className="w-full p-1 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Quantity</label>
                  <input
                    type="number"
                    value={isNaN(item.quantity) ? '' : item.quantity}
                    onChange={(e) => handleLineItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                    className="w-full p-1 border border-gray-300 rounded text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Total</label>
                  <input
                    type="number"
                    step="0.01"
                    value={isNaN(item.total) ? '' : item.total}
                    readOnly
                    className="w-full p-1 border border-gray-300 rounded text-sm bg-gray-100"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3 pt-4 border-t">
        <button 
          onClick={onSave}
          disabled={isSaving}
          className="px-4 py-2 bg-green-500 text-white rounded-md text-sm disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save Invoice'}
        </button>
        <button className="px-4 py-2 bg-gray-500 text-white rounded-md text-sm">
          Cancel
        </button>
      </div>
    </div>
  );
}