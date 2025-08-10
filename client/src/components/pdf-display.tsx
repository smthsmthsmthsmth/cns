import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Download, ExternalLink, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { authenticatedApiCall } from "@/lib/api";
import type { StudyGuide } from "@shared/schema";

interface PdfDisplayProps {
  studyGuide: StudyGuide;
}

export default function PdfDisplay({ studyGuide }: PdfDisplayProps) {
  const [currentPage, setCurrentPage] = useState(studyGuide.currentPage || 1);
  const [totalPages, setTotalPages] = useState(studyGuide.totalPages || 1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);

  // Generate PDF URL - this would be served by the backend
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const pdfApiUrl = `${baseUrl}/api/study-guides/${studyGuide._id}/file`;

  const progressPercentage = totalPages 
    ? Math.round((currentPage / totalPages) * 100)
    : 0;

  const handleDownload = () => {
    if (pdfBlobUrl) {
      const link = document.createElement('a');
      link.href = pdfBlobUrl;
      link.download = studyGuide.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // Fallback to direct download if blob URL is not available
      const link = document.createElement('a');
      link.href = pdfApiUrl;
      link.download = studyGuide.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleOpenInNewTab = () => {
    if (pdfBlobUrl) {
      window.open(pdfBlobUrl, '_blank');
    } else {
      window.open(pdfApiUrl, '_blank');
    }
  };

  // Fetch PDF with authentication and create blob URL
  useEffect(() => {
    const fetchPdf = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const endpoint = `/api/study-guides/${studyGuide._id}/file`;
        
        // Fetch PDF with authentication
        const response = await fetch(pdfApiUrl, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Authentication failed. Please log in again.");
          } else if (response.status === 404) {
            throw new Error("PDF file not found");
          } else {
            throw new Error(`Failed to fetch PDF: ${response.status}`);
          }
        }
        
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);
        setPdfBlobUrl(blobUrl);
        
      } catch (err) {
        console.error('Error fetching PDF:', err);
        setError(err instanceof Error ? err.message : "Failed to load PDF");
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchPdf();
  
    // Cleanup blob URL on unmount
    return () => {
      if (pdfBlobUrl) {
        URL.revokeObjectURL(pdfBlobUrl);
      }
    };
  }, [studyGuide._id, pdfApiUrl]);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">{studyGuide.title}</h3>
            <p className="text-sm text-gray-600 mt-1">
              {studyGuide.fileName} • {totalPages} pages
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="w-4 w-4 mr-2" />
              Download
            </Button>
            <Button variant="outline" size="sm" onClick={handleOpenInNewTab}>
              <ExternalLink className="w-4 w-4 mr-2" />
              Open
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* PDF Viewer */}
          <div className="border-2 border-gray-200 rounded-lg h-96 overflow-hidden">
            {isLoading && (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-gray-600">Loading PDF...</p>
                </div>
              </div>
            )}
            
            {error && (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-red-500 mb-2">⚠️</div>
                  <p className="text-red-600 mb-4">{error}</p>
                  <div className="space-y-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleOpenInNewTab}
                    >
                      <ExternalLink className="w-4 w-4 mr-2" />
                      Open in New Tab
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleDownload}
                    >
                      <Download className="w-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                </div>
              </div>
            )}
            
            {pdfBlobUrl && !error && !isLoading && (
              <div className="w-full h-full">
                <iframe
                  src={`${pdfBlobUrl}#page=${currentPage}`}
                  className="w-full h-full border-0"
                  title={studyGuide.title}
                />
              </div>
            )}
          </div>
          
          {/* Navigation Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <Progress value={progressPercentage} className="w-32" />
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage <= 1}
              >
                <ChevronLeft className="w-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage >= totalPages}
              >
                <ChevronRight className="w-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 