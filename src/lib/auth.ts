import { supabase } from "./supabase";

export const handleAuthStateChange = async (event: string, session: any) => {
  if (event === "SIGNED_IN") {
    const { user } = session;

    // Check if user exists
    const { data: existingUser } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!existingUser) {
      // Get GitHub user data from user.user_metadata
      const { user_metadata } = user;

      // Create new user profile
      await supabase.from("profiles").insert({
        id: user.id,
        username: user_metadata.user_name,
        github_username: user_metadata.user_name,
        github_avatar_url: user_metadata.avatar_url,
        github_id: user_metadata.sub,
        github_bio: user_metadata.bio,
        total_exp: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
  }
};

export const getWeeklyLeaderboard = async () => {
  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

  const { data, error } = await supabase
    .from("github_activities")
    .select("user_id, sum(points)")
    .gte("created_at", startOfWeek.toISOString())
    .group("user_id")
    .order("sum", { ascending: false });

  if (error) throw error;
  return data;
};

export const getMonthlyLeaderboard = async () => {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);

  const { data, error } = await supabase
    .from("github_activities")
    .select("user_id, sum(points)")
    .gte("created_at", startOfMonth.toISOString())
    .group("user_id")
    .order("sum", { ascending: false });

  if (error) throw error;
  return data;
};
