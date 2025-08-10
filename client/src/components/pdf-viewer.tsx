import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Bookmark, StickyNote, Expand, Eye, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import TopicSelector from "./topic-selector";
import { Link } from "wouter";
import type { StudyGuide } from "@shared/schema";

interface PdfViewerProps {
  studyGuide?: StudyGuide | null;
  onUpload?: () => void;
  showUploadInterface?: boolean; // New prop to control when to show upload interface
}

export default function PdfViewer({ studyGuide, onUpload, showUploadInterface = false }: PdfViewerProps) {
  const [currentPage, setCurrentPage] = useState(studyGuide?.currentPage || 1);
  const [selectedTopicId, setSelectedTopicId] = useState<string>("");
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
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast({
        title: "Error",
        description: "Please select a valid PDF file",
        variant: "destructive",
      });
      return;
    }

    if (!selectedTopicId) {
      toast({
        title: "Error",
        description: "Please select a topic first",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('title', file.name.replace('.pdf', ''));
    formData.append('topicId', selectedTopicId);
    
    uploadMutation.mutate(formData);
  };

  const progressPercentage = studyGuide?.totalPages 
    ? Math.round((currentPage / studyGuide.totalPages) * 100)
    : 0;

  // Show upload interface if explicitly requested or if no study guide exists
  const shouldShowUploadInterface = showUploadInterface || !studyGuide;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {shouldShowUploadInterface ? "Upload Study Guide" : "Current Study Guide"}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {shouldShowUploadInterface 
                ? "Upload a new PDF study guide to get started"
                : studyGuide?.title || "No study guide selected"
              }
            </p>
          </div>
          {studyGuide && (
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon">
                <Bookmark className="w-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <StickyNote className="w-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Expand className="w-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {shouldShowUploadInterface ? (
          // Upload Interface
          <div className="pdf-viewer-placeholder rounded-lg border-2 border-dashed border-gray-300 h-96 flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl text-red-500 mb-4">📄</div>
              <h4 className="text-lg font-medium text-gray-900 mb-2">PDF Viewer Integration</h4>
              <p className="text-gray-600 mb-4">University study guide will be displayed here</p>
              
              {/* Topic Selector */}
              <div className="mb-4">
                <TopicSelector
                  selectedTopicId={selectedTopicId}
                  onTopicSelect={setSelectedTopicId}
                  placeholder="Select topic for upload"
                />
              </div>
              
              <Button 
                onClick={() => fileInputRef.current?.click()}
                className="bg-medical-blue text-white hover:bg-blue-700"
                disabled={uploadMutation.isPending || !selectedTopicId}
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
        ) : (
          // PDF Display Interface
          <div>
            {/* PDF Content Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg h-96 flex items-center justify-center mb-4">
              <div className="text-center">
                <div className="text-4xl text-red-500 mb-4">📄</div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">PDF Content</h4>
                <p className="text-gray-600 mb-4">Page {currentPage} of {studyGuide.totalPages || 1}</p>
                
                {/* View PDF Button */}
                <Link href={`/study-guides/${studyGuide._id}`}>
                  <Button className="bg-medical-blue text-white hover:bg-blue-700">
                    <Eye className="w-4 w-4 mr-2" />
                    View PDF
                  </Button>
                </Link>
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
                  <ChevronLeft className="w-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setCurrentPage(Math.min(studyGuide.totalPages || 1, currentPage + 1))}
                  disabled={currentPage >= (studyGuide.totalPages || 1)}
                >
                  <ChevronRight className="w-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
