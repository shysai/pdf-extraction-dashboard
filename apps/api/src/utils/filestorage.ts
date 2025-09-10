import fs from 'fs';
import path from 'path';

export const storeFile = (fileId: string, buffer: Buffer): string => {
  const uploadsDir = path.join(__dirname, '../../uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  
  const filePath = path.join(uploadsDir, `${fileId}.pdf`);
  fs.writeFileSync(filePath, new Uint8Array(buffer));
  return filePath;
};

export const readFileText = async (filePath: string): Promise<string> => {
  // TODO: Implement PDF text extraction using pdf-parse or similar
  // For now, return mock text
  return "Invoice from TechCorp Inc. Invoice #: INV-2023-0088 Date: 2023-08-15 Total: $1356.25";
};