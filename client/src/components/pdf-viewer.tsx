import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Bookmark, StickyNote, Expand } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { StudyGuide } from "@shared/schema";

interface PdfViewerProps {
  studyGuide?: StudyGuide | null;
  onUpload?: () => void;
}

export default function PdfViewer({ studyGuide, onUpload }: PdfViewerProps) {
  const [currentPage, setCurrentPage] = useState(studyGuide?.currentPage || 1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiRequest('POST', '/api/study-guides/upload', formData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Study guide uploaded successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/study-guides'] });
      if (onUpload) onUpload();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to upload study guide",
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      const formData = new FormData();
      formData.append('pdf', file);
      formData.append('title', file.name.replace('.pdf', ''));
      formData.append('topicId', 'default-topic'); // This should come from selected topic
      
      uploadMutation.mutate(formData);
    } else {
      toast({
        title: "Error",
        description: "Please select a valid PDF file",
        variant: "destructive",
      });
    }
  };

  const progressPercentage = studyGuide?.totalPages 
    ? Math.round((currentPage / studyGuide.totalPages) * 100)
    : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Current Study Guide</h3>
            <p className="text-sm text-gray-600 mt-1">
              {studyGuide?.title || "No study guide selected"}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Bookmark className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <StickyNote className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Expand className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {studyGuide ? (
          <div>
            {/* PDF Content Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg h-96 flex items-center justify-center mb-4">
              <div className="text-center">
                <div className="text-4xl text-red-500 mb-4">📄</div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">PDF Content</h4>
                <p className="text-gray-600">Page {currentPage} of {studyGuide.totalPages || 1}</p>
              </div>
            </div>
            
            {/* Navigation Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {studyGuide.totalPages || 1}
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
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setCurrentPage(Math.min(studyGuide.totalPages || 1, currentPage + 1))}
                  disabled={currentPage >= (studyGuide.totalPages || 1)}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="pdf-viewer-placeholder rounded-lg border-2 border-dashed border-gray-300 h-96 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl text-red-500 mb-4">📄</div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">PDF Viewer Integration</h4>
              <p className="text-gray-600 mb-4">University study guide will be displayed here</p>
              <Button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-medical-blue text-white hover:bg-blue-700"
                disabled={uploadMutation.isPending}
              >
                {uploadMutation.isPending ? "Uploading..." : "Upload Study Guide"}
              </Button>
              <Input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
