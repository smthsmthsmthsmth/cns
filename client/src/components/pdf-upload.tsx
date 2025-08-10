import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authenticatedApiCall } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Upload, X } from "lucide-react";
import type { Topic } from "@shared/schema";

interface PdfUploadProps {
  onUploadSuccess?: () => void;
}

export default function PdfUpload({ onUploadSuccess }: PdfUploadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTopicId, setSelectedTopicId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch topics for selection
  const { data: topics = [] } = useQuery<Topic[]>({
    queryKey: ['/api/topics'],
    queryFn: () => authenticatedApiCall('/api/topics'),
  });

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      return authenticatedApiCall('/api/study-guides/upload', {
        method: 'POST',
        body: formData,
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: `Study guide uploaded: ${data.title}`,
      });
      setIsOpen(false);
      resetForm();
      queryClient.invalidateQueries({ queryKey: ['/api/study-guides'] });
      onUploadSuccess?.();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to upload: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setSelectedTopicId("");
    setTitle("");
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
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

    // Check file size (50MB limit)
    const maxSize = 50 * 1024 * 1024; // 50MB in bytes
    if (file.size > maxSize) {
      toast({
        title: "Error",
        description: "File too large. Maximum size is 50MB.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    // Auto-set title if not already set
    if (!title) {
      setTitle(file.name.replace('.pdf', ''));
    }
  };

  const handleUpload = () => {
    if (!selectedFile || !title || !selectedTopicId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields and select a PDF file",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append('pdf', selectedFile);
    formData.append('title', title);
    formData.append('topicId', selectedTopicId);
    
    uploadMutation.mutate(formData);
  };

  const handleClose = () => {
    setIsOpen(false);
    resetForm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-medical-blue text-white hover:bg-blue-700">
          <Upload className="w-4 h-4 mr-2" />
          Upload PDF
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload PDF Study Guide</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Topic Selection */}
          <div className="space-y-2">
            <Label htmlFor="topic">Topic</Label>
            <Select value={selectedTopicId} onValueChange={setSelectedTopicId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a topic" />
              </SelectTrigger>
              <SelectContent>
                {topics.map((topic) => (
                  <SelectItem key={topic._id?.toString()} value={topic._id?.toString() || ""}>
                    {topic.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Title Input */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter study guide title"
            />
          </div>

          {/* File Selection */}
          <div className="space-y-2">
            <Label htmlFor="file">PDF File</Label>
            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadMutation.isPending}
              >
                {selectedFile ? "Change File" : "Select PDF"}
              </Button>
              {selectedFile && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedFile(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
            <Input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
            {selectedFile && (
              <p className="text-sm text-gray-600">
                Selected: {selectedFile.name}
              </p>
            )}
            <p className="text-xs text-gray-500">
              Maximum file size: 50MB. Only PDF files are supported.
              PDFs are automatically compressed and stored securely in the database.
            </p>
          </div>

          {/* Upload Button */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleUpload}
              disabled={!selectedFile || !title || !selectedTopicId || uploadMutation.isPending}
            >
              {uploadMutation.isPending ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
