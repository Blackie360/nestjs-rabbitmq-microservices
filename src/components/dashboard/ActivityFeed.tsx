import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useActivityFeed } from "@/lib/hooks";
import { formatDistanceToNow } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GitCommit, GitPullRequest, GitFork, GitMerge } from "lucide-react";

interface ActivityEvent {
  id: string;
  type: "commit" | "pull_request" | "repo_creation" | "merge";
  user: string;
  xp: number;
  timestamp: string;
}

interface ActivityFeedProps {
  events?: ActivityEvent[];
}

const defaultEvents: ActivityEvent[] = [
  {
    id: "1",
    type: "commit",
    user: "Sarah Chen",
    xp: 10,
    timestamp: "2 minutes ago",
  },
  {
    id: "2",
    type: "pull_request",
    user: "John Doe",
    xp: 50,
    timestamp: "15 minutes ago",
  },
  {
    id: "3",
    type: "merge",
    user: "Mike Johnson",
    xp: 30,
    timestamp: "1 hour ago",
  },
  {
    id: "4",
    type: "repo_creation",
    user: "Emma Wilson",
    xp: 100,
    timestamp: "2 hours ago",
  },
];

const ActivityIcon = ({ type }: { type: ActivityEvent["type"] }) => {
  switch (type) {
    case "commit":
      return <GitCommit className="h-4 w-4" />;
    case "pull_request":
      return <GitPullRequest className="h-4 w-4" />;
    case "repo_creation":
      return <GitFork className="h-4 w-4" />;
    case "merge":
      return <GitMerge className="h-4 w-4" />;
  }
};

const ActivityFeed = () => {
  const { activities, loading } = useActivityFeed();
  const [filter, setFilter] = React.useState("all");
  return (
    <Card className="w-full h-full p-3 sm:p-4 bg-background">
      <div className="flex justify-between items-center mb-4 gap-2">
        <h2 className="text-lg sm:text-xl font-semibold">Activity Feed</h2>
        <Select defaultValue="all">
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Activity</SelectItem>
            <SelectItem value="commits">Commits</SelectItem>
            <SelectItem value="prs">Pull Requests</SelectItem>
            <SelectItem value="merges">Merges</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <ScrollArea className="h-[calc(100%-60px)]">
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <span className="text-sm text-muted-foreground">
                Loading activities...
              </span>
            </div>
          ) : (
            activities
              .filter(
                (activity) =>
                  filter === "all" ||
                  (filter === "commits" && activity.type === "commit") ||
                  (filter === "prs" && activity.type === "pull_request") ||
                  (filter === "merges" && activity.type === "merge"),
              )
              .map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="p-2 rounded-full bg-muted">
                    <ActivityIcon type={activity.type} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user.name}</span>{" "}
                      {activity.type === "commit" && "made a commit"}
                      {activity.type === "pull_request" &&
                        "opened a pull request"}
                      {activity.type === "repo_creation" &&
                        "created a repository"}
                      {activity.type === "merge" && "merged changes"}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        +{activity.xp} XP
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(activity.createdAt))} ago
                      </span>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default ActivityFeed;
