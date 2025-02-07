import React from "react";
import DashboardHeader from "./dashboard/DashboardHeader";
import LeaderboardPanel from "./dashboard/LeaderboardPanel";
import ActivityFeed from "./dashboard/ActivityFeed";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, GitCommit } from "lucide-react";
import { useAuth, useProfile } from "@/lib/hooks";
import { supabase } from "@/lib/supabase";

interface HomeProps {
  isAuthenticated?: boolean;
  userProfile?: {
    name: string;
    avatarUrl: string;
    level: number;
    xp: number;
    achievements: Array<{
      id: string;
      name: string;
      description: string;
    }>;
  };
}

const defaultProfile = {
  name: "John Doe",
  avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
  level: 5,
  xp: 450,
  achievements: [
    {
      id: "1",
      name: "First Commit",
      description: "Made your first commit",
    },
    {
      id: "2",
      name: "Pull Request Pro",
      description: "Created 10 pull requests",
    },
    {
      id: "3",
      name: "Merge Master",
      description: "Successfully merged 5 PRs",
    },
  ],
};

const Home = () => {
  const { session } = useAuth();
  const { profile } = useProfile(session?.user?.id);

  const handleLogin = () => {
    supabase.auth.signInWithOAuth({
      provider: "github",
    });
  };

  const handleLogout = () => {
    supabase.auth.signOut();
  };
  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader
        isAuthenticated={!!session}
        userProfile={profile || defaultProfile}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col xl:flex-row gap-8">
          {/* Left column - Leaderboard */}
          <div className="flex-1">
            <LeaderboardPanel />
          </div>

          {/* Right column - User Profile and Activity Feed */}
          <div className="w-full xl:w-[480px] space-y-8">
            {/* User Profile Card */}
            <Card className="p-6 bg-background">
              <div className="flex flex-col space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Your Progress</h2>
                  <Trophy className="w-6 h-6 text-yellow-500" />
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">
                        Level {profile?.level || defaultProfile.level}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {profile?.xp || defaultProfile.xp} XP
                      </span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium flex items-center gap-2">
                      <Star className="w-4 h-4" /> Recent Achievements
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                      {(
                        profile?.achievements || defaultProfile.achievements
                      ).map((achievement) => (
                        <div
                          key={achievement.id}
                          className="flex items-center space-x-2 p-2 rounded-lg bg-muted/50"
                        >
                          <GitCommit className="w-4 h-4 text-primary" />
                          <div>
                            <p className="text-sm font-medium">
                              {achievement.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {achievement.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Activity Feed */}
            <ActivityFeed />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
