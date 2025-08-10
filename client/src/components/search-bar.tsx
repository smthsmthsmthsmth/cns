import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import PdfUpload from "./pdf-upload";

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: searchResults, refetch } = useQuery({
    queryKey: ['/api/search', searchQuery],
    enabled: searchQuery.length > 2,
  });

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    if (value.length > 2) {
      refetch();
    }
  };

  return (
    <div className="flex items-center space-x-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Search topics, videos, notes..."
          className="w-80 pl-10"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>
      
      <PdfUpload />
    </div>
  );
}
