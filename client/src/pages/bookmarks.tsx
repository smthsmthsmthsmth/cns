import { useQuery } from "@tanstack/react-query";
import { Bookmark, Book, Play, StickyNote, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/search-bar";
import type { Bookmark as BookmarkType } from "@shared/schema";

export default function Bookmarks() {
  const { data: bookmarks = [] } = useQuery<BookmarkType[]>({
    queryKey: ['/api/bookmarks'],
  });

  const getBookmarkIcon = (type: string) => {
    switch (type) {
      case "video": return <Play className="w-5 h-5 text-blue-600" />;
      case "note": return <StickyNote className="w-5 h-5 text-green-600" />;
      default: return <Book className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "video": return "Video";
      case "note": return "Note";
      case "pdf": return "PDF";
      default: return "Unknown";
    }
  };

  const groupedBookmarks = bookmarks.reduce((groups, bookmark) => {
    if (!groups[bookmark.type]) {
      groups[bookmark.type] = [];
    }
    groups[bookmark.type].push(bookmark);
    return groups;
  }, {} as Record<string, BookmarkType[]>);

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-medium text-gray-900">Bookmarks</h2>
            <p className="text-gray-600">Your saved study materials</p>
          </div>
          
          <SearchBar onUploadClick={() => {}} />
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6">
        {Object.keys(groupedBookmarks).length > 0 ? (
          <div className="space-y-8">
            {Object.entries(groupedBookmarks).map(([type, items]) => (
              <div key={type}>
                <h3 className="text-lg font-medium text-gray-900 mb-4 capitalize">
                  {getTypeLabel(type)} Bookmarks ({items.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((bookmark) => (
                    <Card key={bookmark.id} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            {getBookmarkIcon(bookmark.type)}
                          </div>
                          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">
                          {bookmark.title}
                        </h4>
                        
                        {bookmark.description && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {bookmark.description}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <div>
                            {bookmark.pageNumber && (
                              <span>Page {bookmark.pageNumber}</span>
                            )}
                            {bookmark.timestamp && (
                              <span>Time {bookmark.timestamp}</span>
                            )}
                          </div>
                          <span>
                            {new Date(bookmark.createdAt!).toLocaleDateString()}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Bookmark className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookmarks yet</h3>
            <p className="text-gray-600">Start bookmarking important content while studying</p>
          </div>
        )}
      </main>
    </>
  );
}
