import { Request, Response } from 'express';
import Invoice from '../models/Invoice';

export const getInvoices = async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    let filter = {};
    
    if (q) {
      filter = {
        $or: [
          { 'vendor.name': { $regex: q, $options: 'i' } },
          { 'invoice.number': { $regex: q, $options: 'i' } }
        ]
      };
    }
    
    const invoices = await Invoice.find(filter).sort({ createdAt: -1 });
    res.status(200).json(invoices);
  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({ error: 'Failed to get invoices' });
  }
};

export const getInvoice = async (req: Request, res: Response) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    res.status(200).json(invoice);
  } catch (error) {
    console.error('Get invoice error:', error);
    res.status(500).json({ error: 'Failed to get invoice' });
  }
};

export const createInvoice = async (req: Request, res: Response) => {
  try {
    // Validate line items
    if (req.body.invoice && req.body.invoice.lineItems) {
      req.body.invoice.lineItems = req.body.invoice.lineItems.map((item: any) => ({
        description: item.description || '',
        unitPrice: item.unitPrice && !isNaN(item.unitPrice) ? Number(item.unitPrice) : 0,
        quantity: item.quantity && !isNaN(item.quantity) ? Number(item.quantity) : 1,
        total: item.total && !isNaN(item.total) ? Number(item.total) : 0
      }));
    }
    
    const invoice = new Invoice(req.body);
    await invoice.save();
    res.status(201).json(invoice);
  } catch (error) {
    console.error('Create invoice error:', error);
    res.status(500).json({ error: 'Failed to create invoice' });
  }
};

export const updateInvoice = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Validate line items
    if (req.body.invoice && req.body.invoice.lineItems) {
      req.body.invoice.lineItems = req.body.invoice.lineItems.map((item: any) => ({
        description: item.description || '',
        unitPrice: item.unitPrice && !isNaN(item.unitPrice) ? Number(item.unitPrice) : 0,
        quantity: item.quantity && !isNaN(item.quantity) ? Number(item.quantity) : 1,
        total: item.total && !isNaN(item.total) ? Number(item.total) : 0
      }));
    }
    
    // Add updatedAt timestamp
    req.body.updatedAt = new Date();
    
    const invoice = await Invoice.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    res.status(200).json(invoice);
  } catch (error) {
    console.error('Update invoice error:', error);
    res.status(500).json({ error: 'Failed to update invoice' });
  }
};

export const deleteInvoice = async (req: Request, res: Response) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    res.status(200).json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    console.error('Delete invoice error:', error);
    res.status(500).json({ error: 'Failed to delete invoice' });
  }
};