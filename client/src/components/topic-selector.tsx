import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, BookOpen } from "lucide-react";
import { authenticatedApiCall } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import type { Topic } from "@shared/schema";

interface TopicSelectorProps {
  selectedTopicId?: string;
  onTopicSelect: (topicId: string) => void;
  placeholder?: string;
}

export default function TopicSelector({ selectedTopicId, onTopicSelect, placeholder = "Select a topic" }: TopicSelectorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newTopicName, setNewTopicName] = useState("");
  const [newTopicDescription, setNewTopicDescription] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: topics = [] } = useQuery<Topic[]>({
    queryKey: ['/api/topics'],
    queryFn: () => authenticatedApiCall('/api/topics'),
  });

  const createTopicMutation = useMutation({
    mutationFn: async (topicData: { name: string; description: string }) => {
      return authenticatedApiCall('/api/topics', {
        method: 'POST',
        body: JSON.stringify(topicData),
      });
    },
    onSuccess: (newTopic) => {
      toast({
        title: "Success",
        description: "Topic created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/topics'] });
      onTopicSelect(newTopic._id);
      setIsDialogOpen(false);
      setNewTopicName("");
      setNewTopicDescription("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create topic",
        variant: "destructive",
      });
    },
  });

  const handleCreateTopic = () => {
    if (!newTopicName.trim()) {
      toast({
        title: "Error",
        description: "Topic name is required",
        variant: "destructive",
      });
      return;
    }

    createTopicMutation.mutate({
      name: newTopicName.trim(),
      description: newTopicDescription.trim(),
    });
  };

  const selectedTopic = topics.find(t => t._id === selectedTopicId);

  return (
    <div className="flex items-center space-x-2">
      <Select value={selectedTopicId} onValueChange={onTopicSelect}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {topics.map((topic) => (
            <SelectItem key={topic._id} value={topic._id}>
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4" />
                <span>{topic.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-1" />
            New Topic
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Topic</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="topic-name">Topic Name</Label>
              <Input
                id="topic-name"
                value={newTopicName}
                onChange={(e) => setNewTopicName(e.target.value)}
                placeholder="Enter topic name"
              />
            </div>
            <div>
              <Label htmlFor="topic-description">Description (Optional)</Label>
              <Input
                id="topic-description"
                value={newTopicDescription}
                onChange={(e) => setNewTopicDescription(e.target.value)}
                placeholder="Enter topic description"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleCreateTopic}
                disabled={createTopicMutation.isPending || !newTopicName.trim()}
              >
                {createTopicMutation.isPending ? "Creating..." : "Create Topic"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 