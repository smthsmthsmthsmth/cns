import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Play, Link } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import TopicSelector from "./topic-selector";
import type { Video, Topic } from "@shared/schema";

interface VideoFormProps {
  video?: Video;
  mode: "create" | "edit";
  trigger?: React.ReactNode;
}

export default function VideoForm({ video, mode, trigger }: VideoFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(video?.title || "");
  const [description, setDescription] = useState(video?.description || "");
  const [url, setUrl] = useState(video?.url || "");
  const [platform, setPlatform] = useState(video?.platform || "");
  const [duration, setDuration] = useState(video?.duration?.toString() || "");
  const [thumbnailUrl, setThumbnailUrl] = useState(video?.thumbnailUrl || "");
  const [selectedTopicId, setSelectedTopicId] = useState(video?.topicId?.toString() || "");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: topics = [] } = useQuery<Topic[]>({
    queryKey: ['/api/topics'],
  });

  const createMutation = useMutation({
    mutationFn: async (videoData: { 
      title: string; 
      description?: string; 
      url: string; 
      platform?: string; // Made optional to match backend
      duration?: number; // Duration should be number
      thumbnailUrl?: string; 
      topicId?: string; 
    }) => {
      const response = await apiRequest('POST', '/api/videos', videoData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Video added successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/videos'] });
      setIsOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to add video: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (videoData: { 
      title: string; 
      description?: string; 
      url: string; 
      platform?: string; // Made optional to match backend
      duration?: number; // Duration should be number
      thumbnailUrl?: string; 
      topicId?: string; 
    }) => {
      const response = await apiRequest('PUT', `/api/videos/${video?._id}`, videoData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Video updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/videos'] });
      setIsOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update video: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setUrl("");
    setPlatform("");
    setDuration("");
    setThumbnailUrl("");
    setSelectedTopicId("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isOpen) {
      return;
    }
    
    if (createMutation.isPending || updateMutation.isPending) {
      return;
    }
    
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }

    if (!url.trim()) {
      toast({
        title: "Error",
        description: "URL is required",
        variant: "destructive",
      });
      return;
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      toast({
        title: "Error",
        description: "Please enter a valid URL",
        variant: "destructive",
      });
      return;
    }

    // Convert duration string to number if provided
    let durationNumber: number | undefined;
    if (duration.trim()) {
      const durationMatch = duration.trim().match(/^(\d+):(\d+)$/);
      if (durationMatch) {
        const minutes = parseInt(durationMatch[1]);
        const seconds = parseInt(durationMatch[2]);
        durationNumber = minutes * 60 + seconds;
      } else {
        toast({
          title: "Error",
          description: "Duration should be in format MM:SS (e.g., 15:30)",
          variant: "destructive",
        });
        return;
      }
    }

    const videoData = {
      title: title.trim(),
      description: description.trim() || undefined,
      url: url.trim(),
      platform: platform.trim() || undefined,
      duration: durationNumber,
      thumbnailUrl: thumbnailUrl.trim() || undefined,
      topicId: selectedTopicId || undefined,
    };

    if (mode === "create") {
      createMutation.mutate(videoData);
    } else {
      updateMutation.mutate(videoData);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-medical-blue text-white hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            {mode === "create" ? "Add Video" : "Edit Video"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add New Video" : "Edit Video"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter video title"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter video description..."
              rows={3}
            />
          </div>
          
          <div>
            <Label htmlFor="url">Video URL *</Label>
            <Input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
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
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="platform">Platform (Optional)</Label>
              <Select value={platform} onValueChange={setPlatform}>
                <SelectTrigger>
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="YouTube">YouTube</SelectItem>
                  <SelectItem value="Vimeo">Vimeo</SelectItem>
                  <SelectItem value="Khan Academy">Khan Academy</SelectItem>
                  <SelectItem value="Coursera">Coursera</SelectItem>
                  <SelectItem value="edX">edX</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="duration">Duration (Optional)</Label>
              <Input
                id="duration"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g., 15:30"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="thumbnailUrl">Thumbnail URL (Optional)</Label>
            <Input
              id="thumbnailUrl"
              type="url"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              placeholder="https://example.com/thumbnail.jpg"
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
              disabled={isLoading || !title.trim() || !url.trim()}
            >
              {isLoading ? "Saving..." : mode === "create" ? "Add Video" : "Update Video"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 