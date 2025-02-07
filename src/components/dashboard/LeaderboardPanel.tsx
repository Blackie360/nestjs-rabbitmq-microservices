import React from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLeaderboard } from "@/lib/hooks";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trophy } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";

interface LeaderboardUser {
  rank: number;
  name: string;
  avatarUrl: string;
  level: number;
  xp: number;
}

interface LeaderboardPanelProps {
  users?: LeaderboardUser[];
}

// Since LeaderboardRow component isn't available, we'll implement the row directly
const LeaderboardRowItem = ({
  rank,
  name,
  avatarUrl,
  level,
  xp,
}: LeaderboardUser) => {
  return (
    <div className="grid grid-cols-12 items-center px-2 sm:px-4 py-3 rounded-lg hover:bg-muted/50 gap-2">
      <div className="col-span-1 font-medium">{rank}</div>
      <div className="col-span-5 flex items-center gap-2 sm:gap-3">
        <Avatar>
          <AvatarImage src={avatarUrl} alt={name} />
          <AvatarFallback>{name.substring(0, 2)}</AvatarFallback>
        </Avatar>
        <span className="font-medium truncate">{name}</span>
      </div>
      <div className="col-span-3">
        <div className="flex flex-col">
          <span className="text-sm font-medium">Level {level}</span>
          <Progress value={75} className="h-2 w-24" />
        </div>
      </div>
      <div className="col-span-3 font-medium">{xp} XP</div>
    </div>
  );
};

const defaultUsers: LeaderboardUser[] = [
  {
    rank: 1,
    name: "Sarah Developer",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    level: 15,
    xp: 1500,
  },
  {
    rank: 2,
    name: "John Coder",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    level: 12,
    xp: 1200,
  },
  {
    rank: 3,
    name: "Mike Engineer",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=mike",
    level: 10,
    xp: 1000,
  },
];

const LeaderboardPanel = () => {
  const [period, setPeriod] = React.useState<"all" | "weekly" | "monthly">(
    "all",
  );
  const { users, loading } = useLeaderboard(period);
  return (
    <Card className="w-full max-w-[900px] h-[600px] p-4 sm:p-6 bg-background border-border">
      <div className="space-y-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <h2 className="text-2xl font-bold">Leaderboard</h2>
          </div>
          <div className="text-sm text-muted-foreground">
            {loading ? "Loading..." : `${users.length} Contributors`}
          </div>
        </div>

        <Tabs
          value={period}
          onValueChange={(v) => setPeriod(v as typeof period)}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Time</TabsTrigger>
            <TabsTrigger value="weekly">This Week</TabsTrigger>
            <TabsTrigger value="monthly">This Month</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="mb-4 px-4 grid grid-cols-12 text-sm font-medium text-muted-foreground">
        <div className="col-span-1">#</div>
        <div className="col-span-5">User</div>
        <div className="col-span-3">Level</div>
        <div className="col-span-3">XP</div>
      </div>

      <ScrollArea className="h-[480px] w-full">
        <div className="space-y-2">
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <span className="text-sm text-muted-foreground">
                Loading leaderboard...
              </span>
            </div>
          ) : (
            users.map((user) => (
              <LeaderboardRowItem
                key={user.rank}
                rank={user.rank}
                name={user.name}
                avatarUrl={user.avatarUrl}
                level={user.level}
                xp={user.xp}
              />
            ))
          )}
        </div>
      </ScrollArea>
    </Card>
  );
};

export default LeaderboardPanel;
