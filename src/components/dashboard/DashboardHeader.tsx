import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Github, Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DashboardHeaderProps {
  isAuthenticated?: boolean;
  userProfile?: {
    name: string;
    avatarUrl: string;
    level: number;
    xp: number;
  };
  onLogin?: () => void;
  onLogout?: () => void;
}

const DashboardHeader = ({
  isAuthenticated = false,
  userProfile = {
    name: "John Doe",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=default",
    level: 1,
    xp: 0,
  },
  onLogin = () => console.log("Login clicked"),
  onLogout = () => console.log("Logout clicked"),
}: DashboardHeaderProps) => {
  return (
    <header className="w-full h-16 sm:h-20 bg-background border-b border-border px-3 sm:px-4 flex items-center justify-between">
      {/* Left section - Logo/Title */}
      <div className="flex items-center space-x-2">
        <Github className="w-8 h-8" />
        <h1 className="text-lg sm:text-xl font-bold hidden sm:block">
          GitHub XP Tracker
        </h1>
        <h1 className="text-lg font-bold sm:hidden">XP Tracker</h1>
      </div>

      {/* Right section - Auth/Profile */}
      <div className="flex items-center space-x-4">
        {isAuthenticated ? (
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex flex-col items-end">
              <span className="font-medium">{userProfile.name}</span>
              <span className="text-sm text-muted-foreground">
                Level {userProfile.level} • {userProfile.xp} XP
              </span>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src={userProfile.avatarUrl}
                    alt={userProfile.name}
                  />
                  <AvatarFallback>{userProfile.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem className="md:hidden">
                  <div className="flex flex-col">
                    <span className="font-medium">{userProfile.name}</span>
                    <span className="text-sm text-muted-foreground">
                      Level {userProfile.level} • {userProfile.xp} XP
                    </span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onLogout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <Button
            onClick={onLogin}
            className="flex items-center space-x-2"
            variant="outline"
          >
            <Github className="w-4 h-4" />
            <span>Login with GitHub</span>
          </Button>
        )}

        {/* Mobile menu button */}
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
};

export default DashboardHeader;
