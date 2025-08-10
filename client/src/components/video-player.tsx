import { useState } from "react";
import { Play, Bookmark, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Video } from "@shared/schema";

interface VideoPlayerProps {
  videos: Video[];
}

export default function VideoPlayer({ videos }: VideoPlayerProps) {
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
    // Open video in new tab
    window.open(video.url, '_blank');
  };

  if (!videos || videos.length === 0) {
    return null;
  }

  return (
    <Card>
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Related Videos</h3>
          <a href="/videos" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All
          </a>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {videos.slice(0, 4).map((video) => (
            <div 
              key={video._id?.toString() || video.url}
              className="group cursor-pointer"
              onClick={() => handleVideoClick(video)}
            >
              <div className="relative rounded-lg overflow-hidden mb-3">
                {video.thumbnailUrl ? (
                  <img 
                    src={video.thumbnailUrl} 
                    alt={video.title}
                    className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <div className="w-full h-32 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                    <Play className="w-8 h-8 text-blue-600" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                    <Play className="w-5 h-5 text-gray-800 ml-1" />
                  </div>
                </div>
                {video.duration && (
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                    {Math.floor(video.duration / 60)}:{(video.duration % 60).toString().padStart(2, '0')}
                  </div>
                )}
              </div>
              <h4 className="font-medium text-gray-900 mb-1">{video.title}</h4>
              <p className="text-sm text-gray-600 mb-2">{video.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">{video.platform}</span>
                <Button variant="ghost" size="sm">
                  <Bookmark className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
