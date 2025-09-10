'use client';

import { useState } from 'react';

interface PDFViewerProps {
  fileUrl: string | null;
}

export default function PDFViewer({ fileUrl }: PDFViewerProps) {
  const [error, setError] = useState<string | null>(null);
// Just change the empty state to be more compact:
if (!fileUrl) {
  return (
    <div className="flex items-center justify-center h-48 bg-gray-100 rounded-lg"> 
      <div className="text-center text-gray-500">
        <p className="text-sm">Upload a PDF to view</p> 
      </div>
    </div>
  );
}

  return (
    <div className="flex flex-col h-full">
      {/* Viewer Controls */}
      <div className="flex items-center justify-between p-3 bg-gray-100 border-b">
        <h3 className="text-sm font-medium">PDF Viewer</h3>
        <span className="text-xs text-gray-500">Powered by browser</span>
      </div>

      {/* PDF Display */}
      <div className="flex-1 overflow-auto bg-gray-800">
        <iframe
          src={fileUrl}
          className="w-full h-full"
          title="PDF document"
          onError={() => setError('Failed to load PDF. Your browser may not support PDF viewing.')}
        />
        {error && (
          <div className="p-4 text-white bg-red-600">
            <p>{error}</p>
            <p className="text-sm mt-2">
              Try downloading the file instead: 
              <a href={fileUrl} download className="underline ml-1">
                Download PDF
              </a>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}