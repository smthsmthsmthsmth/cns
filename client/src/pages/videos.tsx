import { useQuery } from "@tanstack/react-query";
import { Play, Bookmark, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/search-bar";
import VideoForm from "@/components/video-form";
import type { Video, Topic } from "@shared/schema";

export default function Videos() {
  const { data: videos = [], error: videosError, isLoading: videosLoading } = useQuery<Video[]>({
    queryKey: ['/api/videos'],
  });

  const { data: topics = [], error: topicsError } = useQuery<Topic[]>({
    queryKey: ['/api/topics'],
  });

  const getTopicName = (topicId: string | null) => {
    if (!topicId) return "General";
    const topic = topics.find(t => t._id?.toString() === topicId);
    return topic?.name || "Unknown Topic";
  };

  const handleVideoClick = (video: Video) => {
    // Open video in new tab
    window.open(video.url, '_blank');
  };

  if (videosError) {
    return (
      <div className="flex-1 overflow-y-auto p-6">
        <div className="text-center py-12">
          <div className="text-red-400 mb-4">
            <Play className="w-16 h-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading videos</h3>
          <p className="text-gray-600">Failed to load video resources. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-medium text-gray-900">Video Resources</h2>
            <p className="text-gray-600">Educational videos for CNS topics</p>
          </div>
          
          <SearchBar />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">All Videos</h3>
          <VideoForm mode="create" />
        </div>
        
        {videosLoading ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Play className="w-16 h-16 mx-auto animate-pulse" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Loading videos...</h3>
            <p className="text-gray-600">Please wait while we fetch your video resources</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <Card key={video._id?.toString() || video.url} className="hover:shadow-md transition-shadow cursor-pointer group" onClick={() => handleVideoClick(video)}>
                <div className="relative">
                  {video.thumbnailUrl ? (
                    <img 
                      src={video.thumbnailUrl} 
                      alt={video.title}
                      className="w-full h-48 object-cover rounded-t-lg group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-blue-200 rounded-t-lg flex items-center justify-center">
                      <Play className="w-12 h-12 text-blue-600" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg">
                    <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                      <Play className="w-6 h-6 text-gray-800 ml-1" />
                    </div>
                  </div>
                  {video.duration && (
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                      {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                    </div>
                  )}
                </div>
                
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <h3 className="font-medium text-gray-900 line-clamp-2">{video.title}</h3>
                    {video.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">{video.description}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="text-xs text-gray-500">{getTopicName(video.topicId?.toString() || null)}</div>
                        {video.platform && (
                          <div className="text-xs text-gray-500">{video.platform}</div>
                        )}
                      </div>
                      <Button variant="ghost" size="sm">
                        <Bookmark className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {videos.length === 0 && (
              <div className="col-span-full text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Play className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No videos available</h3>
                <p className="text-gray-600">Videos will be added as you progress through topics</p>
              </div>
            )}
          </div>
        )}
      </main>
    </>
  );
}
