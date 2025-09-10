import { Request, Response } from 'express';
import { extractInvoiceData } from '../services/geminiService';
import pdfParse from 'pdf-parse';
import fs from 'fs';
import path from 'path';

export const extractData = async (req: Request, res: Response) => {
  try {
    const { fileId, model } = req.body;

    console.log('Extraction request received:', { fileId, model });

    if (!fileId) {
      return res.status(400).json({ error: 'fileId is required' });
    }

    // Read the uploaded PDF file
    const filePath = path.join(__dirname, '../../uploads/', fileId);
    
    if (!fs.existsSync(filePath)) {
      console.error('File not found:', filePath);
      return res.status(404).json({ error: 'File not found' });
    }

    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    
    console.log('PDF text extracted, length:', pdfData.text.length);
    
    // Log first 200 characters for debugging
    console.log('PDF sample text:', pdfData.text.substring(0, 200));
    
    let extractedData;
    if (model === 'gemini') {
      extractedData = await extractInvoiceData(pdfData.text);
      console.log('Data extracted successfully via Gemini:', extractedData);
    } else {
      return res.status(400).json({ error: 'Only Gemini model is supported' });
    }

    res.status(200).json(extractedData);
  } catch (error) {
    console.error('Extraction error:', error);
    res.status(500).json({ 
      error: 'Failed to extract data',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};