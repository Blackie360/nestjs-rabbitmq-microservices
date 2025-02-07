import { useState, useEffect } from "react";
import { supabase } from "./supabase";
import { handleAuthStateChange } from "./auth";
import { Database } from "@/types/supabase";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type Activity = Database["public"]["Tables"]["github_activities"]["Row"] & {
  profile: Profile;
};

export const useAuth = () => {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      if (session) {
        await handleAuthStateChange(event, session);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return { session, loading };
};

export const useLeaderboard = (
  period: "all" | "weekly" | "monthly" = "all",
) => {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const startDate =
          period === "weekly"
            ? new Date(
                new Date().setDate(new Date().getDate() - new Date().getDay()),
              )
            : period === "monthly"
              ? new Date(new Date().setDate(1))
              : null;

        if (startDate) {
          const { data, error } = await supabase.rpc("get_user_rank", {
            start_date: startDate.toISOString(),
            end_date: new Date().toISOString(),
          });
          if (error) throw error;
          setUsers(data || []);
        } else {
          const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .order("total_exp", { ascending: false });
          if (error) throw error;
          setUsers(data || []);
        }
      } catch (error) {
        console.error("Error loading leaderboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboard();

    const channel = supabase
      .channel("profiles_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "profiles" },
        loadLeaderboard,
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [period]);

  return { users, loading };
};

export const useActivityFeed = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivities = async () => {
      try {
        const { data, error } = await supabase
          .from("github_activities")
          .select(
            `
            *,
            profile:profiles(*)
          `,
          )
          .order("created_at", { ascending: false })
          .limit(50);

        if (error) throw error;
        setActivities(data || []);
      } catch (error) {
        console.error("Error loading activities:", error);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();

    const channel = supabase
      .channel("activities_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "github_activities" },
        loadActivities,
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return { activities, loading };
};

export const useProfile = (userId: string | undefined) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error("Error loading profile:", error);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();

    const channel = supabase
      .channel(`profile_${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${userId}`,
        },
        loadProfile,
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [userId]);

  return { profile, loading };
};
