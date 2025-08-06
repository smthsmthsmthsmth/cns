import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, Plus } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/search-bar";
import type { ScheduleItem, Topic } from "@shared/schema";

export default function Schedule() {
  const { data: scheduleItems = [] } = useQuery<ScheduleItem[]>({
    queryKey: ['/api/schedule'],
  });

  const { data: topics = [] } = useQuery<Topic[]>({
    queryKey: ['/api/topics'],
  });

  const getTopicName = (topicId: string | null) => {
    if (!topicId) return "General";
    const topic = topics.find(t => t.id === topicId);
    return topic?.name || "Unknown Topic";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-complete-green";
      case "in-progress": return "bg-progress-yellow";
      default: return "bg-not-started-gray";
    }
  };

  const groupedSchedule = scheduleItems.reduce((groups, item) => {
    const date = new Date(item.startTime).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {} as Record<string, ScheduleItem[]>);

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-medium text-gray-900">Study Schedule</h2>
            <p className="text-gray-600">Plan and track your study sessions</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <SearchBar onUploadClick={() => {}} />
            <Button className="bg-medical-blue text-white hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6">
        {Object.keys(groupedSchedule).length > 0 ? (
          <div className="space-y-6">
            {Object.entries(groupedSchedule)
              .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
              .map(([date, items]) => (
                <Card key={date}>
                  <CardHeader>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-gray-600" />
                      <h3 className="text-lg font-medium text-gray-900">
                        {new Date(date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </h3>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                          <div className={`w-3 h-3 rounded-full mt-2 ${getStatusColor(item.status)}`} />
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className={`font-medium ${item.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                                {item.title}
                              </h4>
                              <div className="flex items-center text-xs text-gray-500">
                                <Clock className="w-3 h-3 mr-1" />
                                {new Date(item.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                                {new Date(item.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </div>
                            </div>
                            {item.description && (
                              <p className="text-sm text-gray-600 mb-2">{item.description}</p>
                            )}
                            <div className="text-xs text-gray-500">
                              Topic: {getTopicName(item.topicId)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Calendar className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No scheduled tasks</h3>
            <p className="text-gray-600 mb-4">Create your first study schedule to stay organized</p>
            <Button className="bg-medical-blue text-white hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Task
            </Button>
          </div>
        )}
      </main>
    </>
  );
}
