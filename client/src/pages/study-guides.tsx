import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import SearchBar from "@/components/search-bar";
import type { StudyGuide, Topic } from "@shared/schema";

export default function StudyGuides() {
  const { data: studyGuides = [] } = useQuery<StudyGuide[]>({
    queryKey: ['/api/study-guides'],
  });

  const { data: topics = [] } = useQuery<Topic[]>({
    queryKey: ['/api/topics'],
  });

  const getTopicName = (topicId: string | null) => {
    if (!topicId) return "General";
    const topic = topics.find(t => t.id === topicId);
    return topic?.name || "Unknown Topic";
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-medium text-gray-900">Study Guides</h2>
            <p className="text-gray-600">Manage your PDF study materials</p>
          </div>
          
          <SearchBar onUploadClick={() => {}} />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studyGuides.map((guide) => (
            <Card key={guide.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{guide.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{getTopicName(guide.topicId)}</p>
                  </div>
                  <div className="text-xs text-gray-500">
                    {guide.totalPages ? `${guide.totalPages} pages` : "PDF"}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">
                    Current page: {guide.currentPage || 1}
                  </div>
                  {guide.totalPages && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${((guide.currentPage || 1) / guide.totalPages) * 100}%` }}
                      />
                    </div>
                  )}
                  <div className="text-xs text-gray-500">
                    Uploaded: {new Date(guide.uploadedAt!).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {studyGuides.length === 0 && (
            <div className="col-span-full text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No study guides yet</h3>
              <p className="text-gray-600">Upload your first PDF study guide to get started</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
}
