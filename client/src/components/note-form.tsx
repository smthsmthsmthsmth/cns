import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, X } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import TopicSelector from "./topic-selector";
import type { Note, Topic } from "@shared/schema";

interface NoteFormProps {
  note?: Note;
  mode: "create" | "edit";
  trigger?: React.ReactNode;
}

export default function NoteForm({ note, mode, trigger }: NoteFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");
  const [selectedTopicId, setSelectedTopicId] = useState(note?.topicId?.toString() || "");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: topics = [] } = useQuery<Topic[]>({
    queryKey: ['/api/topics'],
  });

  const createMutation = useMutation({
    mutationFn: async (noteData: { title: string; content: string; topicId?: string }) => {
      const response = await apiRequest('POST', '/api/notes', noteData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Note created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/notes'] });
      setIsOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create note: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (noteData: { title: string; content: string; topicId?: string }) => {
      const response = await apiRequest('PUT', `/api/notes/${note?._id}`, noteData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Note updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/notes'] });
      setIsOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update note: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setTitle("");
    setContent("");
    setSelectedTopicId("");
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

    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Content is required",
        variant: "destructive",
      });
      return;
    }

    const noteData = {
      title: title.trim(),
      content: content.trim(),
      topicId: selectedTopicId || undefined,
    };

    if (mode === "create") {
      createMutation.mutate(noteData);
    } else {
      updateMutation.mutate(noteData);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-medical-blue text-white hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            {mode === "create" ? "New Note" : "Edit Note"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create New Note" : "Edit Note"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="topic">Topic (Optional)</Label>
            <TopicSelector
              selectedTopicId={selectedTopicId}
              onTopicSelect={setSelectedTopicId}
              placeholder="Select a topic"
            />
          </div>
          
          <div>
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter your note content..."
              rows={8}
              required
            />
          </div>
          
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
              disabled={isLoading || !title.trim() || !content.trim()}
            >
              {isLoading ? "Saving..." : mode === "create" ? "Create Note" : "Update Note"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 