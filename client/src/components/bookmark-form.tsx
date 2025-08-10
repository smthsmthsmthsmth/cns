import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Bookmark, Book, Play, StickyNote } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Bookmark as BookmarkType, StudyGuide, Video, Note } from "@shared/schema";

interface BookmarkFormProps {
  resourceType: "pdf" | "video" | "note";
  resourceId: string;
  resourceTitle: string;
  trigger?: React.ReactNode;
}

export default function BookmarkForm({ resourceType, resourceId, resourceTitle, trigger }: BookmarkFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(resourceTitle);
  const [description, setDescription] = useState("");
  const [pageNumber, setPageNumber] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async (bookmarkData: { 
      type: string; 
      resourceId: string; 
      title: string; 
      description?: string; 
      pageNumber?: number; 
      timestamp?: string; 
    }) => {
      const response = await apiRequest('POST', '/api/bookmarks', bookmarkData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Bookmark created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/bookmarks'] });
      setIsOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create bookmark: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setTitle(resourceTitle);
    setDescription("");
    setPageNumber("");
    setTimestamp("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }

    const bookmarkData = {
      type: resourceType,
      resourceId,
      title: title.trim(),
      description: description.trim() || undefined,
      pageNumber: pageNumber ? parseInt(pageNumber) : undefined,
      timestamp: timestamp.trim() || undefined,
    };

    createMutation.mutate(bookmarkData);
  };

  const getTypeIcon = () => {
    switch (resourceType) {
      case "pdf": return <Book className="w-4 h-4" />;
      case "video": return <Play className="w-4 h-4" />;
      case "note": return <StickyNote className="w-4 h-4" />;
      default: return <Bookmark className="w-4 h-4" />;
    }
  };

  const getTypeLabel = () => {
    switch (resourceType) {
      case "pdf": return "PDF";
      case "video": return "Video";
      case "note": return "Note";
      default: return "Resource";
    }
  };

  const isLoading = createMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm">
            <Bookmark className="w-4 h-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            Bookmark {getTypeLabel()}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
            {getTypeIcon()}
            <span className="text-sm text-gray-600">
              {getTypeLabel()}: {resourceTitle}
            </span>
          </div>
          
          <div>
            <Label htmlFor="title">Bookmark Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter bookmark title"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter bookmark description..."
              rows={3}
            />
          </div>
          
          {resourceType === "pdf" && (
            <div>
              <Label htmlFor="pageNumber">Page Number (Optional)</Label>
              <Input
                id="pageNumber"
                type="number"
                min="1"
                value={pageNumber}
                onChange={(e) => setPageNumber(e.target.value)}
                placeholder="e.g., 15"
              />
            </div>
          )}
          
          {resourceType === "video" && (
            <div>
              <Label htmlFor="timestamp">Timestamp (Optional)</Label>
              <Input
                id="timestamp"
                value={timestamp}
                onChange={(e) => setTimestamp(e.target.value)}
                placeholder="e.g., 5:30"
              />
            </div>
          )}
          
          <div className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isLoading || !title.trim()}
            >
              {isLoading ? "Creating..." : "Create Bookmark"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 