import { Link, useLocation } from "wouter";
import { Brain, Home, Book, PlayCircle, Calendar, Bookmark, StickyNote, ChevronRight, LogOut, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import ProgressRing from "./progress-ring";
import { useAuth } from "@/contexts/AuthContext";
import type { Topic, StudyProgress } from "@shared/schema";

export default function Sidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  
  const { data: topics = [] } = useQuery<Topic[]>({
    queryKey: ['/api/topics'],
  });
  
  const { data: progress } = useQuery<StudyProgress>({
    queryKey: ['/api/study-progress'],
  });

  const getProgressColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-complete-green";
      case "in-progress": return "bg-progress-yellow";
      default: return "bg-not-started-gray";
    }
  };

  const overallProgress = progress ? Math.round((progress.completedTopics / progress.totalTopics) * 100) : 0;

  const navItems = [
    { path: "/", icon: Home, label: "Dashboard" },
    { path: "/study-guides", icon: Book, label: "Study Guides" },
    { path: "/videos", icon: PlayCircle, label: "Video Resources" },
    { path: "/schedule", icon: Calendar, label: "Study Schedule" },
    { path: "/bookmarks", icon: Bookmark, label: "Bookmarks" },
    { path: "/notes", icon: StickyNote, label: "Notes" },
  ];

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-medical-blue rounded-lg flex items-center justify-center">
            <Brain className="text-white w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-medium text-gray-900">CNS Study Planner</h1>
            <p className="text-sm text-gray-500">Central Nervous System Module</p>
          </div>
        </div>
      </div>

      {/* Study Progress Overview */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Overall Progress</h3>
        <div className="flex items-center space-x-4">
          <ProgressRing progress={overallProgress} size={64} />
          <div className="flex-1">
            <div className="text-sm text-gray-600">
              {progress?.completedTopics || 0} of {progress?.totalTopics || 0} topics completed
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {(progress?.totalTopics || 0) - (progress?.completedTopics || 0)} topics remaining
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-2">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <div className={cn(
                "flex items-center px-3 py-2 rounded-lg font-medium transition-colors cursor-pointer",
                location === item.path
                  ? "bg-medical-blue text-white"
                  : "text-gray-700 hover:bg-gray-100"
              )}>
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </div>
            </Link>
          ))}
        </div>

        {/* CNS Topics Section */}
        <div className="p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">CNS Topics</h3>
          <div className="space-y-2">
            {topics.map((topic) => (
              <div key={topic.id} className="topic-item">
                <button className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center">
                    <div className={cn("w-2 h-2 rounded-full mr-3", getProgressColor(topic.status))} />
                    <span className="text-sm">{topic.name}</span>
                  </div>
                  <ChevronRight className="w-3 h-3 text-gray-400" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || "user@example.com"}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className="h-8 w-8 text-gray-500 hover:text-red-600"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
