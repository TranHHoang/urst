import { supabase } from "./supabase";

export interface UrlData {
  code: string;
  original_url: string;
  clicks: number;
  created_at: string;
  expires_at?: string;
  user_id?: string;
}

export const urlStorage = {
  async set(code: string, url: string, userId?: string): Promise<void> {
    const expiresAt = userId
      ? null
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

    const { error } = await supabase.from("shortened_urls").insert([
      {
        code,
        original_url: url,
        clicks: 0,
        created_at: new Date().toISOString(),
        expires_at: expiresAt,
        user_id: userId,
      },
    ]);

    if (error) {
      console.error("Error storing URL:", error);
      throw error;
    }
  },

  async get(code: string): Promise<string | undefined> {
    const { data, error } = await supabase
      .from("shortened_urls")
      .select("original_url")
      .eq("code", code)
      .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
      .single();

    if (error) {
      console.error("Error fetching URL:", error);
      return undefined;
    }

    // Increment clicks in the background
    this.incrementClicks(code).catch((err) => {
      console.error("Error incrementing clicks:", err);
    });

    return data?.original_url;
  },

  async incrementClicks(code: string): Promise<void> {
    // First get the current click count
    const { data: current } = await supabase
      .from("shortened_urls")
      .select("clicks")
      .eq("code", code)
      .single();

    if (!current) return;

    // Then increment it
    const { error } = await supabase
      .from("shortened_urls")
      .update({ clicks: current.clicks + 1 })
      .eq("code", code);

    if (error) {
      console.error("Error incrementing clicks:", error);
    }
  },

  async has(code: string): Promise<boolean> {
    const { count, error } = await supabase
      .from("shortened_urls")
      .select("code", { count: "exact", head: true })
      .eq("code", code)
      .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`);

    if (error) {
      console.error("Error checking URL existence:", error);
      return false;
    }

    return (count ?? 0) > 0;
  },

  async getUrlData(code: string): Promise<UrlData | undefined> {
    const { data, error } = await supabase
      .from("shortened_urls")
      .select("*")
      .eq("code", code)
      .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
      .single();

    if (error) {
      console.error("Error fetching URL data:", error);
      return undefined;
    }

    return data as UrlData;
  },

  async getRecentUrls(limit: number = 5, userId?: string): Promise<UrlData[]> {
    let query = supabase
      .from("shortened_urls")
      .select("*")
      .order("created_at", { ascending: false });

    if (userId) {
      query = query.eq("user_id", userId);
    } else {
      query = query.is("user_id", null);
    }

    // Add expiration filter
    query = query.or(
      `expires_at.is.null,expires_at.gt.${new Date().toISOString()}`
    );

    const { data, error } = await query.limit(limit);

    if (error) {
      console.error("Error fetching recent URLs:", error);
      return [];
    }

    return data as UrlData[];
  },

  async delete(code: string): Promise<boolean> {
    const { error } = await supabase
      .from("shortened_urls")
      .delete()
      .eq("code", code);

    if (error) {
      console.error("Error deleting URL:", error);
      return false;
    }

    return true;
  },

  async cleanupExpiredUrls(): Promise<void> {
    const { error } = await supabase
      .from("shortened_urls")
      .delete()
      .not("expires_at", "is", null)
      .lt("expires_at", new Date().toISOString());

    if (error) {
      console.error("Error cleaning up expired URLs:", error);
      throw error;
    }
  },
};
