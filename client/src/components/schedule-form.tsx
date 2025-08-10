import { useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Calendar, Clock } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import TopicSelector from "./topic-selector";
import type { ScheduleItem, Topic } from "@shared/schema";

interface ScheduleFormProps {
  scheduleItem?: ScheduleItem;
  mode: "create" | "edit";
  trigger?: React.ReactNode;
}

export default function ScheduleForm({ scheduleItem, mode, trigger }: ScheduleFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(scheduleItem?.title || "");
  const [description, setDescription] = useState(scheduleItem?.description || "");
  const [startTime, setStartTime] = useState(
    scheduleItem?.startTime ? new Date(scheduleItem.startTime).toISOString().slice(0, 16) : ""
  );
  const [endTime, setEndTime] = useState(
    scheduleItem?.endTime ? new Date(scheduleItem.endTime).toISOString().slice(0, 16) : ""
  );
  const [status, setStatus] = useState(scheduleItem?.status || "not-started");
  const [selectedTopicId, setSelectedTopicId] = useState(scheduleItem?.topicId?.toString() || "");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: topics = [] } = useQuery<Topic[]>({
    queryKey: ['/api/topics'],
  });

  const createMutation = useMutation({
    mutationFn: async (scheduleData: { 
      title: string; 
      description?: string; 
      startTime: string; 
      endTime: string; 
      status: string; 
      topicId?: string; 
    }) => {
      const response = await apiRequest('POST', '/api/schedule', scheduleData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Schedule item created successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/schedule'] });
      setIsOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create schedule item: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (scheduleData: { 
      title: string; 
      description?: string; 
      startTime: string; 
      endTime: string; 
      status: string; 
      topicId?: string; 
    }) => {
      const response = await apiRequest('PUT', `/api/schedule/${scheduleItem?._id}`, scheduleData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Schedule item updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/schedule'] });
      setIsOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update schedule item: ${error.message}`,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStartTime("");
    setEndTime("");
    setStatus("not-started");
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

    if (!startTime) {
      toast({
        title: "Error",
        description: "Start time is required",
        variant: "destructive",
      });
      return;
    }

    if (!endTime) {
      toast({
        title: "Error",
        description: "End time is required",
        variant: "destructive",
      });
      return;
    }

    if (new Date(startTime) >= new Date(endTime)) {
      toast({
        title: "Error",
        description: "End time must be after start time",
        variant: "destructive",
      });
      return;
    }

    const scheduleData = {
      title: title.trim(),
      description: description.trim() || undefined,
      startTime: new Date(startTime).toISOString(),
      endTime: new Date(endTime).toISOString(),
      status,
      topicId: selectedTopicId || undefined,
    };

    if (mode === "create") {
      createMutation.mutate(scheduleData);
    } else {
      updateMutation.mutate(scheduleData);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-medical-blue text-white hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            {mode === "create" ? "Add Task" : "Edit Task"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add New Task" : "Edit Task"}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description..."
              rows={3}
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
              <Label htmlFor="startTime">Start Time</Label>
              <Input
                id="startTime"
                type="datetime-local"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="datetime-local"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not-started">Not Started</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
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
              disabled={isLoading || !title.trim() || !startTime || !endTime}
            >
              {isLoading ? "Saving..." : mode === "create" ? "Create Task" : "Update Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 