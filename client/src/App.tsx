import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import StudyGuides from "@/pages/study-guides";
import Videos from "@/pages/videos";
import Schedule from "@/pages/schedule";
import Bookmarks from "@/pages/bookmarks";
import Notes from "@/pages/notes";
import Sidebar from "@/components/sidebar";

function Router() {
  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/study-guides" component={StudyGuides} />
          <Route path="/videos" component={Videos} />
          <Route path="/schedule" component={Schedule} />
          <Route path="/bookmarks" component={Bookmarks} />
          <Route path="/notes" component={Notes} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
