'use client';

import React, { useState, useEffect } from 'react';
import { ExtractedInvoiceData } from '@/types/invoice';

interface InvoiceListProps {
  onSelectInvoice: (invoice: ExtractedInvoiceData) => void;
  onNewInvoice: () => void;
}

export default function InvoiceList({ onSelectInvoice, onNewInvoice }: InvoiceListProps) {
  const [invoices, setInvoices] = useState<ExtractedInvoiceData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedInvoice, setExpandedInvoice] = useState<string | null>(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async (search = '') => {
    try {
      setLoading(true);
      setError('');
      const url = search 
        ? `http://localhost:3001/invoices?q=${encodeURIComponent(search)}` 
        : 'http://localhost:3001/invoices';
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch invoices');
      }
      
      const data = await response.json();
      setInvoices(data);
    } catch (err) {
      setError('Failed to load invoices. Make sure API server is running.');
      console.error('Error fetching invoices:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchInvoices(searchTerm);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this invoice?')) return;

    try {
      const response = await fetch(`http://localhost:3001/invoices/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setInvoices(invoices.filter(inv => inv._id !== id));
        alert('Invoice deleted successfully');
      }
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete invoice');
    }
  };

  const toggleExpandInvoice = (invoiceId: string) => {
    setExpandedInvoice(expandedInvoice === invoiceId ? null : invoiceId);
  };

  if (loading) return <div className="p-4">Loading invoices...</div>;
  if (error) return <div className="p-4 text-red-600">{error}</div>;

  return (
    <div className="p-6 bg-card rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-card-foreground">Invoice Management</h1>
        <div className="flex space-x-2">
          <button 
            onClick={() => fetchInvoices()}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Refresh
          </button>
          <button 
            onClick={onNewInvoice}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            New Invoice
          </button>
        </div>
      </div>

      <form onSubmit={handleSearch} className="mb-6 p-4 bg-gray-100 rounded-lg">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search by vendor name or invoice number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded text-black"
          />
          <button
            type="submit"
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Search
          </button>
          <button
            type="button"
            onClick={() => {
              setSearchTerm('');
              fetchInvoices();
            }}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Clear
          </button>
        </div>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-2 border text-black">Vendor</th>
              <th className="px-4 py-2 border text-black">Invoice #</th>
              <th className="px-4 py-2 border text-black">Date</th>
              <th className="px-4 py-2 border text-black">Total</th>
              <th className="px-4 py-2 border text-black">Items</th>
              <th className="px-4 py-2 border text-black">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <React.Fragment key={invoice._id}>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-2 border text-black">{invoice.vendor.name}</td>
                  <td className="px-4 py-2 border text-black">{invoice.invoice.number}</td>
                  <td className="px-4 py-2 border text-black">{invoice.invoice.date}</td>
                  <td className="px-4 py-2 border text-black">${invoice.invoice.total?.toFixed(2)}</td>
                  <td className="px-4 py-2 border text-black">
                    <button
                      onClick={() => toggleExpandInvoice(invoice._id!)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      {expandedInvoice === invoice._id ? 'Hide Items' : `Show Items (${invoice.invoice.lineItems.length})`}
                    </button>
                  </td>
                  <td className="px-4 py-2 border text-black">
                    <button
                      onClick={() => onSelectInvoice(invoice)}
                      className="text-blue-500 hover:text-blue-700 mr-2"
                    >
                      View/Edit
                    </button>
                    <button
                      onClick={() => invoice._id && handleDelete(invoice._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
                {expandedInvoice === invoice._id && (
                  <tr>
                    <td colSpan={6} className="px-4 py-2 border">
                      <div className="bg-gray-100 p-4 rounded">
                        <h4 className="font-semibold mb-2 text-black">Line Items:</h4>
                        <table className="min-w-full">
                          <thead>
                            <tr>
                              <th className="text-left text-black">Description</th>
                              <th className="text-left text-black">Quantity</th>
                              <th className="text-left text-black">Unit Price</th>
                              <th className="text-left text-black">Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {invoice.invoice.lineItems.map((item, index) => (
                              <tr key={index}>
                                <td className="pr-4 text-black">{item.description}</td>
                                <td className="pr-4 text-black">{item.quantity}</td>
                                <td className="pr-4 text-black">${item.unitPrice.toFixed(2)}</td>
                                <td className="text-black">${item.total.toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        
        {invoices.length === 0 && (
          <div className="text-center py-8 text-black">
            No invoices found. Upload a PDF to get started.
          </div>
        )}
      </div>
    </div>
  );
}