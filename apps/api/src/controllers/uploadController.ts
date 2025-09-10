import { Request, Response } from 'express';

export const uploadPDF = (req: Request, res: Response) => {
  try {
    // Use simple approach - no types, just make it work
    const file = (req as any).file;
    
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    res.json({ 
      fileId: file.filename, 
      fileName: file.originalname,
      message: 'File uploaded successfully'
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
};