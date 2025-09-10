'use client';

import { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import PDFViewer from '@/components/PDFViewer';
import InvoiceForm from '@/components/InvoiceForm';
import InvoiceList from '@/components/InvoiceList';
import { ExtractedInvoiceData } from '@/types/invoice';

export default function Home() {
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [uploadedFileId, setUploadedFileId] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedInvoiceData | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentView, setCurrentView] = useState<'upload' | 'list'>('upload');
  const [selectedInvoice, setSelectedInvoice] = useState<ExtractedInvoiceData | null>(null);
  const [extractionResult, setExtractionResult] = useState<string>('');

  const handleExtractData = async () => {
    if (!uploadedFileId) {
      alert('Please upload a PDF first');
      return;
    }

    setIsExtracting(true);
    setExtractionResult('');
    try {
      const response = await fetch('http://localhost:3001/extract', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileId: uploadedFileId,
          model: 'gemini'
        }),
      });

      const result = await response.json();
      
      if (!response.ok) {
        setExtractionResult(`Error: ${result.error || 'Extraction failed'}`);
        throw new Error(result.error || 'Extraction failed');
      }

      setExtractedData(result);
      setExtractionResult('Data extracted successfully!');
      console.log('Extraction successful:', result);
      
    } catch (error) {
      console.error('Extraction error:', error);
      setExtractionResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      alert('Failed to extract data. Please try again.');
    } finally {
      setIsExtracting(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (file.size > 25 * 1024 * 1024) {
      alert('File size must be less than 25MB');
      return;
    }

    setCurrentFile(file);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:3001/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const result = await response.json();
      setUploadedFileId(result.fileId);
      setUploadedFileUrl(`http://localhost:3001/uploads/${result.fileId}`);
      
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveInvoice = async () => {
    if (!extractedData) return;

    setIsSaving(true);
    try {
      const isUpdate = !!extractedData._id;
      const url = isUpdate 
        ? `http://localhost:3001/invoices/${extractedData._id}`
        : 'http://localhost:3001/invoices';
      
      const method = isUpdate ? 'PUT' : 'POST';

      const fileIdToUse = uploadedFileId || extractedData.fileId;
      if (!fileIdToUse && !isUpdate) {
        alert('Please upload a PDF first');
        setIsSaving(false);
        return;
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...extractedData,
          fileId: fileIdToUse,
          fileName: currentFile?.name || extractedData.fileName
        }),
      });

      const result = await response.json();
      
      if (response.ok) {
        setExtractedData(result);
        alert(`Invoice ${isUpdate ? 'updated' : 'saved'} successfully!`);
        
        if (isUpdate) {
          console.log('Invoice updated, consider refreshing the list');
        }
      } else {
        throw new Error(result.error || `Failed to ${isUpdate ? 'update' : 'save'} invoice`);
      }
    } catch (error) {
      console.error('Save error:', error);
      alert(error instanceof Error ? error.message : `Failed to save invoice`);
    } finally {
      setIsSaving(false);
    }
  };

  const checkDatabase = async () => {
    try {
      const response = await fetch('http://localhost:3001/invoices');
      const invoices = await response.json();
      console.log('Database invoices:', invoices);
      alert(`Found ${invoices.length} invoices in database. Check browser console for details.`);
    } catch (error) {
      console.error('Database check error:', error);
      alert('Failed to check database');
    }
  };

  // ✅ Replaced Navigation with the improved version
  const Navigation = () => (
    <nav className="bg-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-white">
                PDF Data Extraction Dashboard
              </h1>
            </div>
            <div className="sm:ml-6 sm:flex sm:space-x-8">
              <button
                onClick={() => setCurrentView('upload')}
                className={`${
                  currentView === 'upload'
                    ? 'border-blue-300 text-white'
                    : 'border-transparent text-gray-300 hover:border-gray-300 hover:text-white'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Upload & Extract
              </button>
              <button
                onClick={() => {
                  setCurrentView('list');
                  setSelectedInvoice(null);
                }}
                className={`${
                  currentView === 'list'
                    ? 'border-blue-300 text-white'
                    : 'border-transparent text-gray-300 hover:border-gray-300 hover:text-white'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Invoice List
              </button>
            </div>
          </div>
          <button
            onClick={checkDatabase}
            className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
          >
            Check DB
          </button>
        </div>
      </div>
    </nav>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === 'upload' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[1000px]">
            {/* Left Panel - Upload & PDF Viewer */}
            <div className="bg-white rounded-lg shadow flex flex-col">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-lg font-medium">PDF Upload & Viewer</h2>
                <button
                  onClick={handleExtractData}
                  disabled={!uploadedFileUrl || isExtracting}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md disabled:opacity-50 flex items-center text-sm"
                >
                  {isExtracting ? 'Extracting...' : 'Extract with AI'}
                </button>
              </div>
              
              <FileUpload onFileUpload={handleFileUpload} />
              
              {isUploading && (
                <div className="p-4 border-t">
                  <div className="flex items-center text-sm text-blue-600">
                    <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Uploading file...
                  </div>
                </div>
              )}
              
              {currentFile && !isUploading && (
                <div className="p-4 border-t">
                  <div className="flex items-center text-sm text-gray-600">
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <span>Selected: {currentFile.name}</span>
                    <span className="ml-2 text-gray-400">
                      ({(currentFile.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                </div>
              )}
              
              {extractionResult && (
                <div className={`p-2 m-4 rounded text-sm ${
                  extractionResult.includes('Error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                }`}>
                  {extractionResult}
                </div>
              )}
              
              <div className="border-t flex-1">
                <PDFViewer fileUrl={uploadedFileUrl} />
              </div>
            </div>

            {/* Right Panel - Data Form */}
            <div className="bg-white rounded-lg shadow">
              <div className="p-4 border-b">
                <h2 className="text-lg font-medium">Extracted Data</h2>
              </div>
              <InvoiceForm 
                data={extractedData} 
                onDataChange={setExtractedData}
                onSave={handleSaveInvoice}
                isSaving={isSaving}
              />
            </div>
          </div>
        ) : (
          <InvoiceList
            onSelectInvoice={(invoice) => {
              setSelectedInvoice(invoice);
              setExtractedData(invoice);
              if (invoice.fileId) {
                setUploadedFileId(invoice.fileId);
                setUploadedFileUrl(`http://localhost:3001/uploads/${invoice.fileId}`);
              }
              setCurrentView('upload');
            }}
            onNewInvoice={() => {
              setSelectedInvoice(null);
              setExtractedData(null);
              setUploadedFileId(null);
              setUploadedFileUrl(null);
              setCurrentView('upload');
            }}
          />
        )}
      </main>
    </div>
  );
}
