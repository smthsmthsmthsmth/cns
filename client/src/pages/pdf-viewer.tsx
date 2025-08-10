import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import PdfDisplay from "@/components/pdf-display";
import { authenticatedApiCall } from "@/lib/api";
import type { StudyGuide } from "@shared/schema";

export default function PdfViewerPage() {
  const [location, setLocation] = useLocation();
  
  // Extract study guide ID from URL
  const studyGuideId = location.split('/').pop();
  
  const { data: studyGuide, isLoading, error } = useQuery<StudyGuide>({
    queryKey: ['/api/study-guides', studyGuideId],
    queryFn: () => authenticatedApiCall(`/api/study-guides/${studyGuideId}`),
    enabled: !!studyGuideId,
  });

  const handleBack = () => {
    setLocation('/study-guides');
  };

  if (isLoading) {
    return (
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Loading PDF...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !studyGuide) {
    return (
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="text-red-500 mb-4">⚠️</div>
              <h2 className="text-xl font-medium text-gray-900 mb-2">PDF Not Found</h2>
              <p className="text-gray-600 mb-4">The requested PDF could not be found.</p>
              <Button onClick={handleBack}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Study Guides
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h2 className="text-2xl font-medium text-gray-900">PDF Viewer</h2>
              <p className="text-gray-600">View and navigate your study guides</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span className="text-sm text-gray-600">Study Guide</span>
          </div>
        </div>

        {/* PDF Display */}
        <PdfDisplay studyGuide={studyGuide} />
      </div>
    </div>
  );
} 