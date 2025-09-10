'use client';

import React, { useState } from 'react';
import { ExtractedInvoiceData, LineItem } from '@/types/invoice';

interface InvoiceReviewDashboardProps {
  extractedData: ExtractedInvoiceData | null;
  onDataUpdate: (updatedData: ExtractedInvoiceData) => void;
}

// Props for EditableField component
interface EditableFieldProps {
  label: string;
  value: string;
  fieldPath: string;
  editingField: string | null;
  onEditStart: (fieldPath: string, currentValue: string) => void;
  onSave: (fieldPath: string) => void;
  onCancel: () => void;
  tempValue: string;
  setTempValue: (value: string) => void;
  type?: 'text' | 'number';
}

// Props for LineItemsTable component
interface LineItemsTableProps {
  lineItems: LineItem[];
  onUpdateItems: (items: LineItem[]) => void;
}

export default function InvoiceReviewDashboard({ 
  extractedData, 
  onDataUpdate 
}: InvoiceReviewDashboardProps) {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>('');

  if (!extractedData) {
    return (
      <div className="p-6 bg-gray-50 rounded-lg border">
        <h2 className="text-xl font-semibold mb-4">Invoice Review Dashboard</h2>
        <p className="text-gray-500">Upload a PDF and extract data to begin reviewing.</p>
      </div>
    );
  }

  const handleEditStart = (fieldPath: string, currentValue: string) => {
    setEditingField(fieldPath);
    setTempValue(currentValue);
  };

  const handleSave = (fieldPath: string) => {
    const updatedData = { ...extractedData };
    const path = fieldPath.split('.');
    
    let current: unknown = updatedData;
    for (let i = 0; i < path.length - 1; i++) {
      current = (current as Record<string, unknown>)[path[i]];
    }
    (current as Record<string, unknown>)[path[path.length - 1]] = tempValue;

    onDataUpdate(updatedData);
    setEditingField(null);
  };

  const handleCancelEdit = () => {
    setEditingField(null);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Invoice Review Dashboard</h2>
        <p className="text-gray-600">Review and edit extracted invoice data</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vendor Information Section */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-blue-800">Vendor Information</h3>
          <EditableField
            label="Vendor Name"
            value={extractedData.vendor.name}
            fieldPath="vendor.name"
            editingField={editingField}
            onEditStart={handleEditStart}
            onSave={handleSave}
            onCancel={handleCancelEdit}
            tempValue={tempValue}
            setTempValue={setTempValue}
          />
          <EditableField
            label="Address"
            value={extractedData.vendor.address || 'Not found'}
            fieldPath="vendor.address"
            editingField={editingField}
            onEditStart={handleEditStart}
            onSave={handleSave}
            onCancel={handleCancelEdit}
            tempValue={tempValue}
            setTempValue={setTempValue}
          />
          <EditableField
            label="Tax ID"
            value={extractedData.vendor.taxId || 'Not found'}
            fieldPath="vendor.taxId"
            editingField={editingField}
            onEditStart={handleEditStart}
            onSave={handleSave}
            onCancel={handleCancelEdit}
            tempValue={tempValue}
            setTempValue={setTempValue}
          />
        </div>

        {/* Invoice Details Section */}
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-green-800">Invoice Details</h3>
          <EditableField
            label="Invoice Number"
            value={extractedData.invoice.number}
            fieldPath="invoice.number"
            editingField={editingField}
            onEditStart={handleEditStart}
            onSave={handleSave}
            onCancel={handleCancelEdit}
            tempValue={tempValue}
            setTempValue={setTempValue}
          />
          <EditableField
            label="Invoice Date"
            value={extractedData.invoice.date}
            fieldPath="invoice.date"
            editingField={editingField}
            onEditStart={handleEditStart}
            onSave={handleSave}
            onCancel={handleCancelEdit}
            tempValue={tempValue}
            setTempValue={setTempValue}
          />
          <EditableField
            label="PO Number"
            value={extractedData.invoice.poNumber || 'Not found'}
            fieldPath="invoice.poNumber"
            editingField={editingField}
            onEditStart={handleEditStart}
            onSave={handleSave}
            onCancel={handleCancelEdit}
            tempValue={tempValue}
            setTempValue={setTempValue}
          />
          <EditableField
            label="PO Date"
            value={extractedData.invoice.poDate || 'Not found'}
            fieldPath="invoice.poDate"
            editingField={editingField}
            onEditStart={handleEditStart}
            onSave={handleSave}
            onCancel={handleCancelEdit}
            tempValue={tempValue}
            setTempValue={setTempValue}
          />
          <EditableField
            label="Currency"
            value={extractedData.invoice.currency || 'Not found'}
            fieldPath="invoice.currency"
            editingField={editingField}
            onEditStart={handleEditStart}
            onSave={handleSave}
            onCancel={handleCancelEdit}
            tempValue={tempValue}
            setTempValue={setTempValue}
          />
        </div>
      </div>

      {/* Financial Summary */}
      <div className="mt-6 bg-yellow-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-3 text-yellow-800">Financial Summary</h3>
        <div className="grid grid-cols-3 gap-4">
          <EditableField
            label="Subtotal"
            value={extractedData.invoice.subtotal ? `$${extractedData.invoice.subtotal}` : 'Not found'}
            fieldPath="invoice.subtotal"
            editingField={editingField}
            onEditStart={handleEditStart}
            onSave={handleSave}
            onCancel={handleCancelEdit}
            tempValue={tempValue}
            setTempValue={setTempValue}
            type="number"
          />
          <EditableField
            label="Tax %"
            value={extractedData.invoice.taxPercent ? `${extractedData.invoice.taxPercent}%` : 'Not found'}
            fieldPath="invoice.taxPercent"
            editingField={editingField}
            onEditStart={handleEditStart}
            onSave={handleSave}
            onCancel={handleCancelEdit}
            tempValue={tempValue}
            setTempValue={setTempValue}
            type="number"
          />
          <EditableField
            label="Total Amount"
            value={extractedData.invoice.total ? `$${extractedData.invoice.total}` : 'Not found'}
            fieldPath="invoice.total"
            editingField={editingField}
            onEditStart={handleEditStart}
            onSave={handleSave}
            onCancel={handleCancelEdit}
            tempValue={tempValue}
            setTempValue={setTempValue}
            type="number"
          />
        </div>
      </div>

      {/* Line Items Table */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-800">Line Items</h3>
        <LineItemsTable 
          lineItems={extractedData.invoice.lineItems} 
          onUpdateItems={(items) => {
            const updatedData = { ...extractedData };
            updatedData.invoice.lineItems = items;
            onDataUpdate(updatedData);
          }}
        />
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex gap-4">
        <button className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
          Save to Database
        </button>
        <button className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600">
          Export as CSV
        </button>
        <button className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600">
          Discard Changes
        </button>
      </div>
    </div>
  );
}

// EditableField Component with proper typing
const EditableField: React.FC<EditableFieldProps> = ({ 
  label, 
  value, 
  fieldPath, 
  editingField, 
  onEditStart, 
  onSave, 
  onCancel, 
  tempValue, 
  setTempValue, 
  type = 'text' 
}) => (
  <div className="mb-3">
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    {editingField === fieldPath ? (
      <div className="flex gap-2">
        <input
          type={type}
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          className="flex-1 px-3 py-2 border rounded"
        />
        <button onClick={() => onSave(fieldPath)} className="bg-green-500 text-white px-3 py-1 rounded">
          ✓
        </button>
        <button onClick={onCancel} className="bg-gray-500 text-white px-3 py-1 rounded">
          ✗
        </button>
      </div>
    ) : (
      <div className="flex justify-between items-center bg-white p-2 rounded border">
        <span className="text-gray-800">{value}</span>
        <button 
          onClick={() => onEditStart(fieldPath, value)}
          className="text-blue-500 hover:text-blue-700"
        >
          Edit
        </button>
      </div>
    )}
  </div>
);

// LineItemsTable Component with proper typing
const LineItemsTable: React.FC<LineItemsTableProps> = ({ lineItems }) => {
  if (!lineItems || lineItems.length === 0) {
    return <p className="text-gray-500">No line items found</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left">Description</th>
            <th className="px-4 py-2 text-left">Unit Price</th>
            <th className="px-4 py-2 text-left">Quantity</th>
            <th className="px-4 py-2 text-left">Total</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {lineItems.map((item: LineItem, index: number) => (
            <tr key={index} className="border-t">
              <td className="px-4 py-2">{item.description}</td>
              <td className="px-4 py-2">{item.unitPrice ? `$${item.unitPrice}` : '-'}</td>
              <td className="px-4 py-2">{item.quantity || '-'}</td>
              <td className="px-4 py-2">{item.total ? `$${item.total}` : '-'}</td>
              <td className="px-4 py-2">
                <button className="text-blue-500 hover:text-blue-700 mr-2">
                  Edit
                </button>
                <button className="text-red-500 hover:text-red-700">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};