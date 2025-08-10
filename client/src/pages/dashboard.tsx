import { useQuery } from "@tanstack/react-query";
import { BookOpen, Clock, Play, Bookmark as BookmarkIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import SearchBar from "@/components/search-bar";
import PdfViewer from "@/components/pdf-viewer";
import VideoPlayer from "@/components/video-player";
import ProgressRing from "@/components/progress-ring";
import type { StudyProgress, Topic, StudyGuide, Video, ScheduleItem, Bookmark } from "@shared/schema";

export default function Dashboard() {
  const { data: progress } = useQuery<StudyProgress>({
    queryKey: ['/api/study-progress'],
  });

  const { data: topics = [] } = useQuery<Topic[]>({
    queryKey: ['/api/topics'],
  });

  const { data: studyGuides = [] } = useQuery<StudyGuide[]>({
    queryKey: ['/api/study-guides'],
  });

  const { data: videos = [] } = useQuery<Video[]>({
    queryKey: ['/api/videos'],
  });

  const { data: todaySchedule = [] } = useQuery<ScheduleItem[]>({
    queryKey: ['/api/schedule', new Date().toISOString().split('T')[0]],
  });

  const { data: recentBookmarks = [] } = useQuery<Bookmark[]>({
    queryKey: ['/api/bookmarks'],
  });

  const currentStudyGuide = studyGuides[0] || null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-complete-green";
      case "in-progress": return "bg-progress-yellow";
      default: return "bg-not-started-gray";
    }
  };

  const getBookmarkIcon = (type: string) => {
    switch (type) {
      case "video": return <Play className="w-4 h-4 text-blue-600" />;
      case "note": return <BookmarkIcon className="w-4 h-4 text-green-600" />;
      default: return <BookOpen className="w-4 h-4 text-yellow-600" />;
    }
  };

  return (
    <>
      {/* Top Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-medium text-gray-900">Dashboard</h2>
            <p className="text-gray-600">Welcome back! Continue your CNS studies</p>
          </div>
          
          <SearchBar />
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="flex-1 overflow-y-auto p-6">
        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Topics Completed</p>
                  <p className="text-2xl font-semibold text-gray-900">{progress?.completedTopics || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Study Hours</p>
                  <p className="text-2xl font-semibold text-gray-900">{progress?.studyHours || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Play className="w-6 h-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Videos Watched</p>
                  <p className="text-2xl font-semibold text-gray-900">{progress?.videosWatched || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BookmarkIcon className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Bookmarks</p>
                  <p className="text-2xl font-semibold text-gray-900">{progress?.bookmarkCount || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Current Study Focus */}
          <div className="lg:col-span-2 space-y-8">
            {/* Current Study Guide */}
            <PdfViewer 
              studyGuide={currentStudyGuide} 
              showUploadInterface={!currentStudyGuide}
            />

            {/* Related Videos Section */}
            <VideoPlayer videos={videos} />
          </div>

          {/* Right Column - Study Planning & Progress */}
          <div className="space-y-8">
            {/* Study Schedule Widget */}
            <Card>
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Today's Schedule</h3>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    Add Task
                  </button>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="space-y-4">
                  {todaySchedule.slice(0, 4).map((item) => (
                    <div key={item._id.toString()} className="flex items-start space-x-3">
                      <div className={`w-2 h-2 rounded-full mt-2 ${getStatusColor(item.status)}`} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${item.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(item.startTime).toLocaleTimeString()} - {new Date(item.endTime).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {todaySchedule.length === 0 && (
                    <p className="text-gray-500 text-sm">No scheduled tasks for today</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Topic Progress Tracker */}
            <Card>
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Topic Progress</h3>
              </div>
              
              <CardContent className="p-6">
                <div className="space-y-4">
                  {topics.map((topic) => (
                    <div key={topic._id}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900">{topic.name}</span>
                        <span className="text-sm text-gray-600">0%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-not-started-gray"
                          style={{ width: '0%' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Bookmarks */}
            <Card>
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">Recent Bookmarks</h3>
                  <a href="/bookmarks" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View All
                  </a>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="space-y-3">
                  {recentBookmarks.slice(0, 3).map((bookmark) => (
                    <div key={bookmark._id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                      <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        {getBookmarkIcon(bookmark.resourceType)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{bookmark.title}</p>
                        <p className="text-xs text-gray-500">{bookmark.description}</p>
                      </div>
                    </div>
                  ))}
                  {recentBookmarks.length === 0 && (
                    <p className="text-gray-500 text-sm">No bookmarks yet</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </>
  );
}
