import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function TestUpload() {
  const [selectedTopicId, setSelectedTopicId] = useState("689506a72350eab786e17bf8"); // Use the topic we created
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await apiRequest('POST', '/api/study-guides/upload', formData);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Success",
        description: `Study guide uploaded: ${data.title}`,
      });
      console.log("Upload successful:", data);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to upload: ${error.message}`,
        variant: "destructive",
      });
      console.error("Upload failed:", error);
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log("File selected:", file.name, file.type, file.size);

    if (file.type !== 'application/pdf') {
      toast({
        title: "Error",
        description: "Please select a valid PDF file",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append('pdf', file);
    formData.append('title', file.name.replace('.pdf', ''));
    formData.append('topicId', selectedTopicId);
    
    console.log("Uploading with topicId:", selectedTopicId);
    uploadMutation.mutate(formData);
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-medium mb-4">Test PDF Upload</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Topic ID:</label>
          <Input
            value={selectedTopicId}
            onChange={(e) => setSelectedTopicId(e.target.value)}
            placeholder="Enter topic ID"
          />
        </div>
        <div>
          <Button 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadMutation.isPending}
          >
            {uploadMutation.isPending ? "Uploading..." : "Select PDF File"}
          </Button>
          <Input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
        {uploadMutation.isPending && (
          <div className="text-blue-600">Uploading...</div>
        )}
        {uploadMutation.isError && (
          <div className="text-red-600">Error: {uploadMutation.error?.message}</div>
        )}
        {uploadMutation.isSuccess && (
          <div className="text-green-600">Upload successful!</div>
        )}
      </div>
    </div>
  );
} 