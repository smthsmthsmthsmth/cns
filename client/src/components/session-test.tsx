import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function SessionTest() {
  const { data: topics, isLoading, error, refetch } = useQuery({
    queryKey: ['/api/topics'],
  });

  const { data: progress } = useQuery({
    queryKey: ['/api/study-progress'],
  });

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-medium">Session Test</h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <strong>Topics:</strong> {isLoading ? "Loading..." : error ? `Error: ${error.message}` : `${topics?.length || 0} topics`}
          </div>
          <div>
            <strong>Progress:</strong> {progress ? `User: ${progress.userId}` : "No progress data"}
          </div>
          <div>
            <strong>Study Hours:</strong> {progress?.studyHours || 0}
          </div>
          <Button onClick={() => refetch()}>
            Refresh Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 