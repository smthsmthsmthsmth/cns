import { useQuery } from "@tanstack/react-query";
import { StickyNote, Edit, Trash2, Plus } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/search-bar";
import type { Note, Topic } from "@shared/schema";

export default function Notes() {
  const { data: notes = [] } = useQuery<Note[]>({
    queryKey: ['/api/notes'],
  });

  const { data: topics = [] } = useQuery<Topic[]>({
    queryKey: ['/api/topics'],
  });

  const getTopicName = (topicId: string | null) => {
    if (!topicId) return "General";
    const topic = topics.find(t => t.id === topicId);
    return topic?.name || "Unknown Topic";
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    return content.length > maxLength ? content.substring(0, maxLength) + "..." : content;
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-medium text-gray-900">Notes</h2>
            <p className="text-gray-600">Your personal study notes</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <SearchBar onUploadClick={() => {}} />
            <Button className="bg-medical-blue text-white hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              New Note
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6">
        {notes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <Card key={note.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900 line-clamp-2 mb-1">
                        {note.title}
                      </h3>
                      <div className="text-xs text-gray-500">
                        {getTopicName(note.topicId)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600 line-clamp-4">
                      {truncateContent(note.content)}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>
                        Created: {new Date(note.createdAt!).toLocaleDateString()}
                      </span>
                      <span>
                        Modified: {new Date(note.updatedAt!).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <StickyNote className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notes yet</h3>
            <p className="text-gray-600 mb-4">Start taking notes to organize your thoughts and key concepts</p>
            <Button className="bg-medical-blue text-white hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Note
            </Button>
          </div>
        )}
      </main>
    </>
  );
}
